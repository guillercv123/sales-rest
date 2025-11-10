import {singleton} from "tsyringe";
import {ICustomerRepository} from "./interfaces/customer-repository.interface";
import {ConnectionMysql} from "../db/mysql";
import {ICustomerCreateRequest} from "../dto/customer-create-request";
import {CustomerIdentityRepository} from "./customer-identity.repository";
import {CustomerAddressRepository} from "./customer-address.repository";
import {PoolConnection, ResultSetHeader} from "mysql2/promise";

@singleton()
export class CustomerRepository implements ICustomerRepository {
    constructor(
        private readonly connection: ConnectionMysql,
        private readonly customerIdentityRepository: CustomerIdentityRepository,
        private readonly customerAddressRepository: CustomerAddressRepository
    ) {}

    async create(req: ICustomerCreateRequest): Promise<number> {
        const conn = await this.connection.getConnection();

        try {
            await conn.beginTransaction();

            const customerId = await this.insertCustomer(conn, req.customer);

            await this.customerIdentityRepository.createWithConnection(
                conn,
                {...req.identity, customerId}
            );

            if (req.address) {
                await this.customerAddressRepository.createWithConnection(
                    conn,
                    {...req.address, customerId}
                );
            }

            await conn.commit();
            return customerId;

        } catch (error) {
            await conn.rollback();
            throw new Error(`Failed to create customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            conn.release();
        }
    }

    private async insertCustomer(conn: PoolConnection, customer: any): Promise<number> {
        const [result] = await conn.execute<ResultSetHeader>(
            `INSERT INTO customer (
                person_type_id, first_name, middle_name, last_name, 
                birth_date, legal_name, trade_name, email_main, phone_main
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                customer.personTypeId,
                customer.firstName ?? null,
                customer.middleName ?? null,
                customer.lastName ?? null,
                customer.birthDate ?? null,
                customer.legalName ?? null,
                customer.tradeName ?? null,
                customer.emailMain ?? null,
                customer.phoneMain ?? null
            ]
        );
        return result.insertId;
    }
}