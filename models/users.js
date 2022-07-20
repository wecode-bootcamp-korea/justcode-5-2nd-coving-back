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
  const { email, state } = createUserDTO;

  let createUserMon = null;

  try {
    await prisma.$queryRaw`
    INSERT INTO
      user (email, password, social_login_id)
    VALUES (${email}, "social", ${state})
    `;
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

async function getUserIdByEmail(email) {
  return await prisma.$queryRawUnsafe(
    `select id from user where email = '${email}'`
  );
}

module.exports = { createUser, getUserByEmail, getUserIdByEmail };
