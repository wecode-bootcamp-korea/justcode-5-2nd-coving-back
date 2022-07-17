const express = require('express');

const searchRouter = require('./search');
const programRouter = require('./program');
const userRouter = require('./user');

const router = express.Router();

router.use('/search', searchRouter);
router.use(programRouter);
router.use(userRouter);

module.exports = router;
