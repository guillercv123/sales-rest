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
    icon: string | null;
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
    async getUserByName(name: string):Promise<any> {
        const conn = await this.connection.getConnection();
        // @ts-ignore
        const [rows] = await conn.execute<Row[]>(`
                  SELECT 
                    u.id, u.name, u.email_user, u.password_user,
                    GROUP_CONCAT(DISTINCT r.id ORDER BY r.id SEPARATOR ',')   AS role_ids_csv,
                    GROUP_CONCAT(DISTINCT r.name ORDER BY r.name SEPARATOR ',') AS role_names_csv
                  FROM \`user\` u
                  LEFT JOIN user_roles ur ON ur.user_id = u.id
                  LEFT JOIN roles r       ON r.id = ur.role_id
                  WHERE u.name = ?
                  GROUP BY u.id, u.name, u.email_user, u.password_user
                  LIMIT 1;
                `, [name]);

        if (!rows || rows.length === 0) return null;
        // @ts-ignore
        const r = rows[0] as Row;
        const ids   = (r.role_ids_csv   ? r.role_ids_csv.split(',').filter(Boolean).map(Number) : []);
        const names = (r.role_names_csv ? r.role_names_csv.split(',').filter(Boolean) : []);
        const roles = ids.map((id: any, i: string | number) => ({ id, name: names[i] ?? '' }));

        const { role_ids_csv, role_names_csv, ...userBase } = r;
        return { ...(userBase as User), roles };
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
                icon: r.icon
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