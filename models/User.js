const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'bloguser',
    password: 'recipe123',
    database: 'recipe_blog'
});

const User = {};

User.create = async function(email, password) {
    const [rows] = await pool.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
    return rows.insertId;
};

User.findByEmail = async function(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

module.exports = User;