const express = require('express');
const {
  getInstantSearch,
  getPopularSearch,
  getSearchResult,
  addSearchLog,
} = require('../controllers/search');

const router = express.Router();

router.get('/', getInstantSearch);
router.get('/2', getSearchResult);
router.get('/', getPopularSearch);
router.post('/:id', addSearchLog);

module.exports = router;
