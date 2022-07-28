const { getUserByEmailAndSocial, createUser } = require('../models/users');
const { social_login_id } = require('../models/types');
const program = require('../models/program');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

async function signupService(email, state) {
  const createUserDto = {
    email,
    state: social_login_id[state],
  };

  const createUserMon = await createUser(createUserDto);
  const token = jwt.sign({ id: createUserMon.id }, process.env.SECRET_KEY, {
    expiresIn: '1d',
  });
  const result = {
    message: 'signup',
    user: createUserMon,
    token: token,
  };

  return result;
}

async function loginService(foundUser) {
  const token = jwt.sign({ id: foundUser.id }, process.env.SECRET_KEY, {
    expiresIn: '1d',
  });
  const result = {
    message: 'signin',
    user: foundUser,
    token: token,
  };
  return result;
}

async function signupLoginService(state, email, foundUser) {
  if (!foundUser) {
    return signupService(email, state);
  } else {
    return loginService(foundUser);
  }
}

async function getUserInfoByGoogle(state, code, redirectUri) {
  const url2 = `https://oauth2.googleapis.com/token?code=${code}&client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&redirect_uri=${redirectUri}&grant_type=authorization_code`;
  const access_token = await axios
    .post(url2, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
    .then(el => {
      return el.data.access_token;
    })
    .catch(err => {
      console.log('err=', err);
    });

  if (access_token) {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
      );
      if (data) {
        const foundUser = await getUserByEmailAndSocial(data.email, social_login_id[state]);
        const email = data.email;
        return await signupLoginService(state, email, foundUser);
      }
    } catch (err) {
      const error = new Error('Google Error');
      error.statusCode = 404;
      throw error;
    }
  }
}

async function getUserInfoByNaver(state, code) {
  const url_for_token = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&code=${code}`;
  const access_token = await axios
    .get(url_for_token)
    .then(function (res) {
      return res.data.access_token;
    })
    .catch(function (error) {
      console.log(error);
    });

  const url_for_userInfo = 'https://openapi.naver.com/v1/nid/me';
  const userInfo = await axios
    .get(url_for_userInfo, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    .then(function (res) {
      return res.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  const email = userInfo.response.email;

  const foundUser = await getUserByEmailAndSocial(email, social_login_id[state]);

  return await signupLoginService(state, email, foundUser);
}

async function getUserInfoByKakao(state, code) {
  const access_token = async code => {
    const tokenUrl = `https://kauth.kakao.com/oauth/token`;
    let accessToken;
    try {
      const result = await axios({
        method: 'POST',
        url: tokenUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        params: {
          code,
          grant_type: 'authorization_code',
          client_id: 'ee5a3e8dc70c8a3d8107bdb7d5b9b54d',
          redirect_uri: 'http://localhost:3000/login/callback',
        },
      });
      accessToken = result.data.access_token;
      const userInfo = await getUserInfoByToken(accessToken);
      return userInfo;
    } catch (error) {
      throw error;
    }
  };

  const getUserInfoByToken = async accessToken => {
    let userInfo = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return userInfo;
  };

  const userInfo = await access_token(code);
  const foundUser = await getUserByEmailAndSocial(userInfo.data.kakao_account.email, social_login_id[state]);
  const email = userInfo.data.kakao_account.email;
  return await signupLoginService(state, email, foundUser);
}

async function episodeWatchHistoryList(userId) {
  const watching_history_list = await program.readWatchHistoryByUserId(userId);
  if (!watching_history_list) {
    const error = new Error('HISTORY_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  return watching_history_list;
}

async function programLikeList(userId) {
  const like_list = await program.readLikeByUserId(userId);
  if (!like_list) {
    const error = new Error('LIKE_LIST_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  return like_list;
}

async function deleteWatchHistory(userId, episodeId) {
  for (let i = 0; i < episodeId.length; i++) {
    const watching_history_info = await program.readWatchHistory(
      userId,
      episodeId[i]
    );
    if (watching_history_info.length === 0) {
      const error = new Error('WATCHING_HISTORY_NOT_FOUND');
      error.statusCode = 404;
      throw error;
    } else {
      await program.deleteWatchHistoryById(userId, episodeId[i]);
    }
  }
}

async function deleteLikeHistory(userId, programId) {
  for (let i = 0; i < programId.length; i++) {
    const like_history_info = await program.likeRead(userId, programId[i]);
    if (like_history_info.length === 0) {
      const error = new Error('LIKE_HISTORY_NOT_FOUND');
      error.statusCode = 404;
      throw error;
    } else {
      await program.deleteLikeHistoryById(userId, programId[i]);
    }
  }
}

module.exports = {
  getUserInfoByGoogle,
  getUserInfoByNaver,
  getUserInfoByKakao,
  episodeWatchHistoryList,
  programLikeList,
  deleteWatchHistory,
  deleteLikeHistory,
};
