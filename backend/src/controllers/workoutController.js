// backend/src/controllers/workoutController.js

const workoutService = require('../services/workoutService');

/**
 * Controller para criar um novo treino.
 */
async function createWorkout(req, res) {
  try {
    // O ID do usuário vem do token JWT (via authMiddleware)
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado corretamente' });
    }
    
    const { name, description, targetMuscleGroup, exercises } = req.body;
    
    const workout = await workoutService.createWorkout({ 
      name, 
      description, 
      targetMuscleGroup, 
      userId,
      exercises 
    });
    
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * Controller para buscar os treinos do usuário autenticado.
 */
async function getWorkouts(req, res) {
  try {
    const userId = req.user.id; // ID vem do token JWT
    const workouts = await workoutService.getWorkoutsByUser(userId);
    res.status(200).json(workouts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * Controller para atualizar um treino.
 */
async function updateWorkout(req, res) {
  try {
    const userId = req.user.id;
    const workoutId = parseInt(req.params.workoutId, 10);
    const updateData = req.body;
    
    const workout = await workoutService.updateWorkout(workoutId, userId, updateData);
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * Controller para deletar um treino.
 */
async function deleteWorkout(req, res) {
  try {
    const userId = req.user.id;
    const workoutId = parseInt(req.params.workoutId, 10);
    
    await workoutService.deleteWorkout(workoutId, userId);
    res.status(200).json({ message: 'Treino deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  createWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
};