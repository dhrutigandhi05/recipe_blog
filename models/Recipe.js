const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'bloguser',
    password: 'recipe123',
    database: 'recipe_blog'
});

const Recipe = {};

Recipe.create = async function(title, ingredients, steps) {
    const[rows] = await pool.execute('INSERT INTO recipes (title, ingredients, steps) VALUES (?, ?, ?)', [title, ingredients, steps]);
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

module.exports = Recipe;