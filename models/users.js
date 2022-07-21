const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUserByEmail(email) {
  // hello world!
  console.log('getUserByEmail');
  try {
    const [user] = await prisma.$queryRaw`
    SELECT
        *
    FROM user
    WHERE email=${email}
  `;
    return user;
  } catch (err) {
    console.log(err);
  }
}

async function createUser(createUserDTO) {
  console.log('createUser');
  const { email, state, nickname, profileImage } = createUserDTO;

  let createUserMon = null;

  try {
    if (state == 1) {
      await prisma.$queryRaw`
    INSERT INTO
      user (email, password, social_login_id)
    VALUES (${email}, "social", ${state})
    `;
    }
    if (state == (2 || 3)) {
      await prisma.$queryRaw`
      INSERT INTO
        user (email, password, social_login_id, nickname, profile_img_url)
      VALUES (${email}, "social", ${state}, ${nickname}, ${profileImage} )
      `;
    }
    try {
      const [user] = await prisma.$queryRaw`
      SELECT
          *
      FROM user
      WHERE email=${email}
    `;
      return user;
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
  return null;
}

async function getUserById(user_id) {
  return await prisma.$queryRawUnsafe(
    `select * from user where id = ${user_id}`
  );
}

module.exports = { createUser, getUserByEmail, getUserById };
