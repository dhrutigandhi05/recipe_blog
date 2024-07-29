const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// session
app.use(session({
  secret: 'a4r6w79827kg6qq7',
  resave: false,
  saveUninitialized: true,
  cookie: {secure:false}
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