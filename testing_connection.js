const mysql = require('mysql2/promise');

async function testConnection() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'bloguser',
        password: 'recipe123',
        database: 'recipe_blog'
    });

    try {
        const connection = await pool.getConnection();
        console.log('Database connection successful');
        connection.release();
    } catch (err) {
        console.error('Database connection failed', err);
    }
}

testConnection();