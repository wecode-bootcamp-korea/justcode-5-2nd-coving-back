const express = require('express');
const { programController } = require('../controllers/program');

const router = express.Router();
router.get('/program/:id', programController);

module.exports = router;