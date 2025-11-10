import {Request, Response, NextFunction} from 'express';
import {DatabaseError, DatabaseErrorCode} from '../errors/database.error';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof DatabaseError) {
        const statusCode = getStatusCode(error.code);

        return res.status(statusCode).json({
            success: false,
            error: {
                code: error.code,
                message: error.message,
                field: error.field,
                value: error.value
            }
        });
    }

    // Error genérico
    console.error('Unhandled error:', error);
    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Ha ocurrido un error interno en el servidor'
        }
    });
};

function getStatusCode(code: DatabaseErrorCode): number {
    switch (code) {
        case DatabaseErrorCode.DUPLICATE_ENTRY:
            return 409; // Conflict
        case DatabaseErrorCode.FOREIGN_KEY_VIOLATION:
            return 400; // Bad Request
        case DatabaseErrorCode.CONNECTION_ERROR:
            return 503; // Service Unavailable
        default:
            return 500; // Internal Server Error
    }
}