// backend/src/services/userService.js

const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');

/**
 * Cria um novo usuário no banco de dados.
 * @param {object} userData - Dados do usuário (name, email, password, age, sex, height, weight).
 * @returns {object} O usuário criado, sem a senha.
 */
async function createUser(userData) {
  const { name, email, password, age, sex, height, weight } = userData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Este e-mail já está em uso.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      ...(name !== undefined ? { name } : {}),
      ...(age !== undefined ? { age } : {}),
      ...(sex !== undefined ? { sex } : {}),
      ...(height !== undefined ? { height } : {}),
      ...(weight !== undefined ? { weight } : {}),
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return user;
}

module.exports = {
  createUser
};