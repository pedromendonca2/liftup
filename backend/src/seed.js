const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário de teste
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@liftup.com' },
    update: {},
    create: {
      email: 'admin@liftup.com',
      password: hashedPassword,
      name: 'Administrador'
    }
  });

  console.log('✅ Usuário criado:', user.email);

  // Criar treino de exemplo
  const workout = await prisma.workout.create({
    data: {
      name: 'Treino A - Peito e Tríceps',
      description: 'Treino focado em peito e tríceps',
      userId: user.id
    }
  });

  console.log('✅ Treino criado:', workout.name);

  // Criar exercícios de exemplo
  const exercises = [
    {
      name: 'Supino Reto',
      sets: 4,
      reps: 12,
      weight: 60.0,
      notes: 'Foco na técnica e controle da descida',
      workoutId: workout.id
    },
    {
      name: 'Supino Inclinado',
      sets: 3,
      reps: 10,
      weight: 50.0,
      notes: 'Inclinação de 30-45 graus',
      workoutId: workout.id
    },
    {
      name: 'Extensão de Tríceps na Polia',
      sets: 3,
      reps: 15,
      weight: 25.0,
      notes: 'Manter cotovelos fixos',
      workoutId: workout.id
    },
    {
      name: 'Flexão de Braço',
      sets: 3,
      reps: 20,
      weight: null,
      notes: 'Até a falha muscular',
      workoutId: workout.id
    }
  ];

  for (const exerciseData of exercises) {
    const exercise = await prisma.exercise.create({
      data: exerciseData
    });
    console.log('✅ Exercício criado:', exercise.name);
  }

  // Criar segundo treino
  const workout2 = await prisma.workout.create({
    data: {
      name: 'Treino B - Costas e Bíceps',
      description: 'Treino focado em costas e bíceps',
      userId: user.id
    }
  });

  console.log('✅ Treino criado:', workout2.name);

  const exercises2 = [
    {
      name: 'Puxada na Frente',
      sets: 4,
      reps: 12,
      weight: 45.0,
      notes: 'Puxar até o peito',
      workoutId: workout2.id
    },
    {
      name: 'Remada Curvada',
      sets: 3,
      reps: 10,
      weight: 40.0,
      notes: 'Manter costas retas',
      workoutId: workout2.id
    },
    {
      name: 'Rosca Direta',
      sets: 3,
      reps: 12,
      weight: 20.0,
      notes: 'Controle total do movimento',
      workoutId: workout2.id
    }
  ];

  for (const exerciseData of exercises2) {
    const exercise = await prisma.exercise.create({
      data: exerciseData
    });
    console.log('✅ Exercício criado:', exercise.name);
  }

  console.log('🎉 Seed concluído com sucesso!');
  console.log('📧 Email: admin@liftup.com');
  console.log('🔑 Senha: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 