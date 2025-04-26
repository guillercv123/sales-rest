import connection from "../db/mysql";
import {ITypeDocument} from "../types/type-document.interface";
import {ResultSetHeader, RowDataPacket} from "mysql2";

export class TypeDocumentService  {
    async getAll(): Promise<ITypeDocument[]> {
            try {
                const conn = await connection;
                const [rows] = await conn.query<RowDataPacket[]>(
                    "SELECT * FROM type_document WHERE active = ?",
                    [1]
                );
                return rows as ITypeDocument[];
            } catch (err) {
                throw err;
            }
        }
    async create(description:string):Promise<number> {
            try {
                const conn = await connection;
                const [result] = await conn.execute<ResultSetHeader>(
                    "INSERT INTO type_document (description) VALUES (?)",
                    [description]
                );
                return result.insertId;
           } catch (err) {
                throw err;
            }
        }
    async update (id:number, description: string){
            try{
                const conn = await connection;
                const [result]:any = await conn.query<RowDataPacket[]>(
                    "UPDATE type_document SET description = ? WHERE id = ?",
                    [description, id]
                );
                return result.affectedRows;
            }catch (err) {
                throw err;
            }
    }
    async desactivate(id: number){
        try {
            const conn = await connection;
            const [result]:any = await conn.execute<ResultSetHeader>(
                "UPDATE type_document SET active = ? WHERE id = ?",
                [0, id]
            );
            return result.affectedRows;
        } catch (err) {
            throw err;
        }
    }
}