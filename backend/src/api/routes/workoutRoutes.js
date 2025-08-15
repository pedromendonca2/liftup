// backend/src/api/routes/workoutRoutes.js

const express = require('express');
const router = express.Router();
const workoutController = require('../../controllers/workoutController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota: POST /api/workouts/ (protegida por autenticação)
router.post('/', authMiddleware, workoutController.createWorkout);

// Rota: GET /api/workouts/ (protegida por autenticação)
router.get('/', authMiddleware, workoutController.getWorkouts);

// Rota: PUT /api/workouts/:workoutId (protegida por autenticação)
router.put('/:workoutId', authMiddleware, workoutController.updateWorkout);

// Rota: DELETE /api/workouts/:workoutId (protegida por autenticação)
router.delete('/:workoutId', authMiddleware, workoutController.deleteWorkout);

module.exports = router;