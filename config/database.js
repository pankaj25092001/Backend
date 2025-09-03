import { createPool } from 'mysql2/promise';
 
 
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'my-secret-pw',
  database: process.env.DB_NAME || 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
 
 
const pool = createPool(dbConfig);
 
async function testConnection(){
    try{
        const connection = await pool.getConnection();
        console.log("✅ Database connection successful!");
        connection.release();
    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }
}

export default { pool, testConnection };