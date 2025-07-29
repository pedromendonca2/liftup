# Documentação da API LiftUp

## Base URL
```
http://localhost:3001/api
```

## Autenticação
A API usa JWT (JSON Web Tokens) para autenticação. Inclua o token no header `Authorization`:
```
Authorization: Bearer <seu_token>
```

## Endpoints

### Autenticação

#### POST /auth/register
Registra um novo usuário.

**Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
```

**Response (201):**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "clx123...",
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login
Faz login do usuário.

**Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": "clx123...",
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET /auth/me
Obtém informações do usuário logado.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user": {
    "id": "clx123...",
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Treinos

#### GET /workouts
Lista todos os treinos do usuário.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
[
  {
    "id": "clx456...",
    "name": "Treino A - Peito e Tríceps",
    "description": "Treino focado em peito e tríceps",
    "date": "2024-01-01T00:00:00.000Z",
    "userId": "clx123...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "exercises": [
      {
        "id": "clx789...",
        "name": "Supino Reto",
        "sets": 4,
        "reps": 12,
        "weight": 60.0,
        "notes": "Foco na técnica",
        "workoutId": "clx456...",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "_count": {
      "exercises": 1
    }
  }
]
```

#### GET /workouts/:id
Obtém um treino específico.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "clx456...",
  "name": "Treino A - Peito e Tríceps",
  "description": "Treino focado em peito e tríceps",
  "date": "2024-01-01T00:00:00.000Z",
  "userId": "clx123...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "exercises": [...]
}
```

#### POST /workouts
Cria um novo treino.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "Novo Treino",
  "description": "Descrição opcional",
  "date": "2024-01-01T00:00:00.000Z"
}
```

**Response (201):**
```json
{
  "id": "clx456...",
  "name": "Novo Treino",
  "description": "Descrição opcional",
  "date": "2024-01-01T00:00:00.000Z",
  "userId": "clx123...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "exercises": []
}
```

#### PUT /workouts/:id
Atualiza um treino.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "Treino Atualizado",
  "description": "Nova descrição"
}
```

#### DELETE /workouts/:id
Deleta um treino.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Treino deletado com sucesso"
}
```

### Exercícios

#### GET /exercises/workout/:workoutId
Lista exercícios de um treino específico.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
[
  {
    "id": "clx789...",
    "name": "Supino Reto",
    "sets": 4,
    "reps": 12,
    "weight": 60.0,
    "notes": "Foco na técnica",
    "workoutId": "clx456...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /exercises/:id
Obtém um exercício específico.

**Headers:** `Authorization: Bearer <token>`

#### POST /exercises
Cria um novo exercício.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "Novo Exercício",
  "sets": 3,
  "reps": 10,
  "weight": 50.0,
  "notes": "Observações opcionais",
  "workoutId": "clx456..."
}
```

#### PUT /exercises/:id
Atualiza um exercício.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "Exercício Atualizado",
  "sets": 4,
  "reps": 12,
  "weight": 55.0
}
```

#### DELETE /exercises/:id
Deleta um exercício.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Exercício deletado com sucesso"
}
```

## Códigos de Erro

- **400**: Bad Request - Dados inválidos
- **401**: Unauthorized - Token inválido ou ausente
- **403**: Forbidden - Acesso negado
- **404**: Not Found - Recurso não encontrado
- **500**: Internal Server Error - Erro interno do servidor

## Exemplos de Uso

### Login e obtenção de token
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@liftup.com", "password": "admin123"}'
```

### Criar treino
```bash
curl -X POST http://localhost:3001/api/workouts \
  -H "Authorization: Bearer <seu_token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Treino de Costas", "description": "Foco em costas"}'
```

### Listar treinos
```bash
curl -X GET http://localhost:3001/api/workouts \
  -H "Authorization: Bearer <seu_token>"
``` 