const express = require('express');
const {
  getInstantSearch,
  getPopularSearch,
  getSearchResult,
  addSearchLog,
} = require('../controllers/search');

const router = express.Router();

router.get('/instant', getInstantSearch);
router.get('/', getSearchResult);
router.get('/popular', getPopularSearch);
router.post('/:id', addSearchLog);

module.exports = router;
