import connection from "../db/mysql";
import {singleton} from "tsyringe";
import { ITypeDocument } from "../types/typeDocument.interface";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import {ITypeDocumentRepository} from "./interfaces/type-document-repository.interface";

@singleton()
export class TypeDocumentRepository implements ITypeDocumentRepository{
    async findAll(): Promise<ITypeDocument[]> {
        const conn = await connection;
        const [rows] = await conn.query<RowDataPacket[]>(
            "SELECT * FROM type_document WHERE active = ?",
            [1]
        );
        return rows as ITypeDocument[];
    }

    async create(description: string): Promise<number> {
        const conn = await connection;
        const [result] = await conn.execute<ResultSetHeader>(
            "INSERT INTO type_document (description) VALUES (?)",
            [description]
        );
        return result.insertId;
    }

    async update(id: number, description: string): Promise<number> {
        const conn = await connection;
        const [result] = await conn.execute<ResultSetHeader>(
            "UPDATE type_document SET description = ? WHERE id = ?",
            [description, id]
        );
        return result.affectedRows;
    }

    async deactivate(id: number): Promise<number> {
        const conn = await connection;
        const [result] = await conn.execute<ResultSetHeader>(
            "UPDATE type_document SET active = ? WHERE id = ?",
            [0, id]
        );
        return result.affectedRows;
    }
}
