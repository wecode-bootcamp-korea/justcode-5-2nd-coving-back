const { readMain } = require('../models/main');

async function main(user) {
  return await readMain(user);
}

module.exports = {
  main,
};
