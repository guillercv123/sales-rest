import {DuplicateEntryError, DatabaseError, DatabaseErrorCode} from '../errors/database.error';

interface MySQLError extends Error {
    code?: string;
    errno?: number;
    sqlMessage?: string;
}

export class MySQLErrorParser {
    static parse(error: unknown): DatabaseError {
        if (error instanceof DatabaseError) {
            return error;
        }

        const mysqlError = error as MySQLError;

        // Error de entrada duplicada
        if (mysqlError.code === 'ER_DUP_ENTRY') {
            return this.parseDuplicateEntry(mysqlError);
        }

        // Error de llave foránea
        if (mysqlError.code === 'ER_NO_REFERENCED_ROW_2' ||
            mysqlError.code === 'ER_ROW_IS_REFERENCED_2') {
            return new DatabaseError(
                DatabaseErrorCode.FOREIGN_KEY_VIOLATION,
                'Violación de integridad referencial'
            );
        }

        // Error de conexión
        if (mysqlError.code === 'ECONNREFUSED' ||
            mysqlError.code === 'PROTOCOL_CONNECTION_LOST') {
            return new DatabaseError(
                DatabaseErrorCode.CONNECTION_ERROR,
                'Error de conexión con la base de datos'
            );
        }

        // Error desconocido
        return new DatabaseError(
            DatabaseErrorCode.UNKNOWN_ERROR,
            'Ha ocurrido un error inesperado',
            undefined,
            mysqlError.message
        );
    }

    private static parseDuplicateEntry(error: MySQLError): DuplicateEntryError {
        const message = error.sqlMessage || error.message || '';

        const entryMatch = message.match(/Duplicate entry '([^']+)'/);
        const keyMatch = message.match(/for key '([^']+)'/);

        const value = entryMatch ? entryMatch[1] : 'valor';
        const key = keyMatch ? keyMatch[1] : 'campo';

        const fieldNames: Record<string, string> = {
            'uq_identity': 'documento de identidad',
            'uq_email': 'correo electrónico',
            'uq_phone': 'número de teléfono',
            'PRIMARY': 'identificador'
        };

        const friendlyField = fieldNames[key] || key;

        return new DuplicateEntryError(friendlyField, value);
    }
}