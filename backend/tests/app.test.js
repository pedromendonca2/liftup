const request = require('supertest');

jest.mock('../src/services/userService');

const app = require('../app');
const userService = require('../src/services/userService');

describe('LiftUp API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reports service health', async () => {
    const response = await request(app).get('/health').expect(200);

    expect(response.body).toEqual({ status: 'ok', service: 'liftup-api' });
  });

  it('registers a user through the real route stack', async () => {
    const userData = {
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'senha123',
    };
    const createdUser = { id: 1, email: userData.email, name: userData.name };
    userService.createUser.mockResolvedValue(createdUser);

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body).toEqual(createdUser);
    expect(userService.createUser).toHaveBeenCalledWith(userData);
  });

  it('returns the service error when registration fails', async () => {
    userService.createUser.mockRejectedValue(new Error('Este e-mail já está em uso.'));

    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'existing@example.com', password: 'senha123' })
      .expect(400);

    expect(response.body).toEqual({ message: 'Este e-mail já está em uso.' });
  });

  it('returns a JSON response for unknown routes', async () => {
    const response = await request(app).get('/unknown').expect(404);

    expect(response.body).toEqual({ message: 'Rota não encontrada.' });
  });
});
