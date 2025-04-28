import {IClientRepository} from "./interfaces/client-repository.interface";
import {ConnectionMysql} from "../db/mysql";
import {singleton} from "tsyringe";
import {IClientReq} from "../types/client.interface";
import {toMySQLDateTime} from "../utils/date.util";
import {ClientResp} from "../dto/client.resp";
@singleton()
export class ClientRepository implements IClientRepository{
    constructor(private readonly connection: ConnectionMysql) {
    }
   async findAll(): Promise<ClientResp[]> {
        const conn = await this.connection.getConnection();
           const [result]:any = await conn.execute(
               `SELECT      
                    c.id,
                    c.full_name,
                    c.surname,
                    c.email,
                    c.phone,
                    c.number_document,
                    td.description AS description_type_document,
                    g.description AS description_genero,
                    c.create_user,
                    c.create_date
                    FROM client c
                    JOIN type_document td ON td.id = c.id_type_document
                    JOIN genero g ON g.id = c.id_genero`);
           return result as ClientResp[];
    }

    async create(req: IClientReq): Promise<ClientResp>{
        const conn = await this.connection.getConnection();
        const [result]: any = await conn.execute(
        'INSERT INTO client (full_name, surname, email, phone, id_type_document,number_document, create_user,create_date,id_genero) VALUES (?,?,?,?,?,?,?,?,?);',
        [req.fullName, req.surname, req.email, req.phone, req.idTypeDocument,req.numberDocument, req.createUser, toMySQLDateTime(req.createDate), req.idGenero]
            );
        const insertedId = result.insertId;

        const [rows]: any = await conn.execute(
            `SELECT
                c.id,
                c.full_name,
                c.surname,
                c.email,
                c.phone,
                c.number_document,
                td.description AS description_type_document,
                g.description AS description_genero,
                c.create_user,
                c.create_date
            FROM client c
            JOIN type_document td ON td.id = c.id_type_document
            JOIN genero g ON g.id = c.id_genero
            WHERE c.id = ?`,
            [insertedId]
        );
        return rows as ClientResp;
    }

}