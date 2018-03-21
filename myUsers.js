const express = require('express');
const { requireAuthentication } = require('./authentication');
const multer = require('multer');
const cloudinary = require('cloudinary');
const validator = require('validator');
const xss = require('xss');

const router = express.Router();
const uploads = multer({ dest: './temp' });
const {
  CLOUDINARY_CLOUD,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const {
  getOneUser,
  getReadBooks,
  patchUser,
  postPhotoUrl,
  postReadBooks,
  deleteReadBook,
} = require('./userData');

const { getABookById } = require('./bookData');

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

function validateUser(data) {
  const errors = [];
  if (Object.keys(data).includes('password')) {
    if (!validator.isLength(data.password, { min: 1 })) {
      errors.push({
        field: 'password',
        msg: 'password must be non-empty',
      });
    }
  }
  if (Object.keys(data).includes('name')) {
    if (!validator.isLength(data.name, { min: 1 })) {
      errors.push({
        field: 'name',
        msg: 'name must be non-empty',
      });
    }
  }
  return errors;
}

function validateReadBooks(data) {
  const errors = [];
  if (Object.keys(data).includes('book_id')) {
    if (!validator.isLength(data.book_id, { min: 1 }) || !validator.isNumeric(data.book_id)) {
      errors.push({
        field: 'book_id',
        msg: 'book_id must be numerical and non-empty',
      });
    }
  }
  if (Object.keys(data).includes('stars')) {
    if (!validator.isLength(data.stars, { min: 1, max: 1 }) ||
      !validator.isNumeric(data.stars) || data.stars < 1 || data.stars > 5) {
      errors.push({
        field: 'stars',
        msg: 'stars must be single numerical digit between 1-5',
      });
    }
  }
  return errors;
}

// skilar innskráðum notanda þ.e.a.s. þér
async function getMyUser(req, res) {
  const id = xss(req.user.id).trim();
  const response = await getOneUser(id);
  if (response.length < 1) {
    res.status(404).json({ error: 'User not found' });
  }
  res.status(200).json(response);
}

// Uppfærir sendar upplýsingar um notanda fyrir utan notendanafn,
// þ.e.a.s. nafn eða lykilorð, ef þau eru gild
async function patchMyUser(req, res) {
  const id = xss(req.user.id).trim();
  const data = req.body;

  Object.keys(data).forEach((key) => {
    data[key] = xss(data[key]).trim();
  });

  if (Object.keys(data).length < 1) {
    return res.status(404).json({ error: 'Nothing to update' });
  }
  const validation = validateUser(data);
  if (validation.length > 0) {
    const errors = validation.map(err => err.msg);
    return res.status(400).json({ errors });
  }

  const response = await patchUser(id, data);
  return res.status(200).json(response);
}

// setur eða uppfærir mynd fyrir notanda í gegnum Cloudinary og skilar slóð
async function postMyUserProfile(req, res, next) {
  const id = xss(req.user.id).trim();
  const path = xss(req.file.path);

  if (!path) {
    return res.status(404).json({ error: 'Photo not found' });
  }

  let upload = null;
  try {
    upload = await cloudinary.v2.uploader.upload(path);
  } catch (error) {
    console.error('Unable to upload file to cloudinary:', path);
    return next(error);
  }

  const { url } = upload;
  const response = await postPhotoUrl(id, url);
  return res.status(200).json(response);
}

// skilar síðu af lesnum bókum innskráðs notanda
async function getMyReadBooks(req, res) {
  const id = xss(req.user.id).trim();
  const response = await getReadBooks(id);
  if (response.length < 1) {
    return res.status(404).json({ error: 'User has no read books' });
  }
  return res.status(200).json(response);
}

// Býr til nýjan lestur á bók og skilar
async function postMyReadBooks(req, res) {
  const id = xss(req.user.id).trim();
  const data = req.body;

  Object.keys(data).forEach((key) => {
    data[key] = xss(data[key]).trim();
  });

  if (!Object.keys(data).includes('book_id') || !Object.keys(data).includes('stars')) {
    return res.status(400).json({ error: 'stars and book_id are needed' });
  }

  const validation = validateReadBooks(data);
  if (validation.length > 0) {
    const errors = validation.map(err => err.msg);
    return res.status(400).json({ errors });
  }

  const book = await getABookById(data.book_id);
  if (book.length < 1) {
    return res.status(400).json({ error: 'book not found' });
  }

  const readBooks = await postReadBooks(id, data);
  return res.status(201).json(readBooks);
}

// Eyðir lestur á bók
async function deleteMyReadBooksById(req, res) {
  const userId = xss(req.user.id).trim();
  const readId = xss(req.params.id).trim();

  const deleteRead = await deleteReadBook(userId, readId);
  res.status(200).json(deleteRead);
}

/* útfæra api */
router.get('/users/me', requireAuthentication, catchErrors(getMyUser));
router.patch('/users/me', requireAuthentication, catchErrors(patchMyUser));
router.post('/users/me/profile', requireAuthentication, uploads.single('image'), catchErrors(postMyUserProfile));
router.get('/users/me/read', requireAuthentication, catchErrors(getMyReadBooks));
router.post('/users/me/read', requireAuthentication, catchErrors(postMyReadBooks));
router.delete('/users/me/read/:id', requireAuthentication, catchErrors(deleteMyReadBooksById));
module.exports = router;
