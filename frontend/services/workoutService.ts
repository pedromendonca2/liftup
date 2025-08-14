import { Exercicio, Treino, TreinoLetter } from '@/types/workout';

// Simulação de API local usando AsyncStorage para persistência
import AsyncStorage from '@react-native-async-storage/async-storage';

const TREINOS_STORAGE_KEY = '@LiftUp:treinos';

// Função para gerar ID único
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).slice(2, 9);
};

// Função para salvar treinos no storage local
const saveTreinosToStorage = async (treinos: Treino[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TREINOS_STORAGE_KEY, JSON.stringify(treinos));
  } catch (error) {
    console.error('Erro ao salvar treinos:', error);
  }
};

// Função para carregar treinos do storage local
const loadTreinosFromStorage = async (): Promise<Treino[]> => {
  try {
    const data = await AsyncStorage.getItem(TREINOS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao carregar treinos:', error);
    return [];
  }
};

// Função para criar um novo treino (simulação local)
export const createTreino = async (nome: string, exercicios: Exercicio[], letra: TreinoLetter): Promise<{ success: boolean; data?: Treino; error?: string }> => {
  try {
    const treinos = await loadTreinosFromStorage();
    
    const newTreino: Treino = {
      id: generateId(),
      nome: nome,
      letra: letra,
      exercicios: exercicios.map(ex => ({
        ...ex,
        id: ex.id || generateId()
      })),
      dataCriacao: new Date().toISOString(),
      ultimaExecucao: null,
      repeticoes: "8-15",
      series: 3,
    };

    treinos.push(newTreino);
    await saveTreinosToStorage(treinos);

    return { success: true, data: newTreino };
  } catch (error) {
    console.error('Erro ao criar treino:', error);
    return { success: false, error: 'Erro ao criar treino' };
  }
};

// Função para buscar todos os treinos (simulação local)
export const getTreinos = async (): Promise<{ success: boolean; data?: Treino[]; error?: string }> => {
  try {
    const treinos = await loadTreinosFromStorage();
    return { success: true, data: treinos };
  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    return { success: false, error: 'Erro ao buscar treinos' };
  }
};

// Função para deletar um treino (simulação local)
export const deleteTreino = async (treinoId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const treinos = await loadTreinosFromStorage();
    const updatedTreinos = treinos.filter(treino => treino.id !== treinoId);
    await saveTreinosToStorage(updatedTreinos);
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar treino:', error);
    return { success: false, error: 'Erro ao deletar treino' };
  }
};
