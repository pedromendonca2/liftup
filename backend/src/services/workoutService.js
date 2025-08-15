// backend/src/services/workoutService.js

const prisma = require('../config/prisma');

/**
 * Cria um novo treino para um usuário específico.
 * @param {object} workoutData - Dados do treino completo.
 * @returns {object} O treino criado com exercícios.
 */
async function createWorkout(workoutData) {
  const { name, description, targetMuscleGroup, userId, exercises } = workoutData;

  // Criar o treino principal
  const workout = await prisma.workout.create({
    data: {
      name,
      description,
      targetMuscleGroup,
      userId,
    },
  });

  // Se há exercícios, criar os registros na tabela de junção
  if (exercises && exercises.length > 0) {
    for (const exercise of exercises) {
      // Primeiro, criar/encontrar o exercício se não existir
      let exerciseRecord = await prisma.exercise.findUnique({
        where: { name: exercise.name }
      });

      if (!exerciseRecord) {
        exerciseRecord = await prisma.exercise.create({
          data: {
            name: exercise.name,
            targetMuscle: exercise.targetMuscle || null
          }
        });
      }

      // Criar a relação workout-exercise
      await prisma.workoutExercise.create({
        data: {
          workoutId: workout.id,
          exerciseId: exerciseRecord.id,
          reps: exercise.reps || 12,
          loadKg: exercise.peso || 0,
          isCompleted: false
        }
      });
    }
  }

  // Retornar o treino completo com exercícios
  return await getWorkoutWithExercises(workout.id);
}

/**
 * Busca todos os treinos de um usuário com exercícios.
 */
async function getWorkoutsByUser(userId) {
  const workouts = await prisma.workout.findMany({
    where: {
      userId: userId,
    },
    include: {
      exercises: {
        include: {
          exercise: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Transformar o formato para compatibilidade com frontend
  return workouts.map(workout => ({
    ...workout,
    exercicios: workout.exercises.map(we => ({
      id: we.exercise.id,
      nome: we.exercise.name,
      peso: we.loadKg,
      reps: we.reps,
      targetMuscle: we.exercise.targetMuscle,
      isCompleted: we.isCompleted
    }))
  }));
}

/**
 * Busca um treino específico com exercícios.
 */
async function getWorkoutWithExercises(workoutId) {
  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
    include: {
      exercises: {
        include: {
          exercise: true
        }
      }
    }
  });

  if (!workout) return null;

  return {
    ...workout,
    exercicios: workout.exercises.map(we => ({
      id: we.exercise.id,
      nome: we.exercise.name,
      peso: we.loadKg,
      reps: we.reps,
      targetMuscle: we.exercise.targetMuscle,
      isCompleted: we.isCompleted
    }))
  };
}

/**
 * Atualiza um treino específico.
 */
async function updateWorkout(workoutId, userId, updateData) {
  // Verificar se o treino pertence ao usuário
  const workout = await prisma.workout.findFirst({
    where: {
      id: workoutId,
      userId: userId
    }
  });

  if (!workout) {
    throw new Error('Treino não encontrado ou não pertence ao usuário');
  }

  // Atualizar dados básicos do treino
  const updatedWorkout = await prisma.workout.update({
    where: { id: workoutId },
    data: {
      name: updateData.name || workout.name,
      description: updateData.description || workout.description,
      targetMuscleGroup: updateData.targetMuscleGroup || workout.targetMuscleGroup,
    }
  });

  // Se há exercícios para atualizar
  if (updateData.exercises) {
    console.log('🔄 Atualizando exercícios do treino:', workoutId);
    console.log('📝 Dados dos exercícios:', updateData.exercises);
    
    // Atualizar cada exercício
    for (const exercise of updateData.exercises) {
      console.log(`📊 Atualizando exercício ${exercise.id}: peso=${exercise.peso}, reps=${exercise.reps}`);
      await prisma.workoutExercise.updateMany({
        where: {
          workoutId: workoutId,
          exerciseId: exercise.id
        },
        data: {
          loadKg: exercise.peso,
          reps: exercise.reps || 12,
          isCompleted: exercise.isCompleted || false
        }
      });
    }
  }

  return await getWorkoutWithExercises(workoutId);
}

/**
 * Deleta um treino específico.
 */
async function deleteWorkout(workoutId, userId) {
  // Verificar se o treino pertence ao usuário
  const workout = await prisma.workout.findFirst({
    where: {
      id: workoutId,
      userId: userId
    }
  });

  if (!workout) {
    throw new Error('Treino não encontrado ou não pertence ao usuário');
  }

  // Deletar exercícios do treino primeiro (devido à foreign key)
  await prisma.workoutExercise.deleteMany({
    where: { workoutId: workoutId }
  });

  // Deletar o treino
  await prisma.workout.delete({
    where: { id: workoutId }
  });

  return { message: 'Treino deletado com sucesso' };
}

module.exports = {
  createWorkout,
  getWorkoutsByUser,
  updateWorkout,
  deleteWorkout,
  getWorkoutWithExercises,
};