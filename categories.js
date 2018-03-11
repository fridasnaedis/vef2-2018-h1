
const express = require('express');
const router = express.Router();
const categoriesData = require('./categoriesData';)


// Skilar síðu af flokkum
async function getCategories(req, res) {
    const categories = getAllCategories();
    return categories;
}

// Býr til nýjan flokk og skilar
function postCategories(req, res) {
    const category = PostACategory();
    return categories;
}

/* todo útfæra api */
router.get('/categories', getCategories);
router.post('/categories', postCategories)

module.exports = router;