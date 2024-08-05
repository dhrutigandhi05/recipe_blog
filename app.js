const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');
const ini = require('ini');
const fs = require('fs');

const app = express();

// Read the config.ini file
const configFilePath = './config.ini';
const configContent = fs.readFileSync(configFilePath, 'utf-8');

// Parse the INI file content
const config = ini.parse(configContent);

// Database session store configuration
const sessionStore = new MySQLStore({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// session
app.use(session({
  key: config.session.key,
  secret: config.session.secret,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {secure: false}
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/recipes', recipeRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});