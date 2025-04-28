import {singleton} from "tsyringe";
import {IUserRepository} from "./interfaces/user-repository.interface";
import {ConnectionMysql} from "../db/mysql";
import {User} from "../types/user.interface";

@singleton()
export class UserRepository implements IUserRepository{
    constructor(private connection: ConnectionMysql) {
    }
    /**
     * Obtiene todos los usuarios.
     */
    async getAllUsers(){
        const conn = await this.connection.getConnection();
        const [rows] = await conn.execute('SELECT * FROM user');
        return rows as User[];
    }
    /**
     * Crea un usuario nuevo en el sistema
     * @param name
     * @param password
     * @param email
     */
    async create(name: string, password: string, email: string){
        const conn = await this.connection.getConnection();
        const [rows] = await conn.execute(
            'INSERT INTO user (name, password_user, email_user) VALUES (?, ?, ?);',
            [name, password, email]
        );
        return rows as User[];
    }
    /**
     * Actualiza la password si se olvido por el email
     * @param email
     * @param password
     */
    async updatePasswordUserByEmail(email: string, password: string){
        const conn = await this.connection.getConnection();
        const [rows] = await conn.execute(
            'UPDATE user SET password_user = ? WHERE email_user = ?;',
            [password, email]
        );
        return rows as User[];
    }
    /**
     *  Obtiene el usuario por el email.
     * @param email
     */
    async getUserByEmail(email: string){
        const conn = await this.connection.getConnection();
        const [rows] = await conn.execute(
            'SELECT * FROM user WHERE email_user = ?',
            [email]
        );
        return rows as User[];
    }
    /**
     * Obtiene el usuario por nombre
     * @param name
     */
    async getUserByName(name: string){
        const conn = await this.connection.getConnection();
        const [rows] = await conn.execute(
            'SELECT * FROM user WHERE name = ?',
            [name]
        );
        return rows as User[];
    }
}