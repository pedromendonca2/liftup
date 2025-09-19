import { Exercicio, Treino, TreinoLetter } from '@/types/workout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@LiftUp:treinos';

// No-op in offline mode
export const testConnection = async (): Promise<void> => {
  return;
};

type TreinosMap = { [key in TreinoLetter]: Treino | null };

const emptyTreinosMap = (): TreinosMap => ({ A: null, B: null, C: null, D: null });

const readTreinosMap = async (): Promise<TreinosMap> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyTreinosMap();
    const parsed = JSON.parse(stored);
    return {
      A: parsed.A ?? null,
      B: parsed.B ?? null,
      C: parsed.C ?? null,
      D: parsed.D ?? null,
    } as TreinosMap;
  } catch (error) {
    console.error('Erro ao ler treinos do AsyncStorage:', error);
    return emptyTreinosMap();
  }
};

const writeTreinosMap = async (map: TreinosMap): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (error) {
    console.error('Erro ao salvar treinos no AsyncStorage:', error);
  }
};

export const createTreino = async (
  nome: string,
  exercicios: Exercicio[],
  letra: TreinoLetter
): Promise<{ success: boolean; data?: Treino; error?: string }> => {
  try {
    const treinosMap = await readTreinosMap();
    const newTreino: Treino = {
      id: Date.now().toString(),
      nome,
      letra,
      exercicios: exercicios.map(ex => ({ id: ex.id, nome: ex.nome, peso: ex.peso, reps: ex.reps })),
      dataCriacao: new Date().toISOString(),
      ultimaExecucao: null,
    };

    treinosMap[letra] = newTreino;
    await writeTreinosMap(treinosMap);
    return { success: true, data: newTreino };
  } catch (error) {
    console.error('Erro ao criar treino (local):', error);
    return { success: false, error: 'Erro ao criar treino' };
  }
};

export const getTreinos = async (): Promise<{ success: boolean; data?: Treino[]; error?: string }> => {
  try {
    const treinosMap = await readTreinosMap();
    const orderedLetters: TreinoLetter[] = ['A', 'B', 'C', 'D'];
    const list: Treino[] = orderedLetters
      .map(letter => treinosMap[letter])
      .filter((t): t is Treino => t !== null);
    return { success: true, data: list };
  } catch (error) {
    console.error('Erro ao buscar treinos (local):', error);
    return { success: false, error: 'Erro ao buscar treinos' };
  }
};

export const deleteTreino = async (treinoId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const treinosMap = await readTreinosMap();
    const letters: TreinoLetter[] = ['A', 'B', 'C', 'D'];
    for (const letter of letters) {
      if (treinosMap[letter]?.id === treinoId) {
        treinosMap[letter] = null;
        break;
      }
    }
    await writeTreinosMap(treinosMap);
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar treino (local):', error);
    return { success: false, error: 'Erro ao deletar treino' };
  }
};

export const updateTreinoExercicios = async (
  treinoId: string,
  exercicios: Exercicio[]
): Promise<{ success: boolean; error?: string }> => {
  try {
    const treinosMap = await readTreinosMap();
    const letters: TreinoLetter[] = ['A', 'B', 'C', 'D'];
    for (const letter of letters) {
      if (treinosMap[letter]?.id === treinoId) {
        treinosMap[letter] = {
          ...treinosMap[letter]!,
          exercicios: exercicios.map(ex => ({ id: ex.id, nome: ex.nome, peso: ex.peso, reps: ex.reps })),
        };
        break;
      }
    }
    await writeTreinosMap(treinosMap);
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar treino (local):', error);
    return { success: false, error: 'Erro ao atualizar treino' };
  }
};
