const { episodeWatchHistoryList, programLikeList, deleteWatchHistory, deleteLikeHistory } = require('../services/mypage');

async function watchHistoryList(req, res) {
  try {
    // 2
    const user_id = req.user_id;
    const data = await episodeWatchHistoryList(user_id);
    return res.status(201).json({ data }); // 5
  } catch (err) {
    // 2
    console.log(err);
    return res.status(err.statusCode).json({ message: err.message });
  }
}

async function likeList(req,res) {
  try {
    // 2
    const user_id = req.user_id;
    const data = await programLikeList(user_id);
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
        const user_id = req.user_id;
        const episodeId = req.body.id;
        await deleteWatchHistory(user_id, episodeId);
        return res.status(201).json({ message : "WATCHING_HISTORY_DELETED" }); // 5
      } catch (err) {
        // 2
        console.log(err);
        return res.status(err.statusCode).json({ message: err.message });
      }
}

async function likeHistoryController(req, res){
    try{
        const user_id = req.user_id;
        const programId = req.body.id;
        await deleteLikeHistory(user_id, programId);
        return res.status(201).json({ message : "LIKE_HISTORY_DELETED" }); // 5
      } catch (err) {
        // 2
        console.log(err);
        return res.status(err.statusCode).json({ message: err.message });
      }
}


module.exports = { watchHistoryList, likeList, watchHistoryController, likeHistoryController};
