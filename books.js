//TODO setja inn rétt imports
const express = require('express');
const router = express.Router();

const xss = require('xss');

// Skilar síðu af bókum
function getBooks(req, res) {
  // TODO
}

// býr til nýja bók ef hún er gild og skilar
function postBooks(req, res) {
  // TODO
}

// skilar síðu af bókum sem uppfylla leitarskilyrði, sjá að neðan
function searchBooks(req, res) {
  // TODO
}

// skilar stakri bók
function getBookById(req, res) {
  // TODO
}

// Uppfærir bók
function patchBookById(req, res) {
  // TODO
}

/* todo útfæra api */
router.get('/books', getBooks);
router.post('/books', postBooks);
router.get('/books?search=query', searchBooks);
router.get('/books/:id', getBookById);
router.patch('/books/:id', patchBookById);

module.exports = router;