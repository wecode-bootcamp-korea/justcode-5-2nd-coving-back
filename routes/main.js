const express = require('express');
const { mainController, genreController } = require('../controllers/main');

const router = express.Router();
router.get('/', mainController);
router.get('/list/:id', genreController);

module.exports = router;
