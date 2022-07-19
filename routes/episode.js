const express = require('express');
const { episodeController, watchHistoryController } = require('../controllers/episode');
const { validateToken } = require('../middleware/authorization');

const router = express.Router();
router.get('/episode/:id', validateToken ,episodeController);
//router.post('/episode/:id', validateToken ,watchHistoryController)

module.exports = router;