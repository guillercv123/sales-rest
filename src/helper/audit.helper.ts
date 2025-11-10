export class AuditHelper {
    /**
     * Calcula las diferencias entre el objeto anterior y el nuevo
     */
    static calculateDiff(oldData: any, newData: any): any {
        const diff: any = {
            before: {},
            after: {}
        };

        // Encontrar cambios
        for (const key in newData) {
            if (newData[key] !== oldData[key]) {
                diff.before[key] = oldData[key];
                diff.after[key] = newData[key];
            }
        }

        // Si no hay cambios, retornar null
        return Object.keys(diff.before).length > 0 ? diff : null;
    }

    /**
     * Sanitiza datos sensibles antes de guardarlos en el log
     */
    static sanitizeData(data: any, sensitiveFields: string[] = ['password', 'token', 'secret']): any {
        const sanitized = {...data};

        sensitiveFields.forEach(field => {
            if (sanitized[field]) {
                sanitized[field] = '***HIDDEN***';
            }
        });

        return sanitized;
    }
}