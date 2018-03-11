//TODO setja inn rétt imports
const express = require('express');
const router = express.Router();
const { Client } = require('pg');

cosnt xss = require('xss');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/h1';

async function query(q, values = []) {
    const client = new Client(connectionString);
    await client.connect();

    let result;
    try {
        result = await client.query(q, values);
    } catch (err) {
        console.error('err');
        throw err;
    } finally {
        await client.end();
    }
    return result;
}

// Skilar síðu af flokkum
async function getCategories(req, res) {
    const q = 'SELECT * FROM categories;';
    const result = await query(q);
}

// Býr til nýjan flokk og skilar
function postCategories(req, res) {
    // TODO
}

/* todo útfæra api */
router.get('/categories', getCategories);
router.post('/categories', postCategories)

module.exports = router;