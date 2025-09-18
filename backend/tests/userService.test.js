// backend/tests/userService.test.js

const userService = require('../src/services/userService');
const bcrypt = require('bcrypt');

// Mock do Prisma
jest.mock('../src/config/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock do bcrypt
jest.mock('bcrypt');

const prisma = require('../src/config/prisma');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const mockUserData = {
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'senha123',
      age: 25,
      sex: 'M',
      height: 180,
      weight: 75,
    };

    it('should create a new user successfully', async () => {
      // Arrange
      prisma.user.findUnique.mockResolvedValue(null); // Usuário não existe
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      
      const expectedUser = {
        id: 1,
        email: 'joao@example.com',
        name: 'João Silva',
      };
      
      prisma.user.create.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.createUser(mockUserData);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'joao@example.com' }
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'joao@example.com',
          password: 'hashedPassword123',
          name: 'João Silva',
          age: 25,
          sex: 'M',
          height: 180,
          weight: 75,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
      expect(result).toEqual(expectedUser);
    });

    it('should throw error if user already exists', async () => {
      // Arrange
      prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'joao@example.com' });

      // Act & Assert
      await expect(userService.createUser(mockUserData)).rejects.toThrow('Este e-mail já está em uso.');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should handle optional fields correctly', async () => {
      // Arrange
      const minimalUserData = {
        email: 'minimal@example.com',
        password: 'senha123',
      };

      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      
      const expectedUser = {
        id: 2,
        email: 'minimal@example.com',
        name: null,
      };
      
      prisma.user.create.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.createUser(minimalUserData);

      // Assert
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'minimal@example.com',
          password: 'hashedPassword123',
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
      expect(result).toEqual(expectedUser);
    });

    it('should handle database errors', async () => {
      // Arrange
      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      prisma.user.create.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(userService.createUser(mockUserData)).rejects.toThrow('Database connection failed');
    });
  });
});
