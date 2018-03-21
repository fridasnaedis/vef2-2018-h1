const express = require('express');
const validator = require('validator');
const { requireAuthentication } = require('./authentication');
const xss = require('xss');

const router = express.Router();

const port = 3000;

const {
  getAllCategories,
  postACategory,
  getACategory,
}
 = require('./categoriesData');

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

function validateCategory({ category }) {
  const errors = [];
  if (typeof category !== 'string' || !validator.isLength(category, { min: 1 })) {
    errors.push({
      field: 'category',
      message: 'Category must be a non-empty string',
    });
  }

  return errors;
}

// Skilar síðu af flokkum
async function getCategories(req, res) {
  let { offset = 0, limit = 10 } = req.query;
  offset = Number(offset);
  limit = Number(limit);

  const rows = await getAllCategories(offset, limit);
  if (rows.length > 0) {
    const result = {
      _links: {
        self: {
          href: `http://localhost:${port}/categories?offset=${offset}&limit=${limit}`,
        },
      },
      items: rows,
    };

    if (offset > 0) {
      result._links.prev = { // eslint-disable-line
        href: `http://localhost:${port}/categories?offset=${offset - limit}&limit=${limit}`,
      };
    }

    if (rows.length <= limit) {
      result._links.prev = { // eslint-disable-line
        href: `http://localhost:${port}/categories?offset=${Number(offset) + limit}&limit=${limit}`,
      };
    }

    res.json(result);
  }
  res.status(404).json({ error: 'No categories found' });
}

// Býr til nýjan flokk og skilar
async function postCategories(req, res) {
  const { category = '' } = req.body;
  const validation = validateCategory({ category });
  if (validation.length > 0) {
    const errors = validation.map(err => err.msg);
    res.status(400).json(errors);
    return;
  }
  const cleanCategory = xss(category).trim();
  const responseExists = await getACategory(cleanCategory);
  if (responseExists.length > 0) {
    res.status(400).json('Category already exists.');
    return;
  }
  const response = await postACategory(cleanCategory);
  res.status(201).json(response);
}

/* todo útfæra api */

router.get('/categories', catchErrors(getCategories));
router.post('/categories', requireAuthentication, catchErrors(postCategories));

module.exports = router;
