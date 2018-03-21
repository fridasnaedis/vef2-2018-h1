// TODO setja inn rétt imports
const express = require('express');

const router = express.Router();
const validator = require('validator');
const { requireAuthentication } = require('./authentication');
const xss = require('xss');
const {
  getBooksByQ,
  postABook,
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
  return errors;
}
// Skilar síðu af bókum
async function getBooks(req, res) {
  const { search = '' } = req.query;
  const response = await getBooksByQ(search);
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
  if (validation.length > 0) {
    const errors = validation.map(err => err.msg);
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
  if (Object.keys(response).length === 0 && response.constructor === Object) {
    res.status(400).json('Chosen category does not exist. Please choose an existing category or create a new category');
    return;
  }
  res.status(201).json(response);
}

// skilar stakri bók
async function getBookById(req, res) {
  const { id } = req.params;
  const cleanId = xss(id).trim();
  const response = await getABookById(cleanId);
  if (response.length > 0) {
    res.json(response);
    return;
  }
  res.status(404).json({ error: 'No book found' });
}

// Uppfærir bók
async function patchBookById(req, res) {
}

/* todo útfæra api */
router.get('/books', catchErrors(getBooks));
router.get('/books/:id', requireAuthentication, catchErrors(getBookById));
router.post('/books', catchErrors(postBook));
router.patch('/books/:id', requireAuthentication, catchErrors(patchBookById));

module.exports = router;
