const express = require('express');
const userData = require('./userData');


const router = express.Router();

// Skilar síðu af notendum (ekkert lykilorð)
async function getUsers(req, res) {
    const users = getAllUsers();
    return users;
}

// Skilar stökum notendum ef til (ekkert lykilorð)
async function getUsersById(req, res) {
    const { id } = req.params;
    const user = getOneUser(id); 
    return user; 
}

// Skilar síðu af bókum sem uppfylla leitarskilyrði, sjá að neðan
async function getReadBooksByUsersId(req, res) {
    const { id } = req.params;
    const readBooks = getReadBooks(id); 
    return readBooks; 
}

/* todo útfæra api */
router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.get('/users/:id/read', getReadBooksByUsersId);

module.exports = router;