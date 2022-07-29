const usersService = require('../services/users');

async function googleLoginController(req, res) {
  const { state, code, redirectUri } = req.body.req;
  let data = null;
  try {
    data = await usersService.getUserInfoByGoogle(state, code, redirectUri);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
    return;
  }
  res.status(201).json({ data: data });
}
async function naverLoginController(req, res) {
  const { state, code } = req.body.req;
  let data = null;
  try {
    data = await usersService.getUserInfoByNaver(state, code);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
    return;
  }
  res.status(201).json({ data: data });
}
async function kakaoLoginController(req, res) {
  const { state, code } = req.body.req;
  let data = null;
  try {
    data = await usersService.getUserInfoByKakao(state, code);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
    return;
  }
  res.status(201).json({ data: data });
}
async function watchHistoryList(req, res) {
  try {
    const userId = req.userId;
    const data = await usersService.episodeWatchHistoryList(userId);
    return res.status(201).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function likeList(req, res) {
  try {
    const userId = req.userId;
    const data = await usersService.programLikeList(userId);
    return res.status(201).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function watchHistoryController(req, res) {
  try {
    const userId = req.userId;
    const episodeId = req.body.id;
    await usersService.deleteWatchHistory(userId, episodeId);
    return res.status(201).json({ message: 'WATCHING_HISTORY_DELETED' });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function likeHistoryController(req, res) {
  try {
    const userId = req.userId;
    const programId = req.body.id;
    await usersService.deleteLikeHistory(userId, programId);
    return res.status(201).json({ message: 'LIKE_HISTORY_DELETED' });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

// async function profileController(req, res) {
//   try {
//     const userId = req.userId;
//     const nickname = req.body.nickname;

//     await usersService.updateNickname(userId, nickname);
//     return res.status(201).json({ message: 'LIKE_HISTORY_DELETED' });
//   } catch (err) {
//     console.log(err);
//     return res.status(err.statusCode || 500).json({ message: err.message });
//   }
// }

module.exports = {
  googleLoginController,
  naverLoginController,
  kakaoLoginController,
  watchHistoryList,
  likeList,
  watchHistoryController,
  likeHistoryController,
  // profileController,
};
