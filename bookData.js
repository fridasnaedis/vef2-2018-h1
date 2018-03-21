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

async function getBooksByQ(search) {
  let q;
  let result;
  if (search === '') {
    q = 'SELECT * FROM library';
    result = await query(q);
  } else {
    q = `
    SELECT * FROM library
    WHERE 
      to_tsvector('english', title) @@ to_tsquery('english', $1) 
      OR
      to_tsvector('english', description) @@ to_tsquery('english', $1)
    `;
    result = await query(q, [search]);
  }
  return result.rows;
}

async function postABook({
  title, isbn13, author, description, category, isbn10, published, pagecount, language,
} = {}) {
  const qcat = 'SELECT * FROM categories WHERE category=$1';
  const resultcat = await query(qcat, [category]);
  if (resultcat.rows.length === 0) {
    return {};
  }
  const q = 'INSERT INTO library (title, isbn13, author, description, category, isbn10, published, pagecount, language) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING*;';
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

async function getABookById(id = '') {
  const q = 'SELECT * FROM library WHERE id=$1';
  const result = await query(q, [id]);
  return result.rows;
}

async function getABookByTitle(title = '') {
  const q = 'SELECT * FROM library WHERE title=$1';
  const result = await query(q, [title]);
  return result.rows;
}

async function getABookByISBN13(isbn13 = '') {
  const q = 'SELECT * FROM library WHERE isbn13=$1';
  const result = await query(q, [isbn13]);
  return result.rows;
}

async function patchABookById() {

}

module.exports = {
  getBooksByQ,
  postABook,
  getABookById,
  patchABookById,
  getABookByTitle,
  getABookByISBN13,
};

