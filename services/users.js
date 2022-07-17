const { getUserByEmail, createUser } = require('../models/users');
const { createError } = require('../module/createError');

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

module.exports = { SocialLoginService };
