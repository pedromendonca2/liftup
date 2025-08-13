// backend/src/services/workoutService.js

const prisma = require('../config/prisma');

/**
 * Cria um novo treino para um usuário específico.
 * @param {object} workoutData - Dados do treino (name, userId).
 * @returns {object} O treino criado.
 */
async function createWorkout(workoutData) {
  const { name, userId } = workoutData;

  const workout = await prisma.workout.create({
    data: {
      name,
      userId, // Associa o treino ao ID do usuário
    },
  });

  return workout;
}

/**
 * Busca todos os treinos de um usuário.
 * @param {number} userId - O ID do usuário.
 * @returns {Array} Uma lista de treinos.
 */
async function getWorkoutsByUser(userId) {
  const workouts = await prisma.workout.findMany({
    where: {
      userId: userId,
    },
  });
  return workouts;
}

module.exports = {
  createWorkout,
  getWorkoutsByUser,
};