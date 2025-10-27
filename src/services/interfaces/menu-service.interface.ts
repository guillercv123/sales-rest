import {IMenuCreateRequest} from "../../types/menu-create-request.interface";
import {IResource} from "../../types/resource.interface";

export interface IMenuService{
    create(req: IMenuCreateRequest) :Promise<IResource[]>;
}
