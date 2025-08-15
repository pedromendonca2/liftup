import { Exercicio, Treino, TreinoLetter } from '@/types/workout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Função para obter o token de autenticação
const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('@LiftUp:authToken');
  } catch (error) {
    console.error('Erro ao buscar token:', error);
    return null;
  }
};

// Função para criar headers com autenticação
const getAuthHeaders = async () => {
  const token = await getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Função para criar um novo treino via API
export const createTreino = async (nome: string, exercicios: Exercicio[], letra: TreinoLetter): Promise<{ success: boolean; data?: Treino; error?: string }> => {
  try {
    const headers = await getAuthHeaders();
    
    const workoutData = {
      name: nome,
      description: null,
      targetMuscleGroup: null,
      exercises: exercicios.map(ex => ({
        name: ex.nome,
        peso: ex.peso,
        reps: 12,
        targetMuscle: null
      }))
    };

    const response = await fetch(`${API_URL}/api/workouts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(workoutData)
    });

    if (!response.ok) {
      throw new Error('Erro ao criar treino no servidor');
    }

    const backendWorkout = await response.json();
    
    // Transformar resposta do backend para formato do frontend
    const frontendWorkout: Treino = {
      id: backendWorkout.id.toString(),
      nome: backendWorkout.name,
      letra: letra,
      exercicios: backendWorkout.exercicios || [],
      dataCriacao: backendWorkout.createdAt,
      ultimaExecucao: null,
    };

    return { success: true, data: frontendWorkout };
  } catch (error) {
    console.error('Erro ao criar treino:', error);
    return { success: false, error: 'Erro ao criar treino' };
  }
};

// Função para buscar todos os treinos via API
export const getTreinos = async (): Promise<{ success: boolean; data?: Treino[]; error?: string }> => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_URL}/api/workouts`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar treinos do servidor');
    }

    const backendWorkouts = await response.json();
    
    // Transformar resposta do backend para formato do frontend
    const frontendWorkouts: Treino[] = backendWorkouts.map((workout: any, index: number) => ({
      id: workout.id.toString(),
      nome: workout.name,
      letra: ['A', 'B', 'C', 'D'][index % 4] as TreinoLetter, // Mapear para letras sequenciais
      exercicios: workout.exercicios || [],
      dataCriacao: workout.createdAt,
      ultimaExecucao: null,
    }));

    return { success: true, data: frontendWorkouts };
  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    return { success: false, error: 'Erro ao buscar treinos' };
  }
};

// Função para deletar um treino via API
export const deleteTreino = async (treinoId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_URL}/api/workouts/${treinoId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar treino no servidor');
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar treino:', error);
    return { success: false, error: 'Erro ao deletar treino' };
  }
};

// Função para atualizar exercícios de um treino via API
export const updateTreinoExercicios = async (treinoId: string, exercicios: Exercicio[]): Promise<{ success: boolean; error?: string }> => {
  try {
    const headers = await getAuthHeaders();
    
    const updateData = {
      exercises: exercicios.map(ex => ({
        id: ex.id,
        peso: ex.peso,
        reps: 12,
        isCompleted: false
      }))
    };

    const response = await fetch(`${API_URL}/api/workouts/${treinoId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar treino no servidor');
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar treino:', error);
    return { success: false, error: 'Erro ao atualizar treino' };
  }
};
