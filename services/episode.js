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

async function updateWatchHistory(episodeId) {
    const episodeInfo = await readWatchHistory(episodeId);
    if (episodeInfo.length === 0) {
      await createWatchHistory(episodeId);
    }
    else{
      await updateWatchHistoryDate(episodeId);
    }
  }

module.exports = { episodeInfo, updateWatchHistory };