CREATE TABLE library (
  id serial primary key,
  title character varying(255) NOT NULL,
  author character varying(64),
  description text,
  isbn13 char(13) unique,
  published date,
  pagecount integer,
  language text,
  category text
);