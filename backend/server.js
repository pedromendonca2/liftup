require('dotenv').config();

const app = require('./app');
const prisma = require('./src/config/prisma');

const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`LiftUp API disponível na porta ${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} recebido; encerrando a API.`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
