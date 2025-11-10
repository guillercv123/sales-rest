import mysql from 'mysql2/promise';
import {singleton} from "tsyringe";
@singleton()
export class ConnectionMysql {
    private readonly pool: mysql.Pool;

    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'sales_bd',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    async getConnection(): Promise<mysql.PoolConnection> {
        return await this.pool.getConnection();
    }

    getPool(): mysql.Pool {
        return this.pool;
    }

    async closePool(): Promise<void> {
        await this.pool.end();
    }
}