// backend/src/api/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar o token JWT de autenticação.
 */
function authMiddleware(req, res, next) {
  // 1. Pega o token do cabeçalho 'Authorization'
  const authHeader = req.headers.authorization;

  // 2. Verifica se o cabeçalho existe
  if (!authHeader) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  // 3. O formato do token é "Bearer <token>". Precisamos separar o token.
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token em formato inválido.' });
  }

  const token = parts[1];

  try {
    // 4. Verifica se o token é válido usando o seu segredo JWT
    // O 'process.env.JWT_SECRET' deve ser uma string segura guardada no seu arquivo .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Se o token for válido, anexa o payload (ex: ID do usuário) à requisição
    req.user = decoded; // Agora req.user.id estará disponível nos controllers

    // 6. Passa para a próxima função (o controller)
    next();
  } catch (error) {
    // 7. Se o token for inválido, retorna um erro
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

module.exports = authMiddleware;