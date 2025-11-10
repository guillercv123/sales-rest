export interface IAuditLog {
    audit_id: number;
    entity: string;
    entity_id: number | null;
    action: 'INSERT' | 'UPDATE' | 'DELETE';
    changed_at: Date;
    changed_by: string | null;
    diff: any | null;
}

export interface IAuditLogCreate {
    entity: string;
    entity_id: number | null;
    action: 'INSERT' | 'UPDATE' | 'DELETE';
    changed_by: string | null;
    diff?: any;
}

export interface IAuditLogQuery {
    entity?: string;
    entity_id?: number;
    action?: 'INSERT' | 'UPDATE' | 'DELETE';
    changed_by?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
}