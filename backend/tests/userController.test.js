// backend/tests/userController.test.js

const userController = require('../src/controllers/userController');
const userService = require('../src/services/userService');

// Mock do userService
jest.mock('../src/services/userService');

describe('UserController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      body: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createUser', () => {
    it('should create user successfully and return 201', async () => {
      // Arrange
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123'
      };
      
      const expectedUser = {
        id: 1,
        email: 'joao@example.com',
        name: 'João Silva'
      };

      mockReq.body = userData;
      userService.createUser.mockResolvedValue(expectedUser);

      // Act
      await userController.createUser(mockReq, mockRes);

      // Assert
      expect(userService.createUser).toHaveBeenCalledWith(userData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expectedUser);
    });

    it('should handle service errors and return 400', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        password: 'senha123'
      };
      
      const errorMessage = 'Este e-mail já está em uso.';

      mockReq.body = userData;
      userService.createUser.mockRejectedValue(new Error(errorMessage));

      // Act
      await userController.createUser(mockReq, mockRes);

      // Assert
      expect(userService.createUser).toHaveBeenCalledWith(userData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it('should handle unexpected errors', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'senha123'
      };

      mockReq.body = userData;
      userService.createUser.mockRejectedValue(new Error('Unexpected database error'));

      // Act
      await userController.createUser(mockReq, mockRes);

      // Assert
      expect(userService.createUser).toHaveBeenCalledWith(userData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unexpected database error' });
    });
  });
});
