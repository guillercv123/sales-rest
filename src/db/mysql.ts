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
    getConnectionPool(){
        return mysql.createPool({
            socketPath: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock',
            user: 'root',
            password: '',
            database: 'sales_bd',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    }

}