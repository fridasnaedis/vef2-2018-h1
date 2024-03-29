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
async function getAllCategories(offset = 0, limit = 10) {
  const q = 'SELECT * FROM categories ORDER BY id OFFSET $1 LIMIT $2;';
  const result = await query(q, [offset, limit]);
  return result.rows;
}

// Skilar einum flokk
async function getACategory(category) {
  const q = 'SELECT * FROM categories WHERE category = $1';
  const result = await query(q, [category]);
  return result.rows;
}

/**
 * Post a new category
 *
 *
 */
async function postACategory(category) {
  const q = 'INSERT INTO categories(category) VALUES($1) RETURNING*;';
  const result = await query(q, [category]);
  return result.rows;
}


module.exports = {
  getAllCategories,
  postACategory,
  getACategory,
};
