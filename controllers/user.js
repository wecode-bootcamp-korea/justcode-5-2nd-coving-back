const usersService = require('../services/users');

async function SocialLoginController(req, res) {
  const { email } = req.body;

  // console.log('SocialLoginController');

  try {
    await usersService.SocialLoginService(email);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
    return;
  }

  // prisma 는 프로미스 객체이기 때문에 await async를 쓰거나 then을 통해서 값을 가져와야됨

  res.status(201).json({ message: 'SocialLogin_Success' });
}

async function googleLoginController(req, res) {
  // console.log(JSON.stringify(req.body));
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
  // console.log(JSON.stringify(req.body));
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
  // console.log(JSON.stringify(req.body));
  const { state, code } = req.body.req;
  let data = null;
  try {
    data = await usersService.getUserInfoByKakao(state, code);
    console.log(data, 'dkfajdlkfasj;ladfs');
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
  SocialLoginController,
  googleLoginController,
  naverLoginController,
  kakaoLoginController,
  watchHistoryList,
  likeList,
  watchHistoryController,
  likeHistoryController,
  // profileController,
};
