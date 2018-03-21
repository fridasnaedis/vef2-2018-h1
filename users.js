const express = require('express');
const { requireAuthentication } = require('./authentication');

const {
  getAllUsers,
  getOneUser,
  getReadBooks,
} = require('./userData');

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

// Skilar síðu af notendum (ekkert lykilorð)
async function getUsers(req, res) {
  const users = await getAllUsers();
  res.status(200).json(users);
}

// Skilar stökum notendum ef til (ekkert lykilorð)
async function getUsersById(req, res) {
  const { id } = req.params;
  const response = await getOneUser(id);
  if (response.length < 1) {
    res.status(404).json({ error: 'User not found' });
  }
  res.status(200).json(response);
}

// Skilar síðu af bókum sem uppfylla leitarskilyrði, sjá að neðan
async function getReadBooksByUsersId(req, res) {
  const { id } = req.params;
  const response = await getReadBooks(id);
  if (response.length < 1) {
    res.status(404).json({ error: 'User not found' });
  }
  res.status(200).json(response);
}

/* todo útfæra api */
router.get('/users', requireAuthentication, catchErrors(getUsers));
router.get('/users/:id', requireAuthentication, catchErrors(getUsersById));
router.get('/users/:id/read', requireAuthentication, catchErrors(getReadBooksByUsersId));

module.exports = router;
