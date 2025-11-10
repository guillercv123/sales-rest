import {singleton} from "tsyringe";
import {ConnectionMysql} from "../db/mysql";
import {ICustomerIdentity} from "../dto/customer-identity";
import {ICustomerIdentityRepository} from "./interfaces/customer-identity-repository.interface";
import {PoolConnection, ResultSetHeader} from "mysql2/promise";

@singleton()
export class CustomerIdentityRepository implements ICustomerIdentityRepository {
    constructor(private readonly connection: ConnectionMysql) {}

    async create(req: ICustomerIdentity): Promise<number> {
        const conn = await this.connection.getConnection();
        try {
            return await this.createWithConnection(conn, req);
        } catch (error) {
           throw new Error(`Failed to create customer identity: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            conn.release();
        }
    }

    async createWithConnection(conn: PoolConnection, req: ICustomerIdentity): Promise<number> {
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
    }
}