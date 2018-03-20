const bcrypt = require('bcrypt');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/h1';

async function query(q, values = []) {
  const client = new Client(connectionString);
  await client.connect();

  console.log(q);

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
  // þarf ekki að checka hér á inputum ?? ------- TODO
  const q = 'INSERT INTO users (username, password, name) VALUES ($1, $2, $3) RETURNING *';

  const result = await query(q, [username, hashedPassword, name]);

  return result.rows[0];
}

/**
 * Patch logged in user.
 *
 * @param {id, name, password} id - Id of user, name -new name, password - new password
 *  if name or pw is null = dont update, if not allowed return error
 *
 * @returns {Promise} Promise representing the updated user
 */
async function patchUser(id, data) {
  const toUpdate = [];

  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === "password") {
        // Hash password
        const hashedPassword = await bcrypt.hash(data[key], 11);
        data[key] = hashedPassword;
      }
      toUpdate.push(key + " = " + "'" + data[key] + "'");
    }
  }

  const q = `UPDATE users SET ${[...toUpdate]} WHERE id = $1 RETURNING *`;
  const values = [id];
  const result = await query(q, values);

  return result.rows;
}


module.exports = {
  getAllUsers,
  getOneUser,
  getReadBooks,
  createUser,
  getByUsername,
  comparePasswords,
  patchUser,
};
