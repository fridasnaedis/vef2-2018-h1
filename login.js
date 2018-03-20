//TODO setja inn rétt imports
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Strategy, ExtractJwt } = require('passport-jwt');
const {
  getByUsername,
  createUser,
} = require('./userData');


const {
  JWT_SECRET: jwtSecret,
  TOKEN_LIFETIME: tokenLifetime = 2000,
} = process.env;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

async function comparePasswords(hash, password) {
  const result = await bcrypt.compare(hash, password);

  return result;
}


// Býr til notanda og skilar án lykilorðs hash
async function postRegister(req, res) {
  const { username, name, password } = req.body;
  const previousUser = await getByUsername(username);
  if (!previousUser && username && name && password) {
    await createUser(username, password, name);
    return res.status(201);
  }
  return res.status(409).json({ error: 'Username already exists or required data missing' });
}

// Post með notendanafni og lykilorði, skilar token
async function postLogin(req, res) {
  const { username, password } = req.body;
  const user = await getByUsername(username);

  if (!user) {
    return res.status(401).json({ error: 'No such user' });
  }

  const passwordIsCorrect = await comparePasswords(password, user.password);
  if (passwordIsCorrect) {
    const payload = { id: user.id };
    const tokenOptions = { expiresIn: tokenLifetime };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Invalid password' });
}

/* todo útfæra api */
router.post('/register', postRegister);
router.post('/login', postLogin);

module.exports = router;
