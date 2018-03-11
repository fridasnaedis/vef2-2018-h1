const { Client } = require('pg');

const csv=require('csvtojson');

csv()
.fromFile('./data/books.csv')
.on("end_parsed",function(jsonArrayObj){ 
    loadToDb(jsonArrayObj);
  })

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/h1';

async function query(q, values = []) {
    const client = new Client({connectionString});
    await client.connect();
    
    let result;
    try {
      await client.query(q, values);
      result = 'ok';
    } catch (err) {
      console.error('Error running query');
      throw err;
    } finally {
      await client.end();
    }
    return result;
  }

async function loadToDb(jsonObj) {
    const categories = [];
    
    for(i=0; i< jsonObj.length; i++ ) {
        const book = jsonObj[i];
        // Ath hvort category hefur komið annars bæta í categories töflu
        if (!categories.includes(book.category)) { 
            const q = 'INSERT INTO categories (category) VALUES($1);';
            const values = [book.category];
            await query(q, values);
            categories.push(book.category);
        }

        const q = 'INSERT INTO library (title, isbn13, author, description, category, isbn10, published, pagecount, language) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);';
        const values = [book.title, book.isbn13, book.author, book.description, book.category, book.isbn10, book.published, book.pagecount, book.language];
        
        await query(q, values);
    }
}


