const express = require('express');
const { watchHistoryList, likeList, watchHistoryController, likeHistoryController } = require('../controllers/mypage');

const router = express.Router();
router.get('/my/watch', watchHistoryList);
router.delete('/my/watch', watchHistoryController);
router.get('/my/favorite', likeList);
router.delete('/my/favorite', likeHistoryController)

module.exports = router;