CREATE TABLE users (
	id serial primary key,
	username varchar(20) unique NOT NULL,
	password text NOT NULL,
	name varchar(20) NOT NULL,
	photoUrl text 
);

CREATE TABLE categories (
  id serial primary key,
  category varchar(30) unique NOT NULL
);

CREATE TABLE library (
  id serial primary key,
  title character varying(255) NOT NULL,
  isbn13 char(13) unique,
  author character varying(64),
  description text,
  category varchar(30),
  isbn10 char(10),
  published varchar(10),
  pagecount text,
  language varchar(2),
	FOREIGN KEY (category) REFERENCES categories(category)
);

CREATE TABLE readBooks (
	id serial,
	user_id integer NOT NULL,
	book_id integer NOT NULL, 
	stars integer NOT NULL,
	review text,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (book_id) REFERENCES library(id)
);


