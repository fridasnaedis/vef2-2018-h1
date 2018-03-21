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
  const user = await getOneUser(id);
  res.status(200).json(user);
}

// Skilar síðu af bókum sem uppfylla leitarskilyrði, sjá að neðan
async function getReadBooksByUsersId(req, res) {
  const { id } = req.params;
  const readBooks = await getReadBooks(id);
  res.status(200).json(readBooks);
}

/* todo útfæra api */
router.get('/users', requireAuthentication, catchErrors(getUsers));
router.get('/users/:id', requireAuthentication, catchErrors(getUsersById));
router.get('/users/:id/read', requireAuthentication, catchErrors(getReadBooksByUsersId));

module.exports = router;
