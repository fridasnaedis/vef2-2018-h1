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
  return result.rows[0];
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

/**
 * Create a new user.
 *
 * @param {username} username - unique username, {password} - password, {name} - name
 *
 * @returns {Promise} Promise representing a new user
 */
async function createUser(username, password, name) {
  const hashedPassword = await bcrypt.hash(password, 11);

  const q = 'INSERT INTO users (username, password, name) VALUES ($1, $2, $3) RETURNING id, username, name, photourl;';

  const result = await query(q, [username, hashedPassword, name]);

  return result.rows[0];
}

/**
 * Patch logged in user.
 *
 * @param {number} id - Id of user, {string} name -new name, {string} password - new password
 *  if name or pw is null = dont update, if not allowed return error
 *
 * @returns {Promise} Promise representing the updated user
 */
async function patchUser(id, data) {
  const toUpdate = [];

  Object.keys(data).forEach((key) => {
    if (key === 'password') {
      toUpdate.push(`${key} = '${bcrypt.hash(data[key], 11)}'`);
    } else {
      toUpdate.push(`${key} = '${data[key]}'`);
    }
  });

  const q = `UPDATE users SET ${[...toUpdate]}  WHERE id = $1 RETURNING id, username, name, photourl;`;
  const result = await query(q, [id]);
  return result.rows;
}

/**
 * Change user photo.
 *
 * @param {number} id - Id of user, {string} photoUrl - path to user photo
 *
 * @returns {Promise} Promise representing updated photo-url
 */
async function postPhotoUrl(id, url) {
  const q = 'UPDATE users SET photourl = $2 WHERE id=$1 RETURNING photourl;';
  const values = [id, url];
  const result = await query(q, values);
  return result.rows[0];
}

/**
 * Add a book to user read books
 *
 * @param {number} id - Id of user, {obj} data
 * data:{{number} book_id - id of book, {number} stars - star rating, {string} review - user review}
 *
 * @returns {Promise} Promise representing added book to read books
 */
async function postReadBooks(id, data) {
  const keys = [];
  const values = [id];

  Object.keys(data).forEach((key) => {
    values.push(`'${data[key]}'`);
    keys.push(key);
  });

  const q = `INSERT INTO readbooks (user_id, ${[...keys]}) VALUES (${[...values]}) RETURNING *;`;
  const result = await query(q);
  return result.rows[0];
}


/**
 * Delete a read book
 *
 * @param {number} Id - Id of user, {number} read_id - Id of read book
 *
 * @returns {Promise} Promise representing deleted book from read books
 */
async function deleteReadBook(userId, bookId) {
  const values = [userId, bookId];
  const check = 'SELECT* FROM readbooks WHERE user_id = $1 AND id = $2';
  const found = await query(check, values);
  if (found.rowCount < 1) {
    return { error: 'Read book not found' };
  }
  const q = 'DELETE FROM readbooks WHERE user_id = $1 AND id = $2';
  await query(q, values);
  return { deleted: 'ok' };
}

module.exports = {
  getAllUsers,
  getOneUser,
  getReadBooks,
  createUser,
  getByUsername,
  comparePasswords,
  patchUser,
  postPhotoUrl,
  postReadBooks,
  deleteReadBook,
};
