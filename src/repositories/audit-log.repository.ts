import {singleton} from "tsyringe";
import {IAuditLogRepository} from "./implements/audit-log-repository.interface";
import {ConnectionMysql} from "../db/mysql";
import {IAuditLog, IAuditLogCreate, IAuditLogQuery} from "../dto/audit-log.dto";
import {PoolConnection, ResultSetHeader, RowDataPacket} from "mysql2/promise";
import {MySQLErrorParser} from "../utils/mysql-error.parser";
import {IPaginatedResponse} from "../dto/pagination.dto";
import {PaginationHelper} from "../utils/pagination.helper";

@singleton()
export class AuditLogRepository implements IAuditLogRepository {
    constructor(private readonly connection: ConnectionMysql) {}

    async create(data: IAuditLogCreate): Promise<number> {
        const conn = await this.connection.getConnection();
        try {
            return await this.createWithConnection(conn, data);
        } catch (error) {
            throw MySQLErrorParser.parse(error);
        } finally {
            conn.release();
        }
    }

    async createWithConnection(conn: PoolConnection, data: IAuditLogCreate): Promise<number> {
        try {
            const diffJson = data.diff ? JSON.stringify(data.diff) : null;

            const [result] = await conn.execute<ResultSetHeader>(
                `INSERT INTO audit_log (entity, entity_id, action, changed_by, diff)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    data.entity,
                    data.entity_id ?? null,
                    data.action,
                    data.changed_by ?? null,
                    diffJson
                ]
            );

            return result.insertId;
        } catch (error) {
            throw MySQLErrorParser.parse(error);
        }
    }

    async findAll(query: IAuditLogQuery): Promise<IPaginatedResponse<IAuditLog>> {
        const conn = await this.connection.getConnection();

        try {
            const {page, limit, offset} = PaginationHelper.validateAndNormalize(query);

            const conditions: string[] = [];
            const params: any[] = [];

            if (query.entity) {
                conditions.push('entity = ?');
                params.push(query.entity);
            }

            if (query.entity_id) {
                conditions.push('entity_id = ?');
                params.push(query.entity_id);
            }

            if (query.action) {
                conditions.push('action = ?');
                params.push(query.action);
            }

            if (query.changed_by) {
                conditions.push('changed_by = ?');
                params.push(query.changed_by);
            }

            if (query.startDate) {
                conditions.push('changed_at >= ?');
                params.push(query.startDate);
            }

            if (query.endDate) {
                conditions.push('changed_at <= ?');
                params.push(query.endDate);
            }

            const whereClause = conditions.length > 0
                ? `WHERE ${conditions.join(' AND ')}`
                : '';

            // Count query
            const countQuery = `
                SELECT COUNT(*) as total
                FROM audit_log
                ${whereClause}
            `;

            const [countResult] = await conn.query<RowDataPacket[]>(countQuery, params);
            const totalItems = countResult[0].total;

            // Data query
            const dataQuery = `
                SELECT 
                    audit_id,
                    entity,
                    entity_id,
                    action,
                    changed_at,
                    changed_by,
                    diff
                FROM audit_log
                ${whereClause}
                ORDER BY changed_at DESC
                LIMIT ? OFFSET ?
            `;

            const [rows] = await conn.query<RowDataPacket[]>(
                dataQuery,
                [...params, limit, offset]
            );

            const logs: IAuditLog[] = rows.map(row => ({
                audit_id: row.audit_id,
                entity: row.entity,
                entity_id: row.entity_id,
                action: row.action,
                changed_at: row.changed_at,
                changed_by: row.changed_by,
                diff: row.diff ? JSON.parse(row.diff) : null
            }));

            const meta = PaginationHelper.createMeta(page, limit, totalItems);

            return {
                success: true,
                data: logs,
                meta
            };

        } catch (error) {
            throw MySQLErrorParser.parse(error);
        } finally {
            conn.release();
        }
    }
}