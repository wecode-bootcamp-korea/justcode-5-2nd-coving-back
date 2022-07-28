const express = require('express');
const usersController = require('../controllers/user');
const { validateToken } = require('../middleware/authorization');

const router = express.Router();
router.get('/my/watch', validateToken, usersController.watchHistoryList);
router.delete(
  '/my/watch',
  validateToken,
  usersController.watchHistoryController
);
router.get('/my/favorite', validateToken, usersController.likeList);
router.delete(
  '/my/favorite',
  validateToken,
  usersController.likeHistoryController
);

router.post('/googleLogin', usersController.googleLoginController);
router.post('/naverLogin', usersController.naverLoginController);
router.post('/kakaoLogin', usersController.kakaoLoginController);

// router.update('/myprofile', validateToken, usersController.profileController);

module.exports = router;
