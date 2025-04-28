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
     * @param createUser
     */
    async create(description:string, createUser: string): Promise<IGenero> {
        const conn = await this.connection.getConnection();
        const [result]: any = await conn.execute(
            `INSERT INTO genero (description, create_date,create_user) VALUES (?,?,?);`,
            [description,new Date(),createUser]
        );
        const insertedId = result.insertId;
        const [rows]: any = await conn.execute(
            `SELECT g.id,g.description,g.create_date,g.create_user FROM genero g WHERE g.id = ?`,
            [insertedId]
        );
        return rows as IGenero;
    }
    /**
     * Actualiza un genero
     * @param id
     * @param description
     * @param updateUser
     */
    async update(id: number, description: string, updateUser: string):Promise<IGenero> {
        const conn = await this.connection.getConnection();

        await conn.execute<ResultSetHeader>(
            `UPDATE genero SET description = ?, update_user = ?, update_date = ? WHERE id = ?;`,
            [description, updateUser, new Date(), id]
        );

        const [rows] = await conn.query<RowDataPacket[]>(
            `SELECT id, description, update_user, update_date FROM genero WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            throw new Error(`Género con id ${id} no encontrado`);
        }

        return rows[0] as IGenero;
    }
    /**
     * Desactiva un genero con eliminacion logica
     * @param id
     * @param userDelete
     */
    async desactive(id:number,userDelete:string) {
        const conn = await this.connection.getConnection();
        const [result]:any = await conn.execute(
            `UPDATE genero SET active = 0 , delete_user= ?, delete_date = ?  WHERE id = ? `, [userDelete,new Date(),id]);
        return result.affectedRows;
    }
}