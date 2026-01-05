import {IMenuCreateRequest} from "../../types/menu-create-request.interface";
import {IResource} from "../../types/resource.interface";

export interface IMenuRepository {
    create(req:IMenuCreateRequest): Promise<IResource[]>;
}