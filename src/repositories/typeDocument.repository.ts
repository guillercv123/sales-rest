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
    async create(description: string): Promise<number> {
        const conn = await this.connection.getConnection();
        const [result] = await conn.execute<ResultSetHeader>(
            "INSERT INTO type_document (description) VALUES (?)",
            [description]
        );
        return result.insertId;
    }
    /**
     * Actualiza un tipo de documento existente.
     */
    async update(id: number, description: string): Promise<number> {
        const conn = await this.connection.getConnection();
        const [result] = await conn.execute<ResultSetHeader>(
            "UPDATE type_document SET description = ? WHERE id = ?",
            [description, id]
        );
        return result.affectedRows;
    }
    /**
     * Desactiva un tipo de documento.
     */
    async deactivate(id: number): Promise<number> {
        const conn = await this.connection.getConnection();
        const [result] = await conn.execute<ResultSetHeader>(
            "UPDATE type_document SET active = ? WHERE id = ?",
            [0, id]
        );
        return result.affectedRows;
    }
}
