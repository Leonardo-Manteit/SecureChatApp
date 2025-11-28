// authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const router = express.Router();
const saltRounds = 10;

const jwtSecret = process.env.JWT_SECRET || 'cakepudding'; // environment variable for the JWT secret

// signup Route
router.post('/SCA/signUp', async (req, res, next) => {
    const { username, password } = req.body;
    console.log('attempting sign up')
    try {
        // hash the password
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        // create user
        const user = await User.createUser(username, hash);

        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        next(error);
    }
});

// login Route
router.post('/SCA/login', async (req, res, next) => {
    console.log('attempting login')
    try {
        const { username, password } = req.body;

        let user = await User.findByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'Incorrect email or password' });
        }

        const match = await bcrypt.compare(password, user.password_digest);
        if (!match) {
            return res.status(400).json({ message: 'Incorrect email or password' });
        }

        // generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username
            },
            jwtSecret,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        next(error);
    }
});


module.exports = router;
