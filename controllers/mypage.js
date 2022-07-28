const { episodeWatchHistoryList, programLikeList, deleteWatchHistory, deleteLikeHistory } = require('../services/mypage');

async function watchHistoryList(req, res) {
  try {
    const userId = req.userId;
    const data = await episodeWatchHistoryList(userId);
    return res.status(201).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function likeList(req,res) {
  try {
    const userId = req.userId;
    const data = await programLikeList(userId);
    return res.status(201).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function watchHistoryController(req, res){
    try {
        const userId = req.userId;
        const episodeId = req.body.id;
        await deleteWatchHistory(userId, episodeId);
        return res.status(201).json({ message : "WATCHING_HISTORY_DELETED" });
      } catch (err) {
        console.log(err);
        return res.status(err.statusCode || 500).json({ message: err.message });
      }
}

async function likeHistoryController(req, res){
    try{
        const userId = req.userId;
        const programId = req.body.id;
        await deleteLikeHistory(userId, programId);
        return res.status(201).json({ message : "LIKE_HISTORY_DELETED" });
      } catch (err) {
        console.log(err);
        return res.status(err.statusCode || 500).json({ message: err.message });
      }
}


module.exports = { watchHistoryList, likeList, watchHistoryController, likeHistoryController};
