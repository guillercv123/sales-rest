import {IPaginatedResponse} from "../../dto/pagination.dto";
import {IAuditLog, IAuditLogCreate, IAuditLogQuery} from "../../dto/audit-log.dto";

export interface IAuthLogService{
    create(data: IAuditLogCreate):Promise<number>;
    findAll(query: IAuditLogQuery):Promise<IPaginatedResponse<IAuditLog>>;
}