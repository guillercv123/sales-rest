import {singleton} from "tsyringe";
import {ConnectionMysql} from "../db/mysql"
import {IGeneroRepository} from "./interfaces/genero-repository.interface";
import {IGenero} from "../types/genero.interface";
import { ResultSetHeader, RowDataPacket } from "mysql2";
@singleton()
export class GeneroRepository implements IGeneroRepository{
    constructor(private readonly connection: ConnectionMysql) {
    }
    /**
     * Obtiene todos los generos activos
     */
    async fillAll(): Promise<IGenero[]> {
        const conn = await this.connection.getConnection();
        const [result] = await conn.query<RowDataPacket[]>(`
            SELECT * FROM genero WHERE active = ?`
              , [1]);
        return result as IGenero[];
    }
    /**
     * crea un genero
     * @param description
     */
    async create(description:string): Promise<number> {
        const conn = await this.connection.getConnection();
        const [result]:any = conn.execute<ResultSetHeader>(
            `INSERT INTO genero (description) VALUES (?)`, [description]);
        return result.lastInsertId;
    }
    /**
     * Actualiza un genero
     * @param id
     * @param description
     */
    async update(id: number, description: string) {
        const conn = await this.connection.getConnection();
        const [result]:any = conn.execute<ResultSetHeader>(
            `UPDATE genero SET descripcion = ? WHERE id = ? `, [description,id]);
        return result.affectedRows;
    }
    /**
     * Desactiva un genero con eliminacion logica
     * @param id
     */
    async desactive(id:number) {
        const conn = await this.connection.getConnection();
        const [result]:any = conn.execute<ResultSetHeader>(
            `UPDATE genero SET active = 0 WHERE id = ? `, [id]);
        return result.affectedRows;
    }
}