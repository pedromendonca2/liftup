const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = require('../config/prisma');
const { requireEnv } = require('../config/env');

async function login(req, res) {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      requireEnv('JWT_SECRET'),
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Falha ao autenticar usuário:', error);
    return res.status(500).json({ message: 'Não foi possível autenticar.' });
  }
}

module.exports = { login };
