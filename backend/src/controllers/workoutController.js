// backend/src/controllers/workoutController.js

const workoutService = require('../services/workoutService');

/**
 * Controller para criar um novo treino.
 */
async function createWorkout(req, res) {
  try {
    // Assume-se que o ID do usuário e o nome do treino vêm no corpo da requisição
    const { name, userId } = req.body;
    const workout = await workoutService.createWorkout({ name, userId });
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * Controller para buscar os treinos de um usuário.
 */
async function getWorkouts(req, res) {
  try {
    const userId = parseInt(req.params.userId, 10);
    const workouts = await workoutService.getWorkoutsByUser(userId);
    res.status(200).json(workouts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  createWorkout,
  getWorkouts,
};