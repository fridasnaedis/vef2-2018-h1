const express = require('express');
const validator = require('validator');
const { requireAuthentication } = require('./authentication');
const xss = require('xss');

const router = express.Router();

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
  const response = await getAllCategories();
  if (response.length > 0) {
    res.json(response);
    return;
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
