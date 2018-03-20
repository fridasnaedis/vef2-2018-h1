// TODO setja inn rétt imports
const express = require('express');

const router = express.Router();
const validator = require('validator');
const { requireAuthentication } = require('./authentication');
const xss = require('xss');
const {
  getAllBooks,
  postABook,
  searchAllBooks,
  getABookById,
  patchABookById,
} = require('./bookData');

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

function validateBook({ title, isbn13 }) {
  const errors = [];

  if (typeof title !== 'string' || !validator.isLength(title, { min: 1 })) {
    errors.push({
      field: 'title',
      message: 'Title must be a string of length 1',
    });
  }

  if (typeof isbn13 !== 'string' || !validator.isLength(isbn13, 13) || !validator.isNumeric(isbn13)) {
    errors.push({
      field: 'isbn13',
      message: 'ISBN13 must be a string of numbers of length 13',
    });
  }
  // Þarf fleiri?
  return errors;
}
// Skilar síðu af bókum
async function getBooks(req, res) {
  const response = await getAllBooks();
  if (response.length > 0) {
    res.json(response);
    return;
  }
  res.status(404).json({ error: 'No books found' });
}

// býr til nýja bók ef hún er gild og skilar
async function postBook(req, res) {
  const {
    title = '',
    isbn13 = '',
    author = '',
    description = '',
    category = '',
    isbn10 = '',
    published = '',
    pagecount = '',
    language = '',
  } = req.body;

  const validation = validateBook({ title, isbn13 });
  if (!validation.isEmpty()) {
    const errors = validation.array().map(err => err.msg);
    res.status(400).json(errors);
    return;
  }
  const values = {
    title: xss(title).trim(),
    isbn13: xss(isbn13).trim(),
    author: xss(author).trim(),
    description: xss(description).trim(),
    category: xss(category).trim(),
    isbn10: xss(isbn10).trim(),
    published: xss(published).trim(),
    pagecount: xss(pagecount).trim(),
    language: xss(language).trim(),
  };
  const response = await postABook(values);
  // Vantar pælingar með ef category er ekki til
  res.status(201).json(response);
}

// skilar síðu af bókum sem uppfylla leitarskilyrði, sjá að neðan
async function searchBooks(req, res) {
  const { query } = req.body; // Pottó ekki rétta leiðin /books?search=query
  const cleanQuery = xss(query).trim();
  const response = searchAllBooks(cleanQuery);
  if (response.length > 0) {
    res.json(response);
    return;
  }
  res.status(404).json({ error: 'No books found' });
}

// skilar stakri bók
async function getBookById(req, res) {
  const { id } = req.body;
  const cleanId = xss(id).trim();
  const response = getABookById(cleanId);
  if (response.length > 0) {
    res.json(...response);
    return;
  }
  res.status(404).json({ error: 'No book found' });
}

// Uppfærir bók
async function patchBookById(req, res) {
}

/* todo útfæra api */
router.get('/books', catchErrors(getBooks));
router.post('/books', requireAuthentication, catchErrors(postBook));
router.get('/books?search=query', catchErrors(searchBooks));
router.get('/books/:id', requireAuthentication, catchErrors(getBookById));
router.patch('/books/:id', requireAuthentication, catchErrors(patchBookById));

module.exports = router;