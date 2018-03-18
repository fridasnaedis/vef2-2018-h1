//TODO setja inn rétt imports
const express = require('express');
const router = express.Router();

// Býr til notanda og skilar án lykilorðs hash
function postRegister(req, res) {
    // TODO
}

// Post með notendanafni og lykilorði, skilar token
function postLogin(req, res) {
    // TODO
}

/* todo útfæra api */
router.post('/register', postRegister);
router.post('/login', postRegister);

module.exports = router;