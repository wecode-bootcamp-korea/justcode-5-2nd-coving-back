const express = require('express');
const {
  SocialLoginController,
  SocialLoginStatusCodeController,
} = require('../controllers/user');

const router = express.Router();
router.post('/login', SocialLoginController);
router.post('/socialLogin', SocialLoginStatusCodeController);

module.exports = router;
