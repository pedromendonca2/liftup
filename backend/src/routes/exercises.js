const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticateToken);

// Listar exercícios de um treino específico
router.get('/workout/:workoutId', async (req, res) => {
  try {
    const { workoutId } = req.params;

    // Verificar se o treino pertence ao usuário
    const workout = await prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId: req.user.id
      }
    });

    if (!workout) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    const exercises = await prisma.exercise.findMany({
      where: {
        workoutId
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json(exercises);
  } catch (error) {
    console.error('Erro ao buscar exercícios:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar exercício específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const exercise = await prisma.exercise.findFirst({
      where: {
        id,
        workout: {
          userId: req.user.id
        }
      },
      include: {
        workout: true
      }
    });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercício não encontrado' });
    }

    res.json(exercise);
  } catch (error) {
    console.error('Erro ao buscar exercício:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo exercício
router.post('/', async (req, res) => {
  try {
    const { name, sets, reps, weight, notes, workoutId } = req.body;

    if (!name || !sets || !reps || !workoutId) {
      return res.status(400).json({ 
        error: 'Nome, séries, repetições e ID do treino são obrigatórios' 
      });
    }

    // Verificar se o treino pertence ao usuário
    const workout = await prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId: req.user.id
      }
    });

    if (!workout) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: weight ? parseFloat(weight) : null,
        notes: notes || null,
        workoutId
      }
    });

    res.status(201).json(exercise);
  } catch (error) {
    console.error('Erro ao criar exercício:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar exercício
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sets, reps, weight, notes } = req.body;

    // Verificar se o exercício pertence a um treino do usuário
    const existingExercise = await prisma.exercise.findFirst({
      where: {
        id,
        workout: {
          userId: req.user.id
        }
      }
    });

    if (!existingExercise) {
      return res.status(404).json({ error: 'Exercício não encontrado' });
    }

    const updatedExercise = await prisma.exercise.update({
      where: { id },
      data: {
        name: name || existingExercise.name,
        sets: sets ? parseInt(sets) : existingExercise.sets,
        reps: reps ? parseInt(reps) : existingExercise.reps,
        weight: weight !== undefined ? (weight ? parseFloat(weight) : null) : existingExercise.weight,
        notes: notes !== undefined ? notes : existingExercise.notes
      }
    });

    res.json(updatedExercise);
  } catch (error) {
    console.error('Erro ao atualizar exercício:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar exercício
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o exercício pertence a um treino do usuário
    const existingExercise = await prisma.exercise.findFirst({
      where: {
        id,
        workout: {
          userId: req.user.id
        }
      }
    });

    if (!existingExercise) {
      return res.status(404).json({ error: 'Exercício não encontrado' });
    }

    await prisma.exercise.delete({
      where: { id }
    });

    res.json({ message: 'Exercício deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar exercício:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 