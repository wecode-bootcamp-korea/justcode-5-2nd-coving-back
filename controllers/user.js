const {
  SocialLoginService,
  SocialLoginStatusCodeService,
} = require('../services/users');

async function SocialLoginController(req, res) {
  const { email } = req.body;

  console.log('SocialLoginController');

  try {
    await SocialLoginService(email);
  } catch (err) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // prisma 는 프로미스 객체이기 때문에 await async를 쓰거나 then을 통해서 값을 가져와야됨

  res.status(201).json({ message: 'SocialLogin_Success' });
}

async function SocialLoginStatusCodeController(req, res) {
  // console.log(JSON.stringify(req.body));
  const { state, code, redirectUri } = req.body.req;

  console.log('SocialLoginStatusCodeController');

  let data = null;

  try {
    data = await SocialLoginStatusCodeService(state, code, redirectUri);
  } catch (err) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // prisma 는 프로미스 객체이기 때문에 await async를 쓰거나 then을 통해서 값을 가져와야됨

  res.status(201).json({ data: data });
}

module.exports = { SocialLoginController, SocialLoginStatusCodeController };
