const { readWatchHistoryByUserId, deleteWatchHistoryById, readWatchHistory } = require('../models/episode');
const { readLikeByUserId, likeRead, deleteLikeHistoryById } = require('../models/program');

async function episodeWatchHistoryList(user_id) {
  const watching_history_list = await readWatchHistoryByUserId(user_id);
  if (!watching_history_list) {
    const error = new Error('HISTORY_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  return watching_history_list;
}

async function programLikeList(user_id) {
    const like_list = await readLikeByUserId(user_id);
    if (!like_list) {
      const error = new Error('LIKE_LIST_NOT_FOUND');
      error.statusCode = 404;
      throw error;
    }
    return like_list;
  }

async function deleteWatchHistory(user_id, episodeId) {
    for(let i=0; i<episodeId.length; i++){
        const watching_history_info = await readWatchHistory(user_id, episodeId[i]);
        if(watching_history_info.length === 0){
            const error = new Error('WATCHING_HISTORY_NOT_FOUND');
            error.statusCode = 404;
            throw error;
        }
        else{
            await deleteWatchHistoryById(user_id, episodeId[i]);
        }
    }
}

async function deleteLikeHistory(user_id, programId) {
    for(let i=0; i<programId.length; i++){
        const like_history_info = await likeRead(user_id, programId[i]);
        if(like_history_info.length === 0){
            const error = new Error('LIKE_HISTORY_NOT_FOUND');
            error.statusCode = 404;
            throw error;
        }
        else{
            await deleteLikeHistoryById(user_id, programId[i]);
        }
    }
}

module.exports = { episodeWatchHistoryList, programLikeList, deleteWatchHistory, deleteLikeHistory };