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
 * Get all categories.
 *
 * @returns {Promise} Promise representing an array of all categories
 */
async function getAllCategories() {
  const q = 'SELECT * FROM categories;';
  const result = await query(q);
  return result.rows;
}


/**
 * Post a new category
 *
 *
 */
async function postACategory({ id, category } = {}) {
  const q = 'INSERT INTO categories(id, category) VALUES($1, $2) RETURNING*;';
  const values = [id, category];
  const result = await query(q, values);
  return result.rows;
}

module.exports = {
  getAllCategories,
  postACategory,
};
