const bcrypt = require('bcrypt');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/h1';

async function query(q, values = []) {
  const client = new Client(connectionString);
  await client.connect();

  let result;
  try {
    result = await client.query(q, values);
  } catch (err) {
    console.error('err');
    throw err;
  } finally {
    await client.end();
  }
  return result;
}

/**
 * Get all users.async function comparePasswords(password, hash) {
  const result = await bcrypt.compare(password, hash);

  return result;
}
 *
 * @returns {Promise} Promise representing an array of all users
 */
async function getAllUsers() {
  const q = 'SELECT id, username, name, photourl FROM users;';
  const result = await query(q);
  return result.rows;
}

async function comparePasswords(password, hash) {
  const result = await bcrypt.compare(password, hash);

  return result;
}

async function getByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';

  const result = await query(q, [username]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

/**
 * Get a single user.
 *
 * @param {number} id - Id of user
 *
 * @returns {Promise} Promise representing the user object or null if not found
 */
async function getOneUser(id) {
  const q = 'SELECT id, username, name, photourl FROM users WHERE id=$1;';
  const values = [id];
  const result = await query(q, values);
  return result.rows;
}

/**
 * Get a users read books.
 *
 * @param {number} id - Id of user
 *
 * @returns {Promise} Promise representing the users read books or null if not found
 */
async function getReadBooks(id) {
  const q = 'SELECT * FROM readBooks WHERE user_id=$1;';
  const values = [id];
  const result = await query(q, values);
  return result.rows;
}

async function createUser(username, password, name) {
  const hashedPassword = await bcrypt.hash(password, 11);

  const q = 'INSERT INTO users (username, password, name) VALUES ($1, $2, $3) RETURNING *';

  const result = await query(q, [username, hashedPassword, name]);

  return result.rows[0];
}

module.exports = {
  getAllUsers,
  getOneUser,
  getReadBooks,
  createUser,
  getByUsername,
  comparePasswords,
};
