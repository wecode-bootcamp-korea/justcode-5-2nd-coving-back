const { readMain, readByGenreFilter } = require('../models/main');

async function main(user) {
  return await readMain(user);
}

async function genre(genreId) {
  return await readByGenreFilter(genreId);
}

module.exports = {
  main,
  genre,
};
