const express = require('express');

const router = express.Router();

// skilar innskráðum notanda þ.e.a.s. þér
function getMyUser(req, res) {
    // TODO
}

// Uppfærir sendar upplýsingar um notanda fyrirutan notendanafn, 
// þ.e.a.s. nafn eða lykilorð, ef þau eru gild
function patchMyUser(req, res) {
    // TODO
}ad

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
router.get('/users/me', getMyUser);
router.patch('/users/me', patchMyUser);
router.post('users/me/profile', postMyUserProfile);
router.get('/users/me/read', getMyReadBooks);
router.post('/users/me/read', postMyReadBooks);
router.delete('/users/me/read/:id', deleteMyReadBooksById);

module.exports = router;