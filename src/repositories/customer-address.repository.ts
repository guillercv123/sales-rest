import {singleton} from "tsyringe";
import {ConnectionMysql} from "../db/mysql";
import {ICustomerAddress} from "../dto/customer-address";
import {PoolConnection} from "mysql2/promise";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {MySQLErrorParser} from "../utils/mysql-error.parser";

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

    async findByCustomerId(conn: PoolConnection, customerId: number): Promise<ICustomerAddress[]> {
        try {
            const [rows] = await conn.execute<RowDataPacket[]>(
                `SELECT address_id as addressId, customer_id as customerId, street, reference, 
                    postal_code as postalCode, is_primary as isPrimary, ubigeo_code as ubigeo
             FROM customer_address 
             WHERE customer_id = ?`,
                [customerId]
            );
            return rows as ICustomerAddress[];
        } catch (error) {
            throw MySQLErrorParser.parse(error);
        }
    }


    async createWithConnection(conn: PoolConnection, req: ICustomerAddress): Promise<number> {
        const [result]: any = await conn.execute(
            `INSERT INTO customer_address (
                customer_id,
                street, reference,
                postal_code, is_primary,
                ubigeo_code) VALUES (?,?,?,?,?,?);`,
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

    async updateWithConnection(conn: PoolConnection, addressId: number | undefined, req: ICustomerAddress): Promise<void> {
        const [result] = await conn.execute<ResultSetHeader>(
            `UPDATE customer_address 
         SET customer_id = ?,
             street = ?,
             reference = ?,
             postal_code = ?,
             is_primary = ?,
             ubigeo_code = ?
         WHERE address_id = ?`,
            [
                req.customerId,
                req.street,
                req.reference,
                req.postalCode,
                req.isPrimary,
                req.ubigeo,
                addressId
            ]
        );

        if (result.affectedRows === 0) {
            throw new Error(`Customer address with id ${addressId} not found`);
        }
    }

    async deleteWithConnection(conn: PoolConnection, addressId: number | undefined): Promise<void> {
        try {
            const [result] = await conn.execute<ResultSetHeader>(
                `DELETE FROM customer_address WHERE address_id = ?`,
                [addressId]
            );

            if (result.affectedRows === 0) {
                throw new Error(`Customer address with id ${addressId} not found`);
            }
        } catch (error) {
            throw MySQLErrorParser.parse(error);
        }
    }
}