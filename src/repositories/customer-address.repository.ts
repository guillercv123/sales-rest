import {singleton} from "tsyringe";
import {ConnectionMysql} from "../db/mysql";
import {ICustomerAddress} from "../dto/customer-address";

@singleton()
export class CustomerAddressRepository{
    constructor(private readonly connection: ConnectionMysql) {
    }

    async create(req: ICustomerAddress): Promise<number>{
        const conn = await this.connection.getConnection();
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