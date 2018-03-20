require('dotenv').config();
const passport = require('passport');
const express = require('express');

const { Strategy, ExtractJwt } = require('passport-jwt');

const users = require('./users');
const books = require('./books');
const login = require('./login');
const categories = require('./categories');
const myUsers = require('./myUsers');
const userData = require('./userData');

const {
  PORT: port = 3000,
  JWT_SECRET: jwtSecret,
  HOST: host = '127.0.0.1',
} = process.env;

if (!jwtSecret) {
  console.error('JWT_SECRET not registered in .env');
  process.exit(1);
}

const app = express();
app.use(express.json());

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

async function strat(data, next) {
  const user = await userData.getOneUser(data.id);

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}

passport.use(new Strategy(jwtOptions, strat));

app.use(passport.initialize());

app.get('/', (req, res) => {
  res.json({
    login: '/login',
    admin: '/admin',
  });
});

app.use(myUsers);
app.use(users);
app.use(books);
app.use(categories);
app.use(login);

app.use(express.json());
app.use('/users', users);
app.use('/books', books);
app.use('/users/me', myUsers);
app.use('/categories', categories);
app.use('/register', login);
app.use('/login', login);

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).json({ error: 'Not found' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server running at http://${host}:${port}/`);
});

