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
  console.log('SocialLoginService');

  const user = await getUserByEmail(email);

  if (user) {
    // res.status(400).json({ message: "EXISTING USER" });
    const error = new Error('EXISTING USER');
    error.statusCode = 321;
    throw error;
  } else {
    const createUserDto = {
      email,
      // password: encodedService.encode(password), // 추상화하여 암호화 로직을 구조적으로 독립시킴
    };

    console.log('33333');

    await createUser(createUserDto);

    console.log('Good');
  }
}

async function SocialLoginStatusCodeService(status, code, redirectUri) {
  console.log(
    `SocialLoginStatusCodeService + ${status} ${code} ${redirectUri}`
  );
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
  }

  else if(status == 'naver') {
    const url_for_token = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&code=${code}`;
    const access_token = await axios
      .get(url_for_token)
      .then(function (res){
        return res.data.access_token;
      })
      .catch(function (error){
        console.log(error);
      });
    
    const url_for_userInfo = 'https://openapi.naver.com/v1/nid/me';
    const userInfo = await axios
      .get(url_for_userInfo, {
        headers : {
          "Authorization" : `Bearer ${access_token}`
        },
      })
      .then(function (res){
        return res.data;
      })
      .catch(function (error){
        console.log(error);
      });
    console.log(userInfo);
    console.log(userInfo.response.email);
    console.log(userInfo.response.name);
    const email = userInfo.response.email;

    const foundUser = await getUserByEmail(email);
    
    if (!foundUser) {
      const createUserDto = {
        email,
        state: 3,
      };

      const createUserMon = await createUser(createUserDto);
      const token = jwt.sign(
        { id: createUserMon.id },
        process.env.SECRET_KEY,
        {
          expiresIn: '1d',
        }
      );

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

module.exports = { SocialLoginService, SocialLoginStatusCodeService };
