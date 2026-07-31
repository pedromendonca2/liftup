jest.mock('../src/config/prisma', () => ({
  user: { findUnique: jest.fn() },
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authController = require('../src/controllers/authController');
const prisma = require('../src/config/prisma');

describe('AuthController', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('issues a token for valid credentials', async () => {
    req.body = { email: ' ADA@EXAMPLE.COM ', password: 'senha123' };
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'ada@example.com',
      password: 'hashed-password',
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('signed-token');

    await authController.login(req, res);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'ada@example.com' },
      select: { id: true, email: true, password: true },
    });
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 1, email: 'ada@example.com' },
      'test-secret',
      { expiresIn: '7d' },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: 'signed-token' });
  });

  it('rejects invalid credentials without revealing which field failed', async () => {
    req.body = { email: 'ada@example.com', password: 'wrong-password' };
    prisma.user.findUnique.mockResolvedValue(null);

    await authController.login(req, res);

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Credenciais inválidas.' });
  });

  it('validates the request before querying the database', async () => {
    await authController.login(req, res);

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
