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

router.post('/login', usersController.SocialLoginController);
router.post('/socialLogin', usersController.SocialLoginStatusCodeController);

module.exports = router;
