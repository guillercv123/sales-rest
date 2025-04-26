import mysql from 'mysql2/promise';

export class ConnectionMysql {
    getConnection(){
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'sales_bd',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
}