CREATE TABLE library (
  id serial primary key,
  title character varying(255) NOT NULL,
  isbn13 char(13) unique,
  author character varying(64),
  description text,
  category text,
  isbn10 char(10),
  published date,
  pagecount integer,
  language text
);