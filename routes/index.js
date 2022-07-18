const express = require('express');

const searchRouter = require('./search');
const programRouter = require('./program');

const mypageRouter = require('./mypage');
const episodeRouter = require('./episode');
const userRouter = require('./user');

const router = express.Router();

router.use(mainRouter);
router.use('/search', searchRouter);
router.use(programRouter);
router.use(mypageRouter);
router.use(episodeRouter);
router.use(userRouter);

module.exports = router;
