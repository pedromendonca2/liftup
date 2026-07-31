const jwt = require('jsonwebtoken');

const { requireEnv } = require('../../config/env');

function authMiddleware(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Informe um token no formato Bearer.' });
  }

  try {
    req.user = jwt.verify(token, requireEnv('JWT_SECRET'));
    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

module.exports = authMiddleware;
