const { episodeInfo, updateWatchHistory } = require('../services/episode');

async function episodeController(req, res) {
  try {
    // 2
    const episodeId = req.params.id;
    const data = await episodeInfo(episodeId);
    return res.status(201).json({ data }); // 5
  } catch (err) {
    // 2
    console.log(err);
    return res.status(err.statusCode).json({ message: err.message });
  }
}

async function watchHistoryController(req, res){
    try {
        // 2
        const episodeId = req.params.id
        await updateWatchHistory(episodeId);
        return res.status(201).json({ message : "WATCHING HISTORY UPDATED" }); // 5
      } catch (err) {
        // 2
        console.log(err);
        return res.status(err.statusCode).json({ message: err.message });
      }
}

module.exports = { episodeController, watchHistoryController };