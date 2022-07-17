const express = require('express');

const programRouter = require('./program');
const userRouter = require('./user');

const router = express.Router();

router.use(programRouter);
router.use(userRouter);

module.exports = router;
