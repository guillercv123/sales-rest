import {inject, injectable} from "tsyringe";
import {AuditLogRepository} from "../repositories/audit-log.repository";
import {IPaginatedResponse} from "../dto/pagination.dto";
import {IAuditLog, IAuditLogCreate, IAuditLogQuery} from "../dto/audit-log.dto";
import {IAuthLogService} from "./interfaces/audit-log-service.interface";

@injectable()
export class AuditLogService implements IAuthLogService{
    constructor(
        @inject(AuditLogRepository)
        private readonly authLogRepository: AuditLogRepository) {
    }

    async create(data: IAuditLogCreate):Promise<number>{
        return this.authLogRepository.create(data);
    }

    async findAll(query: IAuditLogQuery):Promise<IPaginatedResponse<IAuditLog>>{
        return this.authLogRepository.findAll(query)
    }
}