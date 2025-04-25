import 'reflect-metadata';
import {IClientReq} from "../types/client.interface";
import {toMySQLDateTime} from "../utils/date.util";
import connection from "../db/mysql";
import {plainToInstance} from "class-transformer";
import {ClientResp} from "../dto/client.resp";

export const createClient = async (req: IClientReq): Promise<ClientResp[]> => {
    const conn = await connection;

    const [result]: any = await conn.execute(
        'INSERT INTO client (full_name, surname, email, phone, id_type_document, create_user,create_date,id_genero) VALUES (?,?,?,?,?,?,?,?);',
        [req.fullName, req.surname, req.email, req.phone, req.idTypeDocument, req.createUser, toMySQLDateTime(req.createDate), req.idGenero]
    );
    const insertedId = result.insertId;

    const [rows]: any = await conn.execute(
        `SELECT 
            c.id,
            c.full_name,
            c.surname,
            c.email,
            c.phone,
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

    // @ts-ignore
    return plainToInstance(ClientResp, rows[0], { excludeExtraneousValues: true });
}