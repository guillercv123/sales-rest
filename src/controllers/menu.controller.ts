import {autoInjectable} from "tsyringe";
import {MESSAGES} from "../constants/message";
import {MenuService} from "../services/menu.service";

@autoInjectable()
export class MenuController{
    constructor(private readonly service:MenuService ) {
    }
    async createMenu(req:any, res:any) {
        const request = req.body;
        try {
            const resources = await this.service.create(request);
            res.status(201).json({ message: MESSAGES.RESOURCE.RESOURCE_REGISTERED_SUCCESS, resources});
        } catch (err:any) {
            res.status(500).json({ error: err.message });
        }
    }
}