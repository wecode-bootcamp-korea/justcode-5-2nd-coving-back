const { readProgram, likeDelete, likeRead, likeCreate } = require('../models/program');

async function programInfo(user_id, programId) {
  const programInfo = await readProgram(user_id, programId);
  if (!programInfo) {
    const error = new Error('PROGRAM_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  return programInfo;
}

async function programLike(user_id, programId){
  const isLiked = await likeRead(user_id, programId);
  if(isLiked.length == 0){
    await likeCreate(user_id, programId);
    return {isLiked : true};
  }
  else{
    await likeDelete(user_id, programId);
    return {isLiked : false};
  }
}

module.exports = { programInfo, programLike };