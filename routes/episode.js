const express = require('express');
const { episodeController, watchHistoryController } = require('../controllers/episode');

const router = express.Router();
router.get('/episode/:id', episodeController);
router.post('/episode/:id', watchHistoryController)

module.exports = router;