const express = require('express');
const router = express.Router();
const path = require('path');

// Serve HTML files
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/../views/index.html'));
});

router.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/../views/login.html'));
});

router.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/../views/register.html'));
});

router.get('/add_recipe.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/../views/add_recipe.html'));
});

module.exports = router;
