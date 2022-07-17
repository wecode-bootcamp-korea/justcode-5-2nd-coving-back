const searchService = require('../services/search');

const getInstantSearch = async (req, res) => {
  try {
    const { keyword } = req.query;
    const instantSearch = await searchService.getInstantSearch(keyword);
    if (instantSearch.count === 0) {
      return res.sendStatus(204);
    }
    return res.status(200).json(instantSearch);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const getSearchResult = async (req, res) => {
  try {
    const { keyword } = req.query;
    const searchResult = await searchService.getSearchResult(keyword);
    if (searchResult.count === 0) {
      return res.sendStatus(204);
    }
    return res.status(200).json(searchResult);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const getPopularSearch = async (req, res) => {
  try {
    const popularSearch = await searchService.getPopularSearch();
    return res.status(200).json(popularSearch);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const addSearchLog = async (req, res) => {
  try {
    const { id } = req.params;
    await searchService.addSearchLog(id);
    return res.status(201).json({ message: 'searchlog added successfully' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
  getInstantSearch,
  getSearchResult,
  getPopularSearch,
  addSearchLog,
};
