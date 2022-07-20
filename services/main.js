const { readMain, readContentByFilter } = require('../models/main');

async function main(user_id) {
  const main = await readMain(user_id);
  if (!main) {
    const error = new Error('MAIN_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  return main;
}

async function content(genre, sort, channel) {
  const content = await readContentByFilter(genre, sort, channel);
  if (!content) {
    const error = new Error('CONTENT_NOT_FOUND');
    error.StatusCode = 404;
    throw error;
  }
  return content;
}

module.exports = {
  main,
  content,
};
