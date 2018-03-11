const express = require('express');
const { 
    getAllUsers,
    getOneUser,
    getReadBooks,
    } =  require('./userData');


const router = express.Router();

// Skilar síðu af notendum (ekkert lykilorð)
async function getUsers(req, res) {
    const users = await getAllUsers();
    console.log(users);
    // return users;
    res.status(200).json(users);
}

// Skilar stökum notendum ef til (ekkert lykilorð)
async function getUsersById(req, res) {
    const { id } = req.params;
    const user = await getOneUser(id); 
    // return user; 
    res.status(200).json(user);
}

// Skilar síðu af bókum sem uppfylla leitarskilyrði, sjá að neðan
async function getReadBooksByUsersId(req, res) {
    const { id } = req.params;
    const readBooks = await getReadBooks(id); 
    // return readBooks; 
    res.status(200).json(readBooks);
}

/* todo útfæra api */
router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.get('/users/:id/read', getReadBooksByUsersId);

module.exports = router;