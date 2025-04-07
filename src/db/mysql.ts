import mysql from 'mysql2/promise';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sales_bd',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default connection;