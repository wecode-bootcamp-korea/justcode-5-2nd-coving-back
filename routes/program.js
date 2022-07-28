const express = require('express');
const programController = require('../controllers/program');
const { validateToken } = require('../middleware/authorization');

const router = express.Router();
router.get('/program/:id', validateToken, programController.programController);
router.post(
  '/program/:id',
  validateToken,
  programController.programLikeController
);
router.get('/episode/:id', validateToken, programController.episodeController);

router.get('/main', validateToken, programController.mainController);
router.get('/tvseries', programController.contentController);

router.get('/instantsearch', programController.getInstantSearch);
router.get('/searchresult', programController.getSearchResult);
router.get('/popularsearch', programController.getPopularSearch);
router.post('/searchlog/:id', programController.addSearchLog);

module.exports = router;
