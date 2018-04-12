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
  getABookByTitle,
  getABookByISBN13,
} = require('./bookData');
const { getACategory } = require('./categoriesData');

const port = 3000;

// Grípur villur
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

// Athugar hvort ´bok sem sett er inn innihaldi key values og á réttu formi
// Key values eru titel og ibn13
function validateBook(data) {
  const errors = [];
  if (Object.keys(data).includes('title')) {
    if (typeof data.title !== 'string' || !validator.isLength(data.title, { min: 1 })) {
      errors.push({
        field: 'title',
        msg: 'Title must be a non-empty string',
      });
    }
  }
  if (Object.keys(data).includes('isbn13')) {
    if (typeof data.isbn13 !== 'string' || !validator.isLength(data.isbn13, { min: 13, max: 13 }) || !validator.isNumeric(data.isbn13)) {
      errors.push({
        field: 'isbn13',
        msg: 'ISBN13 must be a string of numbers of length 13',
      });
    }
  }
  return errors;
}
// Skilar síðu af bókum
async function getBooks(req, res) {
  let { search, offset = 0, limit = 10 } = req.query; // eslint-disable-line
  offset = Number(offset);
  limit = Number(limit);

  const rows = await getBooksByQ(search, offset, limit);
  if (rows.length > 0) {
    const result = {
      _links: {
        self: {
          href: `pactgreining.herokuapp.com/books?offset=${offset}&limit=${limit}`,
        },
      },
      items: rows,
    };

    if (offset > 0) {
      result._links.prev = { // eslint-disable-line
        href: `pactgreining.herokuapp.com/books?offset=${offset - limit}&limit=${limit}`,
      };
    }

    if (rows.length <= limit) {
     result._links.next = { // eslint-disable-line
        href: `pactgreining.herokuapp.com/books?offset=${Number(offset) + limit}&limit=${limit}`,
      };
    }

    res.json(result);
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
    res.status(400).json({ errors });
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
  const responseISBN13Exists = await getABookByISBN13(values.isbn13);
  if (responseISBN13Exists.length > 0) {
    res.status(400).json('A book with this ISBN13 already exists.');
    return;
  }
  const responseTitleExists = await getABookByTitle(values.title);
  if (responseTitleExists.length > 0) {
    res.status(400).json('A book with this title already exists.');
    return;
  }
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
  const id = xss(req.params.id).trim();
  const data = req.body;
  const toValidate = {};

  Object.keys(data).forEach((key) => {
    data[key] = xss(data[key]).trim();
  });

  const responseBookDosntExist = await getABookById(id);
  if (responseBookDosntExist.length !== 1) {
    res.status(400).json('No book with this id exists.');
    return;
  }

  if (Object.keys(data).includes('title')) {
    toValidate.title = data.title;
    const responseTitleExists = await getABookByTitle(data.title);
    if (responseTitleExists.length > 0 && responseTitleExists[0].id.toString() !== id) {
      res.status(400).json('A book with this title already exists.');
      return;
    }
  }
  if (Object.keys(data).includes('isbn13')) {
    toValidate.isbn13 = data.isbn13;
    const responseISBN13Exists = await getABookByISBN13(data.isbn13);
    if (responseISBN13Exists.length > 0 && responseISBN13Exists[0].id.toString() !== id) {
      res.status(400).json('A book with this ISBN13 already exists.');
      return;
    }
  }
  if (Object.keys(data).includes('category')) {
    const responseCategoryExists = await getACategory(data.category);
    if (responseCategoryExists.length < 1) {
      res.status(400).json('Chosen category does not exist. Please choose an existing category or create a new category');
      return;
    }
  }

  const validation = await validateBook(toValidate);
  if (validation.length > 0) {
    const errors = validation.map(err => err.msg);
    res.status(400).json({ errors });
    return;
  }

  const response = await patchABookById(id, data);
  res.status(201).json(response);
}

/* todo útfæra api */
router.get('/books', catchErrors(getBooks));
router.get('/books/:id', requireAuthentication, catchErrors(getBookById));
router.post('/books', requireAuthentication, catchErrors(postBook));
router.patch('/books/:id', requireAuthentication, catchErrors(patchBookById));

module.exports = router;
