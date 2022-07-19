const express = require('express');
const { mainController, contentController } = require('../controllers/main');
const { validateToken } = require('../middleware/authorization');

const router = express.Router();
router.get('/', validateToken, mainController);
router.get('/list', contentController);

module.exports = router;
