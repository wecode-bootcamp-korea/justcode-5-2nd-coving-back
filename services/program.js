const { readProgram } = require('../models/program');

async function programInfo(programId) {
  const programInfo = await readProgram(programId);
  if (!programInfo) {
    const error = new Error('PROGRAM_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  return programInfo;
}

module.exports = { programInfo };