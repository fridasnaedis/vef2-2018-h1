const express = require('express');

const router = express.Router();

const { requireAuthentication } = require('./authentication');

// skilar innskráðum notanda þ.e.a.s. þérr
function getMyUser(req, res) {
  console.log(req.user[0].id);
}

// Uppfærir sendar upplýsingar um notanda fyrir utan notendanafn,
// þ.e.a.s. nafn eða lykilorð, ef þau eru gild
function patchMyUser(req, res) {
  // TODO
}

// setur eða uppfærir mynd fyrir notanda í gegnum Cloudinary og skilar slóð
function postMyUserProfile(req, res) {
  // TODO
}

// skilar síðu af lesnum bókum innskráðs notanda
function getMyReadBooks(req, res) {
  // TODO
}

// Býr til nýjan lestur á bók og skilar
function postMyReadBooks(req, res) {
  // TODO
}

function deleteMyReadBooksById(req, res) {
  // TODO
}

/* todo útfæra api */
router.get('/users/me', requireAuthentication, getMyUser);
router.patch('/users/me', requireAuthentication, patchMyUser);
router.post('users/me/profile', requireAuthentication, postMyUserProfile);
router.get('/users/me/read', requireAuthentication, getMyReadBooks);
router.post('/users/me/read', requireAuthentication, postMyReadBooks);
router.delete('/users/me/read/:id', requireAuthentication, deleteMyReadBooksById);
module.exports = router;
