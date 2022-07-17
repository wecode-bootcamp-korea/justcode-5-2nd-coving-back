const searchModel = require('../models/search');

async function getInstantSearch(keyword) {
  const instantSearchList = await searchModel.getInstantSearch(keyword);
  const count = instantSearchList.length;
  const result = { count: count, dataList: instantSearchList };
  return result;
}

async function getSearchResult(keyword) {
  const searchResultList = await searchModel.getSearchResult(keyword);
  const rawResult = await searchModel.getInstantSearch(keyword);
  const count = rawResult.length;

  const newDataList = [];
  searchResultList.forEach(element => {
    newDataList.push(...Object.values(element));
  });

  const result = { count: count, dataList: newDataList };
  return result;
}

async function getPopularSearch() {
  const popularSearch = await searchModel.getPopularSearch();
  popularSearch.forEach(element => {
    delete element.cnt;
  });
  return popularSearch;
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
