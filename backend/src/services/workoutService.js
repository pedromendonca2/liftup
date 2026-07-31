const prisma = require('../config/prisma');

function serializeWorkout(workout) {
  return {
    ...workout,
    exercicios: workout.exercises.map((item) => ({
      id: item.exercise.id,
      nome: item.exercise.name,
      peso: item.loadKg,
      reps: item.reps,
      targetMuscle: item.exercise.targetMuscle,
      isCompleted: item.isCompleted,
    })),
  };
}

async function getWorkoutWithExercises(workoutId, client = prisma) {
  const workout = await client.workout.findUnique({
    where: { id: workoutId },
    include: {
      exercises: {
        include: { exercise: true },
      },
    },
  });

  return workout ? serializeWorkout(workout) : null;
}

async function createWorkout(workoutData) {
  const { name, description, targetMuscleGroup, userId, exercises = [] } = workoutData;

  if (!name || !userId) {
    throw new Error('Nome do treino e usuário são obrigatórios.');
  }

  const uniqueExercises = Array.from(
    new Map(
      exercises
        .filter((exercise) => exercise.name?.trim())
        .map((exercise) => [exercise.name.trim().toLowerCase(), exercise]),
    ).values(),
  );

  return prisma.$transaction(async (transaction) => {
    const workout = await transaction.workout.create({
      data: { name, description, targetMuscleGroup, userId },
    });

    if (uniqueExercises.length > 0) {
      const exerciseRecords = await Promise.all(
        uniqueExercises.map((exercise) =>
          transaction.exercise.upsert({
            where: { name: exercise.name.trim() },
            update: { targetMuscle: exercise.targetMuscle ?? undefined },
            create: {
              name: exercise.name.trim(),
              targetMuscle: exercise.targetMuscle ?? null,
            },
          }),
        ),
      );

      await transaction.workoutExercise.createMany({
        data: exerciseRecords.map((record, index) => ({
          workoutId: workout.id,
          exerciseId: record.id,
          reps: uniqueExercises[index].reps ?? 12,
          loadKg: uniqueExercises[index].peso ?? 0,
          isCompleted: false,
        })),
      });
    }

    return getWorkoutWithExercises(workout.id, transaction);
  });
}

async function getWorkoutsByUser(userId) {
  const workouts = await prisma.workout.findMany({
    where: { userId },
    include: {
      exercises: {
        include: { exercise: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return workouts.map(serializeWorkout);
}

async function updateWorkout(workoutId, userId, updateData) {
  return prisma.$transaction(async (transaction) => {
    const workout = await transaction.workout.findFirst({
      where: { id: workoutId, userId },
    });

    if (!workout) {
      throw new Error('Treino não encontrado ou não pertence ao usuário.');
    }

    await transaction.workout.update({
      where: { id: workoutId },
      data: {
        name: updateData.name ?? workout.name,
        description: updateData.description ?? workout.description,
        targetMuscleGroup: updateData.targetMuscleGroup ?? workout.targetMuscleGroup,
      },
    });

    if (Array.isArray(updateData.exercises)) {
      await Promise.all(
        updateData.exercises.map((exercise) =>
          transaction.workoutExercise.updateMany({
            where: { workoutId, exerciseId: exercise.id },
            data: {
              loadKg: exercise.peso,
              reps: exercise.reps ?? 12,
              isCompleted: exercise.isCompleted ?? false,
            },
          }),
        ),
      );
    }

    return getWorkoutWithExercises(workoutId, transaction);
  });
}

async function deleteWorkout(workoutId, userId) {
  const workout = await prisma.workout.findFirst({
    where: { id: workoutId, userId },
  });

  if (!workout) {
    throw new Error('Treino não encontrado ou não pertence ao usuário.');
  }

  await prisma.workout.delete({ where: { id: workoutId } });
  return { message: 'Treino deletado com sucesso.' };
}

module.exports = {
  createWorkout,
  deleteWorkout,
  getWorkoutsByUser,
  getWorkoutWithExercises,
  updateWorkout,
};
