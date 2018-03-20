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

async function getAllBooks() {
  const q = 'SELECT * FROM library';
  const result = await query(q);
  return result.rows;
}

async function postABook({
  title, isbn13, author, description, category, isbn10, published, pagecount, language,
} = {}) {
  const q = 'INSERT INTO library (title, isbn13, author, description, category, isbn10, published, pagecount, language) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING*;';
  const values = [title,
    isbn13,
    author,
    description,
    category,
    isbn10,
    published,
    pagecount,
    language];
  const result = await query(q, values);
  return result.rows;
}

async function searchAllBooks(q) {

}

async function getABookById({ id } = {}) {
  const q = `SELECT * FROM library WHERE id =${id}`;
  const result = await query(q);
  return result.rows;
}

async function patchABookById({ id } = {}) {

}

module.exports = {
  getAllBooks,
  postABook,
  searchAllBooks,
  getABookById,
  patchABookById,
};

