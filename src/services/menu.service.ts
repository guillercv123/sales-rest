import {inject, injectable} from "tsyringe";
import {IMenuService} from "./implements/menu-service.interface";
import {MenuRepository} from "../repositories/menu.repository";
import {IMenuCreateRequest} from "../types/menu-create-request.interface";

@injectable()
export class MenuService implements IMenuService{
    constructor(
        @inject(MenuRepository)
        private readonly repository:MenuRepository) {
    }

    async create(req: IMenuCreateRequest){
        return this.repository.create(req);
    }


}