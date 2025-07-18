const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

beforeAll(async () => {
  // Limpar banco de dados de teste
  await prisma.exercise.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(async () => {
  // Limpar dados após cada teste
  await prisma.exercise.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.user.deleteMany();
}); 