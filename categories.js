//TODO setja inn rétt imports
const express = require('express');
const router = express.Router();

cosnt xss = require('xss');

// Skilar síðu af flokkum
function getCategories(req, res) {
    // TODO
}

// Býr til nýjan flokk og skilar
function postCategories(req, res) {
    // TODO
}

/* todo útfæra api */
router.get('/categories', getCategories);
router.post('/categories', postCategories)

module.exports = router;