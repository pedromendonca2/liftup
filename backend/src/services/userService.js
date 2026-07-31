const bcrypt = require('bcrypt');

const prisma = require('../config/prisma');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function createUser(userData) {
  const email = typeof userData.email === 'string' ? userData.email.trim().toLowerCase() : '';
  const password = typeof userData.password === 'string' ? userData.password : '';

  if (!EMAIL_PATTERN.test(email)) {
    throw new Error('Informe um e-mail válido.');
  }

  if (password.length < 8) {
    throw new Error('A senha deve ter pelo menos 8 caracteres.');
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Este e-mail já está em uso.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const { name, age, sex, height, weight } = userData;

  return prisma.user.create({
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
}

module.exports = { createUser };
