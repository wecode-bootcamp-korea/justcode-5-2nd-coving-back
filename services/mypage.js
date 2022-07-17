const { readWatchHistoryByUserId, deleteWatchHistoryById, readWatchHistory } = require('../models/episode');
const { readLikeByUserId, likeRead, deleteLikeHistoryById } = require('../models/program');

async function episodeWatchHistoryList() {
  const watching_history_list = await readWatchHistoryByUserId();
  if (!watching_history_list) {
    const error = new Error('HISTORY_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  return watching_history_list;
}

async function programLikeList() {
    const like_list = await readLikeByUserId();
    if (!like_list) {
      const error = new Error('LIKE_LIST_NOT_FOUND');
      error.statusCode = 404;
      throw error;
    }
    return like_list;
  }

async function deleteWatchHistory(episodeId) {
    for(let i=0; i<episodeId.length; i++){
        const watching_history_info = await readWatchHistory(episodeId[i]);
        if(watching_history_info.length === 0){
            const error = new Error('WATCHING_HISTORY_NOT_FOUND');
            error.statusCode = 404;
            throw error;
        }
        else{
            await deleteWatchHistoryById(episodeId[i]);
        }
    }
}

async function deleteLikeHistory(programId) {
    for(let i=0; i<programId.length; i++){
        const like_history_info = await likeRead(programId[i]);
        if(like_history_info.length === 0){
            const error = new Error('LIKE_HISTORY_NOT_FOUND');
            error.statusCode = 404;
            throw error;
        }
        else{
            await deleteLikeHistoryById(programId[i]);
        }
    }
}

module.exports = { episodeWatchHistoryList, programLikeList, deleteWatchHistory, deleteLikeHistory };