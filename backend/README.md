# LiftUp API

API complementar do LiftUp, construída com Express, Prisma e PostgreSQL. Ela expõe autenticação JWT e operações de treino para uma futura sincronização entre dispositivos; o aplicativo mobile continua funcional offline sem este serviço.

## Executar com Docker

```bash
cp .env.example .env
docker compose up --build -d
docker compose exec backend npx prisma db push
curl http://localhost:3000/health
```

O Compose aguarda o PostgreSQL ficar saudável antes de iniciar a API. Para acompanhar os logs, use `docker compose logs -f backend`; para encerrar sem apagar o volume, `docker compose down`.

## Executar localmente

Use Node.js 20 ou superior e um PostgreSQL acessível pela `DATABASE_URL`:

```bash
cp .env.example .env
npm ci
npx prisma generate
npx prisma db push
npm run dev
```

Ao executar fora do Docker, ajuste o host de `DATABASE_URL` de `db` para `localhost`.

## Autenticação

Crie um usuário:

```bash
curl --request POST http://localhost:3000/api/auth/register \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "password": "uma-senha-segura",
    "age": 30,
    "height": 1.68,
    "weight": 65.5
  }'
```

Obtenha o token:

```bash
curl --request POST http://localhost:3000/api/auth/login \
  --header 'Content-Type: application/json' \
  --data '{"email":"ada@example.com","password":"uma-senha-segura"}'
```

Envie o valor retornado nas rotas protegidas com `Authorization: Bearer <token>`.

## Treinos

Exemplo de criação:

```bash
curl --request POST http://localhost:3000/api/workouts \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer SEU_TOKEN' \
  --data '{
    "name": "Push",
    "targetMuscleGroup": "Peito e ombros",
    "exercises": [
      {"name":"Supino reto","reps":10,"peso":40},
      {"name":"Desenvolvimento","reps":12,"peso":16}
    ]
  }'
```

As rotas `GET /api/workouts`, `PUT /api/workouts/:id` e `DELETE /api/workouts/:id` também exigem token. Um usuário só pode consultar ou alterar os próprios treinos.

## Qualidade

```bash
npm test
npm run test:coverage
```

Relatórios de cobertura e o Prisma Client são gerados localmente e não devem ser versionados.
