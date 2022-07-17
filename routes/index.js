const express = require('express');

const programRouter = require('./program');
const mainRouter = require('./main');

const router = express.Router();

router.use(programRouter);
router.use(mainRouter);

module.exports = router;
