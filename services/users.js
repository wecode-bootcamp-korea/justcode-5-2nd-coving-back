const { getUserByEmail, createUser } = require('../models/users');
const { createError } = require('../module/createError');
const { getUserIdByEmail } = require('../models/users');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const {
  SOCIAL_REDIRECT_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
} = require('../constants/SocialLogin');

async function SocialLoginService(email) {
  const user = await getUserByEmail(email);
  if (user) {
    const error = new Error('EXISTING USER');
    error.statusCode = 321;
    throw error;
  } else {
    const createUserDto = {
      email,
    };
    await createUser(createUserDto);
  }
}

async function SocialLoginStatusCodeService(status, code, redirectUri) {
  if (status == 'google') {
    console.log('구글 로그인');

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
    console.log(access_token);

    if (access_token) {
      try {
        const { data } = await axios.get(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
        );
        if (data) {
          const foundUser = await getUserByEmail(data.email);
          const email = data.email;

          if (!foundUser) {
            const createUserDto = {
              email,
              state: 1, // 구글 로그인
            };

            const createUserMon = await createUser(createUserDto);
            const token = jwt.sign(
              { id: createUserMon.id },
              process.env.SECRET_KEY,
              {
                expiresIn: '1d',
              }
            );

            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log('decoded', decoded);
            // 회원가입
            const result = {
              message: 'signup',
              user: createUserMon,
              token: token,
            };

            console.log(result);
            return result;
          } else {
            // 로그인
            const token = jwt.sign(
              { id: foundUser.id },
              process.env.SECRET_KEY,
              {
                expiresIn: '1d',
              }
            );

            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log('decoded', decoded);
            const result = {
              message: 'signin',
              user: foundUser,
              token: token,
            };
            console.log(result);
            return result;
            // 로그인 완료 및 회원 발급
          }
        }
      } catch (err) {
        const error = new Error('Google Error');
        error.statusCode = 404;
        throw error;
      }
    }
  } else if (status == 'naver') {
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
    console.log(userInfo);
    console.log(userInfo.response.email);
    console.log(userInfo.response.name);
    const email = userInfo.response.email;
    const nickname = userInfo.response.nickname;
    const profileImage = userInfo.response.profile_image;
    const foundUser = await getUserByEmail(email);

    if (!foundUser) {
      const createUserDto = {
        email,
        state: 3,
        nickname,
        profileImage,
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

      console.log(result);
      return result;
    } else {
      // 로그인
      const token = jwt.sign({ id: foundUser.id }, process.env.SECRET_KEY, {
        expiresIn: '1d',
      });
      const result = {
        message: 'signin',
        user: foundUser,
        token: token,
      };
      console.log(result);
      return result;
      // 로그인 완료 및 회원 발급
    }
  } else if (status == 'kakao') {
    console.log('카카오 로그인', status, code, redirectUri);
    const access_token = async code => {
      const tokenUrl = `https://kauth.kakao.com/oauth/token`;
      console.log(tokenUrl);
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
        console.log('카카오 액세스 토큰은', result.data.access_token);
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

    console.log(userInfo);

    if (userInfo) {
      const foundUser = await getUserByEmail(userInfo.data.kakao_account.email);
      const email = userInfo.data.kakao_account.email;
      const nickname = userInfo.data.properties.nickname;
      const profileImage =
        userInfo.data.kakao_account.profile.profile_image_url;
      // const id = userInfo.data.id;

      if (!foundUser) {
        const createUserDto = {
          email,
          state: 2, // 카카오 로그인
          nickname,
          profileImage,
        };

        const createUserMon = await createUser(createUserDto);
        const token = jwt.sign(
          { id: createUserMon.id },
          process.env.SECRET_KEY,
          {
            expiresIn: '1d',
          }
        );

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log('decoded', decoded);
        // 회원가입
        const result = {
          message: 'signup',
          user: createUserMon,
          token: token,
        };

        console.log(result);
        return result;
      } else {
        // 로그인
        const token = jwt.sign({ id: foundUser.id }, process.env.SECRET_KEY, {
          expiresIn: '1d',
        });

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log('decoded', decoded);
        const result = {
          message: 'signin',
          user: foundUser,
          token: token,
        };
        console.log(result);
        return result;
        // 로그인 완료 및 회원 발급
      }
    }
  }
}

module.exports = { SocialLoginService, SocialLoginStatusCodeService };
