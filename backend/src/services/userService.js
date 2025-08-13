// backend/src/services/userService.js

const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

/**
 * Cria um novo usuário no banco de dados.
 * @param {object} userData - Dados do usuário (name, email, password).
 * @returns {object} O usuário criado, sem a senha.
 */
async function createUser(userData) {
  const { name, email, password, age, gender, height, weight } = userData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Este e-mail já está em uso.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return user;
}