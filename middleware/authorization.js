const axios = require('axios');
const jwt = require('jsonwebtoken');
const { getUserById } = require('../models/users');

const validateToken = async (req, res, next) => {
  try {
    const access_token = req.header('access_token');
    const decoded = jwt.verify(access_token, process.env.SECRET_KEY);
    const user_id = decoded.id;
    const foundUser = await getUserById(user_id);

    if (!foundUser)
      errorGenerator({ statusCode: 404, message: 'USER_NOT_FOUND' });
    req.user_id = user_id;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { validateToken };
