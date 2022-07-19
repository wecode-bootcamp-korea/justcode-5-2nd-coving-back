const express = require('express');
const { programController, programLikeController } = require('../controllers/program');
const { validateToken } = require('../middleware/authorization');

const router = express.Router();
router.get('/program/:id', validateToken ,programController);
router.post('/program/:id', validateToken ,programLikeController)

module.exports = router;