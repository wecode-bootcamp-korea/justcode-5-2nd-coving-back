const searchModel = require('../models/search');

async function getInstantSearch(keyword) {
  const instantSearchList = await searchModel.getInstantSearch(keyword);
  const count = instantSearchList.length;
  const result = { count: count, dataList: instantSearchList };
  return result;
}

async function getSearchResult(keyword) {
  return await searchModel.getSearchResult(keyword);
}

async function getPopularSearch() {
  return await searchModel.getPopularSearch();
}

async function addSearchLog(id) {
  return await searchModel.addSearchLog(id);
}

module.exports = {
  getInstantSearch,
  getSearchResult,
  getPopularSearch,
  addSearchLog,
};
