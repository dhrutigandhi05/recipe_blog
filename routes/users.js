const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const bcrypt = require('bcryptjs');
const is_authenticated = require('../middleware/is_authenticated');

// registering
router.post('/register', async(req, res) => {
    const{email, password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 8);
        const userId = await User.create(email, hashedPassword);
        res.status(201).json({message: 'Successfully registered', userId});
    } catch(err) {
        console.error(err)
        res.status(500).json({message: "Failed to register"});
    }
});

// logging in
router.post('/login', async(req, res) => {
    const{email, password} = req.body;
    try{
        const user = await User.findByEmail(email);
        if (user){
            const matchPasswords = await bcrypt.compare(password, user.password);
            if (matchPasswords){
                req.session.userId = user.id;
                req.session.email = user.email;
                res.status(200).json({message: 'Successful Login', email: user.email});
            } else {
                res.status(401).json({error:'Invalid password'});
            }
        } else {
            res.status(401).json({error:'User not found'});
        }
    } catch(err) {
        console.error(err)
        res.status(401).json({error:'Could not login'});
    }
});

router.get('/me', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({ email: req.session.email });
    } else {
        res.status(401).json({message: 'Not logged in' });
    }
});

// logging out
router.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({message: 'Could not sign out'});
            } else {
                res.clearCookie('connect.sid', {path: '/'});
                return res.status(200).json({message: 'Successfully signed out'});
            }
        });
    } else {
        return res.status(200).json({messaqge: 'no active session'});
    }
});
  
// my recipes
router.get('/my-recipes', is_authenticated, async (req, res) => {
    try {
        const recipes = await Recipe.getByUserId(req.session.userId);
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error getting user recipes:', error);
        res.status(500).json({message: 'Could not get your recipes'});
    }
});

module.exports = router;