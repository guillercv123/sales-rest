import {singleton} from "tsyringe";
import {IUserRepository} from "./interfaces/user-repository.interface";
import {ConnectionMysql} from "../db/mysql";
import {User} from "../types/user.interface";
import {RowDataPacket} from "mysql2";
import {IButton, IMenu, IPermissionUser} from "../types/permission-user.interface";

type MenuRow = RowDataPacket & {
    menu_id: number;
    menu_key: string;
    menu_name: string | null;
    menu_parent_id: number | null;
};

type ButtonRow = RowDataPacket & {
    button_id: number;
    button_key: string;
    button_name: string | null;
    view_id: number | null;
    view_key: string | null;
    view_name: string | null;
    menu_id: number | null;
    menu_key: string | null;
    menu_name: string | null;
};

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
    async getUserByName(name: string) {
        const conn = await this.connection.getConnection();
        const [rows] = await conn.execute(
            'SELECT * FROM user WHERE name = ?',
            [name]
        );
        return rows as User[];
    }

    async getPermissionUser(userId: number): Promise<IPermissionUser> {
        const conn = await this.connection.getConnection();
        try {
            // @ts-ignore
            const [rows] = await conn.query<RowDataPacket[][]>(
                'CALL sales_bd.sp_acl_menus_y_botones(?);',
                [userId]
            );

            const resultSets = (rows as unknown as any[]).filter(Array.isArray) as any[][];
            const menusRS   = (resultSets[0] ?? []) as MenuRow[];
            const buttonsRS = (resultSets[1] ?? []) as ButtonRow[];

            const menu: IMenu[] = menusRS.map(r => ({
                menuId: r.menu_id,
                menuKey: r.menu_key,
                menuName: r.menu_name,
                menuParentId: r.menu_parent_id,
            }));

            const button: IButton[] = buttonsRS.map(r => ({
                buttonId: r.button_id,
                buttonKey: r.button_key,
                buttonName: r.button_name,
                viewId: r.view_id,
                viewKey: r.view_key,
                viewName: r.view_name,
                menuId: r.menu_id,
                menuKey: r.menu_key,
                menuName: r.menu_name,
            }));

            return { menu, button };
        } finally {

        }
    }
}