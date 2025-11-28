const express = require('express')
const router = express.Router()
const User = require('../models/Users')

// frontend wants to get a user by their username
router.get('/SCA/user/:username', (req, res) => {
    return User.findByUsername(req.params.username)
        .then(user => res.json(user))
        .catch(err => res.status(500).json({ message: `User not found ${req.params.username}) `, error: err }));
});

// frontend wants to get all users
router.get('/SCA/get_users', (req, res) => {
    return User.getAllUsers()
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ message: 'No users found', error: err }));
});

// frontend wants to delete a user
router.delete('/SCA/user/delete/:user_id', (req, res) => {
    const {user_id} = req.params
    return User.deleteUser(user_id)
        .then(user => res.json(user))
        .catch(err => res.status(500).json({ message: 'User could not be deleted', error: err }));
});

module.exports = router;
