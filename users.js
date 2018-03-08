const express = require('express');

const router = express.Router();

// Skilar síðu af notendum (ekkert lykilorð)
function getUsers(req, res) {
    // TODO
}

// Skilar stökum notendum ef til (ekkert lykilorð)
function getUsersById(req, res) {
    // TODO
}

// Skilar síðu af bókum sem uppfylla leitarskilyrði, sjá að neðan
function getReadBooksByUsersId(req, res) {
    // TODO
}

/* todo útfæra api */
router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.get('/users/:id/read', getReadBooksByUsersId);

module.exports = router;