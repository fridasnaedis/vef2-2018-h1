const express = require('express');

const router = express.Router();

const { 
  getAllUsers,
  getOneUser,
  getReadBooks,
  patchUser,
  } =  require('./userData');



// skilar innskráðum notanda þ.e.a.s. þér
async function getMyUser(req, res) {

  const id = 1; 
  // check login --- get id --- TODO

  const user = await getOneUser(id); 
  res.status(200).json(user);
}

// Uppfærir sendar upplýsingar um notanda fyrir utan notendanafn,
// þ.e.a.s. nafn eða lykilorð, ef þau eru gild
async function patchMyUser(req, res) {

  // check login --- get id --- TODO
  const id = 1; 
  const data = req.body;

  const updatedUser = await patchUser(id, data);

  res.status(200).json(updatedUser);






}

// setur eða uppfærir mynd fyrir notanda í gegnum Cloudinary og skilar slóð
async function postMyUserProfile(req, res) {
  // TODO
}

// skilar síðu af lesnum bókum innskráðs notanda
async function getMyReadBooks(req, res) {
  // TODO
}

// Býr til nýjan lestur á bók og skilar
async function postMyReadBooks(req, res) {
  // TODO
}

async function deleteMyReadBooksById(req, res) {
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
