const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de conexiones para MariaDB 11.8 / MySQL (Alwaysdata o Local)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dsw',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

// Función para probar la conexión
async function testConnection() {
  const connection = await pool.getConnection();
  console.log(`[DB] Conectado exitosamente a MariaDB/MySQL en ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306} (${process.env.DB_NAME || 'dsw'})`);
  connection.release();
  return true;
}

module.exports = {
  pool,
  testConnection,
};
