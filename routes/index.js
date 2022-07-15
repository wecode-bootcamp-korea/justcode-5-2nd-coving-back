const express = require('express');

const programRouter = require('./program');

const router = express.Router();

router.use(programRouter);

module.exports = router;