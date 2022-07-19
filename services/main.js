const { readMain, readContentByFilter } = require('../models/main');

async function main(user) {
  return await readMain(user);
}

async function content(genre, sort, channel) {
  return await readContentByFilter(genre, sort, channel);
}

module.exports = {
  main,
  content
};
