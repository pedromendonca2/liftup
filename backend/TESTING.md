# Guia de Testes - Backend LiftUp

## 📋 Visão Geral

Este projeto utiliza **Jest** como framework de testes para garantir a qualidade e confiabilidade do código backend.

## 🚀 Como Executar os Testes

### Comandos Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (re-executa quando arquivos mudam)
npm run test:watch

# Executar testes com cobertura de código
npm run test:coverage
```

## 📁 Estrutura dos Testes

```
backend/
├── tests/
│   ├── basic.test.js           # Testes básicos do Jest
│   ├── userController.test.js  # Testes do controller de usuários
│   ├── userService.test.js     # Testes do service de usuários
│   └── app.test.js            # Testes de integração da API
├── src/
│   └── services/
│       └── userService.test.js # Teste co-localizado (exemplo)
└── package.json
```

## 📊 Resultados dos Testes

### ✅ Status Atual
- **Test Suites**: 5 passed, 5 total
- **Tests**: 18 passed, 18 total
- **Cobertura**: 100% nos módulos testados (userController e userService)

### 📈 Cobertura de Código
- **userController.js**: 100% de cobertura
- **userService.js**: 100% de cobertura
- **config/prisma.js**: 100% de cobertura

## 🧪 Tipos de Testes Implementados

### 1. Testes Unitários
- **userService.test.js**: Testa a lógica de criação de usuários
- **userController.test.js**: Testa os controllers da API

### 2. Testes de Integração
- **app.test.js**: Testa as rotas da API usando supertest

### 3. Testes Básicos
- **basic.test.js**: Demonstra funcionalidades básicas do Jest

## 🔧 Configuração do Jest

O Jest está configurado no `package.json` com:

```json
{
  "jest": {
    "testEnvironment": "node",
    "roots": ["<rootDir>/src", "<rootDir>/tests"],
    "testMatch": [
      "**/__tests__/**/*.js",
      "**/?(*.)+(spec|test).js"
    ],
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/**/*.test.js"
    ]
  }
}
```

## 📦 Dependências de Teste

- **jest**: Framework de testes principal
- **supertest**: Para testes de integração HTTP
- **Mocks**: Prisma e bcrypt são mockados nos testes

## 🎯 Exemplos de Testes

### Teste Unitário (userService)
```javascript
it('should create a new user successfully', async () => {
  // Arrange
  prisma.user.findUnique.mockResolvedValue(null);
  bcrypt.hash.mockResolvedValue('hashedPassword123');
  
  // Act
  const result = await userService.createUser(mockUserData);
  
  // Assert
  expect(result).toEqual(expectedUser);
});
```

### Teste de Integração (API)
```javascript
it('should register a new user successfully', async () => {
  const response = await request(app)
    .post('/register')
    .send(userData)
    .expect(201);
    
  expect(response.body).toEqual(expectedUser);
});
```

## 🔄 Boas Práticas

1. **Isolamento**: Cada teste é independente
2. **Mocking**: Dependências externas são mockadas
3. **Nomenclatura**: Testes descrevem claramente o comportamento esperado
4. **Arrange-Act-Assert**: Estrutura clara dos testes
5. **Cobertura**: Buscar 100% de cobertura em funções críticas

## 🚀 Próximos Passos

Para expandir os testes, considere:

- Adicionar testes para `workoutController` e `workoutService`
- Implementar testes para middleware de autenticação
- Adicionar testes end-to-end
- Configurar testes de performance
- Integrar com CI/CD pipeline
