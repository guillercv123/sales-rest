
import {ClientService} from "../services/client.service";
import {MESSAGES} from "../constants/message";
import {autoInjectable} from "tsyringe";
@autoInjectable()
export class ClientController {
    constructor(
        private readonly service: ClientService ) {
    }
    async findAll(req:any, res:any) {
        try {
           const clients = await this.service.findAll();
            res.status(200).json({resp: clients})
        }catch (err: any){
            res.status(500).json({ error: err.message });
        }
    }

    async create(req:any, res:any) {
        const  clientReq  = req.body;
        try {
            const client = await this.service.create(clientReq);
            res.status(201).json({ message: MESSAGES.CLIENT_REGISTERED_SUCCESS, resp: client});
        }catch (err: any){
            res.status(500).json({ error: err.message });
        }
    }
}