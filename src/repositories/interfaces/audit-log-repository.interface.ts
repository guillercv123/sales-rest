import {IAuditLog, IAuditLogCreate, IAuditLogQuery} from "../../dto/audit-log.dto";
import {IPaginatedResponse} from "../../dto/pagination.dto";
import {PoolConnection} from "mysql2/promise";

export interface IAuditLogRepository {
    create(data: IAuditLogCreate): Promise<number>;
    createWithConnection(conn: PoolConnection, data: IAuditLogCreate): Promise<number>;
    findAll(query: IAuditLogQuery): Promise<IPaginatedResponse<IAuditLog>>;
}