import {singleton} from "tsyringe";
import {ConnectionMysql} from "../db/mysql";
import {ICustomerIdentity} from "../dto/customer-identity";
import {ICustomerIdentityRepository} from "./interfaces/customer-identity-repository.interface";

@singleton()
export class CustomerIdentityRepository implements ICustomerIdentityRepository{
    constructor(private readonly connection: ConnectionMysql) {
    }

    async create(req: ICustomerIdentity): Promise<number>{
        const conn = await this.connection.getConnection();
        try{
            const [result]: any = await conn.execute(`
                INSERT INTO customer_identity (customer_id,
                                               type_document_id,
                                               id_number,
                                               is_primary)
                VALUES (?, ?, ?, ?);`,
                [
                    req.customerId,
                    req.typeDocumentId,
                    req.idNumber,
                    req.isPrimary
                ]);
            return result.insertId;
        }catch (e) {
            console.error('Error en create:', e);
            throw e;
        }
    }
}