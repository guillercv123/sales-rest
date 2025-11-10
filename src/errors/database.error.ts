export enum DatabaseErrorCode {
    DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
    FOREIGN_KEY_VIOLATION = 'FOREIGN_KEY_VIOLATION',
    CONNECTION_ERROR = 'CONNECTION_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class DatabaseError extends Error {
    constructor(
        public code: DatabaseErrorCode,
        public message: string,
        public field?: string,
        public value?: string
    ) {
        super(message);
        this.name = 'DatabaseError';
    }
}

export class DuplicateEntryError extends DatabaseError {
    constructor(field: string, value: string) {
        super(
            DatabaseErrorCode.DUPLICATE_ENTRY,
            `El ${field} '${value}' ya está registrado en el sistema`,
            field,
            value
        );
        this.name = 'DuplicateEntryError';
    }
}