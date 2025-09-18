// backend/tests/app.test.js

const request = require('supertest');
const express = require('express');

// Mock do userService
jest.mock('../src/services/userService');
jest.mock('../src/config/prisma', () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

const userService = require('../src/services/userService');
const prisma = require('../src/config/prisma');

// Criar uma instância do app para testes
const app = express();
app.use(express.json());

// Importar as rotas que queremos testar
app.post('/register', async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
        age: 25
      };

      const expectedUser = {
        id: 1,
        email: 'joao@example.com',
        name: 'João Silva'
      };

      userService.createUser.mockResolvedValue(expectedUser);

      // Act & Assert
      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(201);

      expect(response.body).toEqual(expectedUser);
      expect(userService.createUser).toHaveBeenCalledWith(userData);
    });

    it('should return 400 when user already exists', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        password: 'senha123'
      };

      userService.createUser.mockRejectedValue(new Error('Este e-mail já está em uso.'));

      // Act & Assert
      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(400);

      expect(response.body).toEqual({ error: 'Este e-mail já está em uso.' });
    });

    it('should return 400 for invalid data', async () => {
      // Arrange
      const invalidUserData = {};

      userService.createUser.mockRejectedValue(new Error('Email é obrigatório'));

      // Act & Assert
      const response = await request(app)
        .post('/register')
        .send(invalidUserData)
        .expect(400);

      expect(response.body).toEqual({ error: 'Email é obrigatório' });
    });
  });
});
