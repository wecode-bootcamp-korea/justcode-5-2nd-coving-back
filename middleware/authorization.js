const axios = require('axios');
const jwt = require('jsonwebtoken');
const { getUserById } = require('../models/users');

const validateToken = async (req, res, next) => {
  try {
    const access_token = req.header('access_token');
    const decoded = jwt.verify(access_token, process.env.SECRET_KEY);
    const userId = decoded.id;
    const foundUser = await getUserById(userId);

    if (!foundUser)
      errorGenerator({ statusCode: 404, message: 'USER_NOT_FOUND' });
    req.userId = userId;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { validateToken };
