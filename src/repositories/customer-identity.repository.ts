import {singleton} from "tsyringe";
import {ConnectionMysql} from "../db/mysql";
import {ICustomerIdentity} from "../dto/customer-identity";
import {ICustomerIdentityRepository} from "./implements/customer-identity-repository.interface";
import {PoolConnection, ResultSetHeader} from "mysql2/promise";
import {MySQLErrorParser} from "../utils/mysql-error.parser";

@singleton()
export class CustomerIdentityRepository implements ICustomerIdentityRepository {
    constructor(private readonly connection: ConnectionMysql) {}

    async create(req: ICustomerIdentity): Promise<number> {
        const conn = await this.connection.getConnection();
        try {
            return await this.createWithConnection(conn, req);
        } catch (error) {
            throw MySQLErrorParser.parse(error);
        } finally {
            conn.release();
        }
    }

    async createWithConnection(conn: PoolConnection, req: ICustomerIdentity): Promise<number> {
        try {
            const [result] = await conn.execute<ResultSetHeader>(
                `INSERT INTO customer_identity (
                    customer_id, type_document_id, id_number, is_primary
                ) VALUES (?, ?, ?, ?)`,
                [
                    req.customerId,
                    req.typeDocumentId,
                    req.idNumber,
                    req.isPrimary ?? true
                ]
            );
            return result.insertId;
        } catch (error) {
            throw MySQLErrorParser.parse(error);
        }
    }

    async updateWithConnection(conn: PoolConnection, identityId: number | undefined, req: ICustomerIdentity): Promise<void> {
        try {
            const [result] = await conn.execute<ResultSetHeader>(
                `UPDATE customer_identity
                 SET customer_id = ?,
                     type_document_id = ?,
                     id_number = ?,
                     is_primary = ?
                 WHERE identity_id = ?`,
                [
                    req.customerId,
                    req.typeDocumentId,
                    req.idNumber,
                    req.isPrimary ?? true,
                    identityId
                ]
            );

            if (result.affectedRows === 0) {
                throw new Error(`Customer identity with id ${identityId} not found`);
            }
        } catch (error) {
            throw MySQLErrorParser.parse(error);
        }
    }


}