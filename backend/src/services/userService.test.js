// backend/src/services/userService.test.js

const { createUser } = require('./userService');
const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');

// Mocka os módulos do Prisma e bcrypt para isolar o teste
jest.mock('../config/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));
jest.mock('bcrypt');

describe('createUser', () => {
  beforeEach(() => {
    // Limpa os mocks antes de cada teste para não haver interferência
    jest.clearAllMocks();
  });

  // Teste 1: Caso de sucesso - Criação de um novo usuário
  it('should create a new user successfully with all provided data', async () => {
    // Dados de entrada para o teste
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      age: 30,
      sex: 'male',
      height: 175,
      weight: 70,
    };

    // Configura o mock para simular que o e-mail não existe
    prisma.user.findUnique.mockResolvedValue(null);
    // Configura o mock para simular a criação do usuário
    prisma.user.create.mockResolvedValue({
      id: 'mock-id',
      email: userData.email,
      name: userData.name,
    });
    // Configura o mock para simular o hash da senha
    bcrypt.hash.mockResolvedValue('hashedPassword123');

    // Executa a função a ser testada
    const result = await createUser(userData);

    // Verificações
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: userData.email } });
    expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: userData.email,
        password: 'hashedPassword123',
        name: userData.name,
        age: userData.age,
        sex: userData.sex,
        height: userData.height,
        weight: userData.weight,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    expect(result).toEqual({
      id: 'mock-id',
      email: userData.email,
      name: userData.name,
    });
  });

  // Teste 2: Caso de falha - E-mail já em uso
  it('should throw an error if the email is already in use', async () => {
    // Dados de entrada
    const userData = { email: 'existing@example.com', password: 'password123' };

    // Configura o mock para simular que o e-mail já existe
    prisma.user.findUnique.mockResolvedValue({ id: 'existing-id', email: userData.email });

    // Verificação se a função lança a exceção correta
    await expect(createUser(userData)).rejects.toThrow('Este e-mail já está em uso.');
    // Verifica se a função de criação não foi chamada
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});