const express = require('express');
const { programController, programLikeController } = require('../controllers/program');

const router = express.Router();
router.get('/program/:id', programController);
router.post('/program/:id', programLikeController)

module.exports = router;