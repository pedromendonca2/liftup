const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticateToken);

// Listar todos os treinos do usuário
router.get('/', async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        exercises: true,
        _count: {
          select: {
            exercises: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.json(workouts);
  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar treino específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const workout = await prisma.workout.findFirst({
      where: {
        id,
        userId: req.user.id
      },
      include: {
        exercises: true
      }
    });

    if (!workout) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    res.json(workout);
  } catch (error) {
    console.error('Erro ao buscar treino:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo treino
router.post('/', async (req, res) => {
  try {
    const { name, description, date, exercises } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome do treino é obrigatório' });
    }

    const workoutData = {
      name,
      description: description || null,
      date: date ? new Date(date) : new Date(),
      userId: req.user.id
    };

    const workout = await prisma.workout.create({
      data: workoutData,
      include: {
        exercises: true
      }
    });

    res.status(201).json(workout);
  } catch (error) {
    console.error('Erro ao criar treino:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar treino
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, date } = req.body;

    // Verificar se o treino pertence ao usuário
    const existingWorkout = await prisma.workout.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!existingWorkout) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    const updatedWorkout = await prisma.workout.update({
      where: { id },
      data: {
        name: name || existingWorkout.name,
        description: description !== undefined ? description : existingWorkout.description,
        date: date ? new Date(date) : existingWorkout.date
      },
      include: {
        exercises: true
      }
    });

    res.json(updatedWorkout);
  } catch (error) {
    console.error('Erro ao atualizar treino:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar treino
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o treino pertence ao usuário
    const existingWorkout = await prisma.workout.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!existingWorkout) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    // Deletar treino (exercícios serão deletados automaticamente devido ao CASCADE)
    await prisma.workout.delete({
      where: { id }
    });

    res.json({ message: 'Treino deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar treino:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 