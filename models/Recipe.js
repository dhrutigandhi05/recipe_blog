const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'bloguser',
    password: 'recipe123',
    database: 'recipe_blog'
});

const Recipe = {};

Recipe.create = async function(title, ingredients, steps, userId) {
    const[rows] = await pool.execute('INSERT INTO recipes (title, ingredients, steps, user_id) VALUES (?, ?, ?, ?)', [title, ingredients, steps, userId]);
    return rows.insertId;
};

Recipe.search = async function(text) {
    const[rows] = await pool.execute('SELECT * FROM recipes WHERE title LIKE ?', [`%${text}%`]);
    return rows;
};

Recipe.getAll = async function() {
    const [rows] = await pool.execute('SELECT * FROM recipes');
    return rows;
}

Recipe.getByUserId = async function(userId) {
    const [rows] = await pool.execute('SELECT * FROM recipes WHERE user_id = ?', [userId]);
    return rows;
}


Recipe.delete = async function(id) {
    await pool.execute('DELETE FROM recipes WHERE id = ?', [id]);
};


module.exports = Recipe;