const { readProgram, likeDelete, likeRead, likeCreate } = require('../models/program');

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
  if(isLiked.length == 0){
    await likeCreate(programId);
    return {isLiked : true};
  }
  else{
    await likeDelete(programId);
    return {isLiked : false};
  }
}

module.exports = { programInfo, programLike };