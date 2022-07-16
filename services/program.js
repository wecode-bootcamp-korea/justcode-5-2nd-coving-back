const { readProgram, likeUpdate, likeRead, likeCreate } = require('../models/program');

async function programInfo(programId) {
  const programInfo = await readProgram(programId);
  if (!programInfo) {
    const error = new Error('PROGRAM_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  return programInfo;
}

async function programLike(programId){
  const isLiked = await likeRead(programId);
  console.log(isLiked);
  if(isLiked.length == 0){
    await likeCreate(programId);
  }
  else{
    await likeUpdate(programId);
  }
}

module.exports = { programInfo, programLike };