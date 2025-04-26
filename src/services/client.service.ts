import 'reflect-metadata';
import {IClientReq} from "../types/client.interface";
import {plainToInstance} from "class-transformer";
import {ClientResp} from "../dto/client.resp";
import {IClientService} from "./interfaces/client-service.interface";
import {inject, injectable} from "tsyringe";
import {ClientRepository} from "../repositories/client.repository";
@injectable()
export class ClientService implements IClientService{
    constructor(
        @inject(ClientRepository)
        private readonly repository: ClientRepository) {}

    async findAll(): Promise<ClientResp> {
        return plainToInstance(ClientResp, this.repository.findAll(), { excludeExtraneousValues: true });
    }
    async create(req: IClientReq) : Promise<ClientResp>{
        return plainToInstance(ClientResp, this.repository.create(req), { excludeExtraneousValues: true });
    }
}