// backend/src/api/routes/workoutRoutes.js

const express = require('express');
const router = express.Router();
const workoutController = require('../../controllers/workoutController');

// Rota: POST /api/workouts/
router.post('/', workoutController.createWorkout);

// Rota: GET /api/workouts/user/:userId
router.get('/user/:userId', workoutController.getWorkouts);

module.exports = router;