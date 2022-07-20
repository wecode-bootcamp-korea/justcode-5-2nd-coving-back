const axios = require('axios');
const { getUserIdByEmail } = require('../models/users');

const validateToken = async (req, res, next) => {
  try {
    const access_token = req.header('access_token');
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
    );
    const foundUser = await getUserIdByEmail(data.email);

    if (!foundUser)
      errorGenerator({ statusCode: 404, message: 'USER_NOT_FOUND' });

    req.user_id = foundUser[0].id;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { validateToken };
