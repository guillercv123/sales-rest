import {singleton} from "tsyringe";
import {ICustomerRepository} from "./implements/customer-repository.interface";
import {ConnectionMysql} from "../db/mysql";
import {ICustomerCreateRequest} from "../dto/customer-create-request";
import {CustomerIdentityRepository} from "./customer-identity.repository";
import {CustomerAddressRepository} from "./customer-address.repository";
import {PoolConnection, ResultSetHeader} from "mysql2/promise";
import {MySQLErrorParser} from "../utils/mysql-error.parser";
import {ICustomerListQuery} from "../dto/customer-list-query.dto";
import {IPaginatedResponse} from "../dto/pagination.dto";
import {ICustomer} from "../dto/customer";
import {PaginationHelper} from "../utils/pagination.helper";
import {RowDataPacket} from "mysql2";
import {ICustomerSummary} from "../dto/customer-summary.dto";
import {AuditLogRepository} from "./audit-log.repository";
import {ICustomerAddress} from "../dto/customer-address";

@singleton()
export class CustomerRepository implements ICustomerRepository {
    constructor(
        private readonly connection: ConnectionMysql,
        private readonly customerIdentityRepository: CustomerIdentityRepository,
        private readonly customerAddressRepository: CustomerAddressRepository,
        private readonly auditLogRepository: AuditLogRepository
    ) {
    }

    async create(req: ICustomerCreateRequest): Promise<number> {
        const conn = await this.connection.getConnection();

        try {
            await conn.beginTransaction();

            const customerId = await this.insertCustomer(conn, req.customer);

            await this.customerIdentityRepository.createWithConnection(
                conn,
                {...req.identity, customerId}
            );

            if (req.address && req.address.length > 0) {
                for (const address of req.address) {
                    await this.customerAddressRepository.createWithConnection(
                        conn,
                        { ...address, customerId }
                    );
                }
            }
            await this.auditLogRepository.createWithConnection(conn, {
                entity: 'customer',
                entity_id: customerId,
                action: 'INSERT',
                changed_by: req.customer.createdBy || 'system',
                diff: {after: req.customer}
            });
            await conn.commit();
            return customerId;

        } catch (error) {
            await conn.rollback();
            throw MySQLErrorParser.parse(error);
        } finally {
            conn.release();
        }
    }

    async update(req: ICustomerCreateRequest, customerId: number): Promise<number> {
        const conn = await this.connection.getConnection();
        try {
            await conn.beginTransaction();

            await this.updateCustomer(conn, customerId, req.customer);

            if (req.identity && req.identity.identityId) {
                await this.customerIdentityRepository.updateWithConnection(
                    conn,
                    req.identity.identityId,
                    { ...req.identity, customerId }
                );
            } else if (req.identity) {
                await this.customerIdentityRepository.createWithConnection(
                    conn,
                    { ...req.identity, customerId }
                );
            }

            await this.syncCustomerAddresses(conn, customerId, req.address || []);

            await this.auditLogRepository.createWithConnection(conn, {
                entity: 'customer',
                entity_id: customerId,
                action: 'UPDATE',
                changed_by: req.customer.updatedBy || req.customer.createdBy || 'system',
                diff: {
                    after: {
                        customer: req.customer,
                        identity: req.identity,
                        addresses: req.address || []
                    }
                }
            });

            await conn.commit();
            return customerId;
        } catch (error) {
            await conn.rollback();
            throw MySQLErrorParser.parse(error);
        } finally {
            conn.release();
        }
    }

    private async insertCustomer(conn: PoolConnection, customer: any): Promise<number> {
        try {
            const [result] = await conn.execute<ResultSetHeader>(
                `INSERT INTO customer (person_type_id, first_name, middle_name, last_name,
                                       birth_date, legal_name, trade_name, email_main, phone_main, created_at, created_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    customer.personTypeId,
                    customer.firstName ?? null,
                    customer.middleName ?? null,
                    customer.lastName ?? null,
                    customer.birthDate ?? null,
                    customer.legalName ?? null,
                    customer.tradeName ?? null,
                    customer.emailMain ?? null,
                    customer.phoneMain ?? null,
                    customer.createdAt ?? null,
                    customer.createdBy ?? null
                ]
            );
            return result.insertId;
        }catch(error) {
            throw MySQLErrorParser.parse(error);
        }
    }

    private async updateCustomer(conn: PoolConnection, customerId: number, customer: any): Promise<number> {
        try {
            const [result] = await conn.execute<ResultSetHeader>(
                `UPDATE customer
                 SET person_type_id = ?,
                     first_name = ?,
                     middle_name = ?,
                     last_name = ?,
                     birth_date = ?,
                     legal_name = ?,
                     trade_name = ?,
                     email_main = ?,
                     phone_main = ?,
                     updated_by = ?
                 WHERE customer_id = ?`,
                [
                    customer.personTypeId,
                    customer.firstName ?? null,
                    customer.middleName ?? null,
                    customer.lastName ?? null,
                    customer.birthDate ?? null,
                    customer.legalName ?? null,
                    customer.tradeName ?? null,
                    customer.emailMain ?? null,
                    customer.phoneMain ?? null,
                    customer.updatedBy ?? null,
                    customerId
                ]
            );

            if (result.affectedRows === 0) {
                throw new Error(`Customer with id ${customerId} not found`);
            }

            return result.affectedRows;
        } catch(error) {
            throw MySQLErrorParser.parse(error);
        }
    }

    private async syncCustomerAddresses(
        conn: PoolConnection,
        customerId: number,
        requestAddresses: ICustomerAddress[]
    ): Promise<void> {
        let created = 0;
        let updated = 0;
        let deleted = 0;

        // Obtener direcciones actuales en BD
        const existingAddresses = await this.customerAddressRepository.findByCustomerId(conn, customerId);
        const existingIds = existingAddresses.map(addr => addr.addressId);

        // IDs que vienen en el request
        const requestIds = requestAddresses
            .filter(addr => addr.addressId)
            .map(addr => addr.addressId!);

        // 1. ELIMINAR: Direcciones que existen en BD pero NO vienen en el request
        // @ts-ignore
        const idsToDelete = existingIds.filter(id => !requestIds.includes(id));
        for (const addressId of idsToDelete) {
            const wasDeleted = await this.customerAddressRepository.deleteWithConnection(conn, addressId);
            // @ts-ignore
            if (wasDeleted) deleted++;
        }

        // 2. ACTUALIZAR o CREAR: Procesar cada dirección del request
        for (const address of requestAddresses) {
            if (address.addressId) {
                // ACTUALIZAR solo si hay cambios reales
                const existingAddress = existingAddresses.find(addr => addr.addressId === address.addressId);

                if (existingAddress && this.hasAddressChanged(existingAddress, address)) {
                    const wasUpdated = await this.customerAddressRepository.updateWithConnection(
                        conn,
                        address.addressId,
                        { ...address, customerId }
                    );
                    // @ts-ignore
                    if (wasUpdated) updated++;
                }
            } else {
                // CREAR nueva dirección
                await this.customerAddressRepository.createWithConnection(
                    conn,
                    { ...address, customerId }
                );
                created++;
            }
        }
    }

    private hasAddressChanged(existing: ICustomerAddress, requested: ICustomerAddress): boolean {
        return (
            existing.street !== requested.street ||
            (existing.reference ?? null) !== (requested.reference ?? null) ||
            (existing.postalCode ?? null) !== (requested.postalCode ?? null) ||
            (existing.isPrimary ?? false) !== (requested.isPrimary ?? false) ||
            (existing.ubigeo ?? null) !== (requested.ubigeo ?? null)
        );
    }

    async findAll(query: ICustomerListQuery): Promise<IPaginatedResponse<ICustomerSummary>> {
        const conn = await this.connection.getConnection();

        try {
            const { page, limit, offset, sortBy, sortOrder } =
                PaginationHelper.validateAndNormalize(query);

            const conditions: string[] = [];
            const params: any[] = [];

            conditions.push('c.status = ?');
            params.push('active');

            if (query.search) {
                conditions.push(`(
                c.first_name LIKE ? OR 
                c.last_name LIKE ? OR 
                c.legal_name LIKE ? OR 
                c.email_main LIKE ? OR
                ci.id_number LIKE ?
            )`);
                const searchTerm = `%${query.search}%`;
                params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
            }

            if (query.personTypeId) {
                conditions.push('c.person_type_id = ?');
                params.push(query.personTypeId);
            }

            const whereClause = conditions.length > 0
                ? `WHERE ${conditions.join(' AND ')}`
                : '';

            // Count query
            const countQuery = `
                SELECT COUNT(DISTINCT c.customer_id) as total
                FROM customer c
                         LEFT JOIN customer_identity ci ON c.customer_id = ci.customer_id
                    ${whereClause}
            `;

            const [countResult] = await conn.query<RowDataPacket[]>(countQuery, params);
            const totalItems = countResult[0].total;

            // Data query con información resumida
            const dataQuery = `
            SELECT 
                c.customer_id as customerId,
                c.person_type_id as personTypeId,
                (SELECT CONCAT(pt.description) FROM person_type pt 
                        where pt.person_type_id = c.person_type_id
                 LIMIT 1) as personType,
                CASE 
                    WHEN c.person_type_id = 1 THEN CONCAT(c.first_name, ' ', COALESCE(c.middle_name, ''), ' ', c.last_name)
                    ELSE c.legal_name
                END as fullName,
                c.email_main as emailMain,
                c.phone_main as phoneMain,
                c.created_at as createdAt,
                -- Documento principal (el primero)
                (SELECT CONCAT(td.description, ': ', ci2.id_number)
                 FROM customer_identity ci2
                 LEFT JOIN type_document td ON ci2.type_document_id = td.type_document_id
                 WHERE ci2.customer_id = c.customer_id
                 ORDER BY ci2.identity_id
                 LIMIT 1
                ) as primaryDocument,
                -- Cantidad de documentos
                (SELECT COUNT(*)
                 FROM customer_identity ci3
                 WHERE ci3.customer_id = c.customer_id
                ) as documentsCount,
                -- Dirección principal o cantidad
                (SELECT CONCAT(ca.street, ', ', ca.reference)
                 FROM customer_address ca
                 WHERE ca.customer_id = c.customer_id
                 ORDER BY ca.address_id
                 LIMIT 1
                ) as primaryAddress,
                -- Cantidad de direcciones
                (SELECT COUNT(*)
                 FROM customer_address ca2
                 WHERE ca2.customer_id = c.customer_id
                ) as addressesCount
            FROM customer c
            LEFT JOIN customer_identity ci ON c.customer_id = ci.customer_id
            ${whereClause}
            GROUP BY c.customer_id
            ORDER BY c.${sortBy} ${sortOrder}
            LIMIT ? OFFSET ?
        `;

            const [rows] = await conn.query<RowDataPacket[]>(
                dataQuery,
                [...params, limit, offset]
            );

            const customers: ICustomerSummary[] = rows.map(row => ({
                customerId: row.customerId,
                personTypeId: row.personTypeId,
                personType: row.personType,
                fullName: row.fullName,
                emailMain: row.emailMain,
                phoneMain: row.phoneMain,
                primaryDocument: row.primaryDocument,
                documentsCount: row.documentsCount,
                primaryAddress: row.primaryAddress,
                addressesCount: row.addressesCount,
                createdAt: row.createdAt
            }));

            const meta = PaginationHelper.createMeta(page, limit, totalItems);

            return {
                success: true,
                data: customers,
                meta
            };

        } catch (error) {
            throw MySQLErrorParser.parse(error);
        } finally {
            conn.release();
        }
    }

    async findById(id: number): Promise<ICustomer | null> {
        const conn = await this.connection.getConnection();

        try {
            const [rows] = await conn.query<RowDataPacket[]>(
                `SELECT 
                    c.customer_id,
                    c.person_type_id as personTypeId,
                    c.first_name as firstName,
                    c.middle_name as middleName,
                    c.last_name as lastName,
                    c.birth_date as birthDate,
                    c.legal_name as legalName,
                    c.trade_name as tradeName,
                    c.email_main as emailMain,
                    c.phone_main as phoneMain,
                    c.created_at as createdAt,
                    c.updated_at as updatedAt
                FROM customer c
                WHERE c.customer_id = ?`,
                [id]
            );

            if (rows.length === 0) {
                return null;
            }

            return rows[0] as ICustomer;

        } catch (error) {
            throw MySQLErrorParser.parse(error);
        } finally {
            conn.release();
        }
    }

    async delete(id: number): Promise<boolean> {
        const conn = await this.connection.getConnection();

        try {
            const [result] = await conn.execute<ResultSetHeader>(
                `UPDATE customer 
             SET status = 'inactive', 
                 updated_at = CURRENT_TIMESTAMP
             WHERE customer_id = ? AND status = 'active'`,
                [id]
            );

            return result.affectedRows > 0;

        } catch (error) {
            throw MySQLErrorParser.parse(error);
        } finally {
            conn.release();
        }
    }
}