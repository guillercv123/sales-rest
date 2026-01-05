import {IMenuRepository} from "./implements/menu-repository.interface";
import {singleton} from "tsyringe";
import {ConnectionMysql} from "../db/mysql";
import {IMenuCreateRequest} from "../types/menu-create-request.interface";
import {IResource} from "../types/resource.interface";
@singleton()
export class MenuRepository implements IMenuRepository{
    constructor(private connection: ConnectionMysql) {
    }
    async create(req:IMenuCreateRequest){
        const conn = await this.connection.getConnection();
        const [rows] = await conn.execute(
            'INSERT INTO resources (type, key_name, display_name,route,parent_id, icon) VALUES (?, ?, ?, ?, ?,?);',
            [req.type, req.keyName, req.displayName, req.route, req.parentId, req.icon]
        );
        return rows as IResource[];
    }
}