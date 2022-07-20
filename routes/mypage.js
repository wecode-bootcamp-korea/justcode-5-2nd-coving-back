const express = require('express');
const { watchHistoryList, likeList, watchHistoryController, likeHistoryController } = require('../controllers/mypage');
const { validateToken } = require('../middleware/authorization');

const router = express.Router();
router.get('/my/watch', validateToken ,watchHistoryList);
router.delete('/my/watch', validateToken ,watchHistoryController);
router.get('/my/favorite', validateToken ,likeList);
router.delete('/my/favorite', validateToken ,likeHistoryController);

module.exports = router;