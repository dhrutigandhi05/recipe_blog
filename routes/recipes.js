const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const is_authenticated = require('../middleware/is_authenticated');

// add recipe
router.post('/add', is_authenticated, async(req, res) => {
    const{title, ingredients, steps} = req.body;
    try{
        const recipeId = await Recipe.create(title, ingredients, steps);
        res.status(201).json({message:'Recipe added', recipeId});
    } catch(err) {
        console.error('Unable to add recipe:', error);
        res.status(500).json({message:'Unable to add recipe'});
    }
});

// fetch recipes
router.get('/', async(req, res) => {
    try{
        const recipes = await Recipe.getAll();
        res.json(recipes);
    } catch(err) {
        res.status(500).json({message:'Unable to fetch recipes'});
    }
});

// search for recipe
router.get('/search', async(req, res) => {
    const{text} = req.query;
    try{
        const recipes = await Recipe.search(text);
        res.json(recipes);
    } catch(err) {
        console.error('Error searching recipes:', error);
        res.status(500).json({message: 'Could not search recipe'});
    }
});

module.exports = router;