const express = require('express');
const { SocialLoginController } = require('../controllers/user');

const router = express.Router();
router.post('/login', SocialLoginController);

module.exports = router;
