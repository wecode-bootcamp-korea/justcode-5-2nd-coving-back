const express = require('express');
const { mainController, contentController } = require('../controllers/main');

const router = express.Router();
router.get('/', mainController);
router.get('/list', contentController);

module.exports = router;
