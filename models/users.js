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
  const { email } = createUserDTO;

  try {
    await prisma.$queryRaw`
    INSERT INTO
      user (email, password, social_login_id)
    VALUES (${email}, "social", 1)
    `;
  } catch (err) {
    console.log(err);
  }
}

module.exports = { createUser, getUserByEmail };
