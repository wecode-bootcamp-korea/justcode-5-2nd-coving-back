const express = require('express');

const programRouter = require('./program');
const mypageRouter = require('./mypage');
const episodeRouter = require('./episode');

const router = express.Router();

router.use(programRouter);
router.use(mypageRouter);
router.use(episodeRouter);

module.exports = router;