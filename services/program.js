const { readProgram, likeDelete, likeRead, likeCreate, getSimilarProgram, getWithProgram } = require('../models/program');

async function programInfo(userId, programId) {
  const { isLiked, latest_watching_episode, programInfo } = await readProgram(userId, programId);
  const similar_program_list = await getSimilarProgram(programId);
  const with_program_list = await getWithProgram(programId);
  if (!programInfo) {
    const error = new Error('PROGRAM_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  return { isLiked, latest_watching_episode, programInfo, similar_program_list, with_program_list };
}

async function programLike(userId, programId){
  const {programInfo} = await readProgram(userId, programId);
  if (!programInfo) {
    const error = new Error('PROGRAM_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  const isLiked = await likeRead(userId, programId);
  console.log(isLiked);
  if(isLiked.length == 0){
    await likeCreate(userId, programId);
    console.log("create");
    return {isLiked : true};
  }
  else{
    await likeDelete(userId, programId);
    console.log("delete");
    return {isLiked : false};
  }
}

module.exports = { programInfo, programLike };