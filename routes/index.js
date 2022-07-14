const express = require('express');

const searchRouter = require('.search');

const router = express.Router();

router.use(searchRouter);

module.exports = router;
