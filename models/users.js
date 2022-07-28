const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUserByEmailAndSocial(email, state) {
  try {
    const [user] = await prisma.$queryRaw`
    SELECT
        *
    FROM user
    WHERE email=${email} AND social_login_id=${state}
  `;
    return user;
  } catch (err) {
    console.log(err);
  }
}

async function createUser(createUserDTO) {
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

async function getUserById(userId) {
  return await prisma.$queryRawUnsafe(
    `SELECT * FROM user where id = ${userId}`
  );
}

module.exports = { createUser, getUserByEmailAndSocial, getUserById };
