// src/errors/sunat.error.ts

export class SunatError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly statusCode: number = 500
    ) {
        super(message);
        this.name = 'SunatError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends SunatError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR', 400);
        this.name = 'ValidationError';
    }
}

export class NetworkError extends SunatError {
    constructor(message: string) {
        super(message, 'NETWORK_ERROR', 503);
        this.name = 'NetworkError';
    }
}

export class NotFoundError extends SunatError {
    constructor(message: string) {
        super(message, 'NOT_FOUND', 404);
        this.name = 'NotFoundError';
    }
}

export class ScrapingError extends SunatError {
    constructor(message: string) {
        super(message, 'SCRAPING_ERROR', 500);
        this.name = 'ScrapingError';
    }
}