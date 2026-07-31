jest.mock('../config/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));
jest.mock('bcrypt');

const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const { createUser } = require('./userService');

describe('createUser validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('normalizes e-mail before querying and saving', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed-password');
    prisma.user.create.mockResolvedValue({ id: 1, email: 'ada@example.com', name: 'Ada' });

    await createUser({
      name: 'Ada',
      email: ' ADA@EXAMPLE.COM ',
      password: 'password123',
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'ada@example.com' },
    });
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ email: 'ada@example.com' }),
      }),
    );
  });

  it.each([
    [{ email: 'invalid', password: 'password123' }, 'Informe um e-mail válido.'],
    [{ email: 'ada@example.com', password: 'short' }, 'A senha deve ter pelo menos 8 caracteres.'],
  ])('rejects invalid input before accessing Prisma', async (input, message) => {
    await expect(createUser(input)).rejects.toThrow(message);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });
});
