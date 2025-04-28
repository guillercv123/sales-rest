import {ConnectionMysql} from "../db/mysql";
import {singleton} from "tsyringe";
import { ITypeDocument } from "../types/typeDocument.interface";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import {ITypeDocumentRepository} from "./interfaces/type-document-repository.interface";

@singleton()
export class TypeDocumentRepository implements ITypeDocumentRepository{
    constructor(private readonly connection: ConnectionMysql) {
    }
    /**
     * Obtiene todos los documentos de tipo.
     */
    async findAll(): Promise<ITypeDocument[]> {
        const conn = await this.connection.getConnection();
        const [rows] =await conn.query<RowDataPacket[]>(
            "SELECT * FROM type_document WHERE active = ?",
            [1]);
        return rows as ITypeDocument[];
    }
    /**
     * Crea un nuevo tipo de documento.
     */
    async create(description: string,createUser: string): Promise<ITypeDocument> {
        const conn = await this.connection.getConnection();
        const [result]: any = await conn.execute(
            "INSERT INTO type_document (description,create_date,create_user) VALUES (?,?,?)",
            [description,new Date(), createUser]
        );
        const insertedId = result.insertId;
        const [rows]: any = await conn.execute(
            `SELECT t.id,t.description,t.create_date,t.create_user FROM type_document t WHERE t.id = ?`,
            [insertedId]
        );
        return rows as ITypeDocument;
    }
    /**
     * Actualiza un tipo de documento existente.
     */
    async update(id: number, description: string,updateUser: string): Promise<ITypeDocument> {
        const conn = await this.connection.getConnection();

        await conn.execute<ResultSetHeader>(
            `UPDATE type_document SET description = ?, update_user = ?, update_date = ? WHERE id = ?;`,
            [description, updateUser, new Date(), id]
        );

        const [rows] = await conn.query<RowDataPacket[]>(
            `SELECT id, description, update_user, update_date FROM type_document WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            throw new Error(`Género con id ${id} no encontrado`);
        }

        return rows[0] as ITypeDocument;
    }
    /**
     * Desactiva un tipo de documento.
     */
    async deactivate(id: number, deleteUser: string): Promise<number> {
        const conn = await this.connection.getConnection();
        const [result]:any = await conn.execute(
            "UPDATE type_document SET active = 0 , delete_user= ?, delete_date = ?  WHERE id = ? ",
            [deleteUser, new Date(), id]
        );
        return result.affectedRows;
    }
}
