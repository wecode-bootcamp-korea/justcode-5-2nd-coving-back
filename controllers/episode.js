const { episodeInfo, updateWatchHistory } = require('../services/episode');

async function episodeController(req, res) {
  try {
    const episodeId = req.params.id;
    const userId = req.userId;
    const data = await episodeInfo(episodeId);
    await updateWatchHistory(userId, episodeId);
    return res.status(201).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

module.exports = { episodeController };