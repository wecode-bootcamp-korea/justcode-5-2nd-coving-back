const express = require('express');

const searchRouter = require('./search');
const programRouter = require('./program');
const mainRouter = require('./main');

//const mypageRouter = require('./mypage');
const episodeRouter = require('./episode');
const userRouter = require('./user');


const router = express.Router();

router.use('/search', searchRouter);
router.use(programRouter);
<<<<<<< HEAD
router.use(mainRouter);
=======
//router.use(mypageRouter);
router.use(episodeRouter);
router.use(userRouter);
>>>>>>> origin

module.exports = router;
