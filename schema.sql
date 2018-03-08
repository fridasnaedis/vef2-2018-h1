CREATE TABLE library (
  id serial primary key,
  title character varying(255) NOT NULL,
  author character varying(64),
  description text,
  isbn10 bigint,
  isbn13 bigint NOT NULL,
  published date,
  pagecount integer,
  language text,
  category text
);