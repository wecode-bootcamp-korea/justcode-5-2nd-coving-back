const { readEpisode, readWatchHistory, createWatchHistory, updateWatchHistoryDate } = require('../models/episode');

async function episodeInfo(episodeId) {
  const episodeInfo = await readEpisode(episodeId);
  if (!episodeInfo) {
    const error = new Error('EPISODE_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  return episodeInfo;
}

async function updateWatchHistory(user_id, episodeId) {
    const episodeInfo = await readEpisode(episodeId);
    if (episodeInfo.length == 0) {
        const error = new Error('EPISODE_NOT_FOUND');
        error.statusCode = 404;
        throw error;
      }
    const episodeWatchHistory = await readWatchHistory(user_id, episodeId);
    if (episodeWatchHistory.length === 0) {
      await createWatchHistory(user_id, episodeId);
    }
    else{
      await updateWatchHistoryDate(user_id, episodeId);
    }
  }

module.exports = { episodeInfo, updateWatchHistory };