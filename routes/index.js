const express = require('express');

const searchRouter = require('./search');
const programRouter = require('./program');

const router = express.Router();

router.use('/search', searchRouter);
router.use(programRouter);

module.exports = router;