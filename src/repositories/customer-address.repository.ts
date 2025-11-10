import {singleton} from "tsyringe";
import {ConnectionMysql} from "../db/mysql";
import {ICustomerAddress} from "../dto/customer-address";
import {PoolConnection} from "mysql2/promise";

@singleton()
export class CustomerAddressRepository{
    constructor(private readonly connection: ConnectionMysql) {
    }

    async create(req: ICustomerAddress): Promise<number>{
        const conn = await this.connection.getConnection();
        try {
            return await this.createWithConnection(conn, req);
        } catch (error) {
            throw new Error(`Failed to create customer identity: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            conn.release();
        }
    }


    async createWithConnection(conn: PoolConnection, req: ICustomerAddress): Promise<number> {
        const [result]: any = await conn.execute(
            `INSERT INTO customer_address (
                customer_id, street,
                street, reference,
                postal_code, is_primary,
                ubigeo_code) VALUES (?,?,?,?,?,?,?);`,
            [
                req.customerId,
                req.street,
                req.reference,
                req.postalCode,
                req.isPrimary,
                req.ubigeo
            ]
        );
        return result.insertId;
    }
}