docker ps -a
docker logs postgres-liftup
docker start postgres-liftup
node server.js

curl -X POST http://172.23.186.132:3000/register   -H "Content-Type: application/json"   -d '{"email": "teste@teste.com", "password": "123456"}'

curl -X POST http://172.23.186.132:3000/login  -H "Content-Type: application/json"   -d '{"email": "teste@teste.com", "password": "123456"}'

curl -X POST http://172.23.186.132:3000/login -H "Content-Type: application/json" -d "{\"email\": \"teste@teste.com\", \"password\": \"123456\"}"


sudo lsof -i :5432

# Para iniciar o ambiente de desenvolvimento, execute o seguinte comando na raiz do projeto:
Estamos rodando o backend e o banco de dados PostgreSQL em conteineres Docker.
```bash
docker compose up --build
```

# Para acessar o Prisma Studio, execute o seguinte comando:
```bash
docker compose exec backend npx prisma studio
```

# Para sincronizar o esquema do banco de dados com o Prisma, execute:
```bash
docker compose exec backend npx prisma db push
```

# Para parar e remover os contêineres sem apagar o banco de dados, execute:
```bash
docker compose down
```