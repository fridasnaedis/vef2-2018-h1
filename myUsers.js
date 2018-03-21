const express = require('express');
const { requireAuthentication } = require('./authentication');

const router = express.Router();

const {
  getOneUser,
  getReadBooks,
  patchUser,
  postPhotoUrl,
  postReadBooks,
  deleteReadBook,
} = require('./userData');


// skilar innskráðum notanda þ.e.a.s. þér
async function getMyUser(req, res) {
  const { id } = req.user;

  const user = await getOneUser(id);
  res.status(200).json(user);
}

// Uppfærir sendar upplýsingar um notanda fyrir utan notendanafn,
// þ.e.a.s. nafn eða lykilorð, ef þau eru gild
async function patchMyUser(req, res) {
  // check inputs ---- no hackers
  const { id } = req.user;
  const data = req.body;

  const updatedUser = await patchUser(id, data);

  res.status(200).json(updatedUser);
}

// setur eða uppfærir mynd fyrir notanda í gegnum Cloudinary og skilar slóð
async function postMyUserProfile(req, res) {
  // - þarf að nota Cloudinary ????? idk skoða
  const { id } = req.user;
  const url = req.body.photourl;
  const postProfile = await postPhotoUrl(id, url);

  res.status(200).json(postProfile);
}

// skilar síðu af lesnum bókum innskráðs notanda
async function getMyReadBooks(req, res) {
  const { id } = req.user;
  const readBooks = await getReadBooks(id);

  res.status(200).json(readBooks);
}

// Býr til nýjan lestur á bók og skilar
async function postMyReadBooks(req, res) {
  const { id } = req.user;
  const data = req.body;
  const readBooks = await postReadBooks(id, data);

  res.status(200).json(readBooks);
}

async function deleteMyReadBooksById(req, res) {
  const userId = req.user.id;
  const readId = req.params.id;

  const deleteRead = await deleteReadBook(userId, readId);
  res.status(200).json(deleteRead);
}

/* todo útfæra api */
router.get('/users/me', requireAuthentication, getMyUser);
router.patch('/users/me', requireAuthentication, patchMyUser);
router.post('/users/me/profile', requireAuthentication, postMyUserProfile);
router.get('/users/me/read', requireAuthentication, getMyReadBooks);
router.post('/users/me/read', requireAuthentication, postMyReadBooks);
router.delete('/users/me/read/:id', requireAuthentication, deleteMyReadBooksById);
module.exports = router;
