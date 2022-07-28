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

async function updateWatchHistory(userId, episodeId) {
    const episodeInfo = await readEpisode(episodeId);
    if (episodeInfo.length == 0) {
        const error = new Error('EPISODE_NOT_FOUND');
        error.statusCode = 404;
        throw error;
      }
    await updateWatchHistoryDate(userId, episodeId);
  }

module.exports = { episodeInfo, updateWatchHistory };