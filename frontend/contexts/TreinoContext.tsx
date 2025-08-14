import { Exercicio, Treino, TreinoLetter } from '@/types/workout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface TreinoContextType {
  treinos: { [key in TreinoLetter]: Treino | null };
  isLoading: boolean;
  createNewTreino: (nome: string, exercicios: Exercicio[]) => Promise<boolean>;
  loadTreinos: () => Promise<void>;
  removeTreino: (letra: TreinoLetter) => Promise<void>;
  selectedTreino: TreinoLetter;
  setSelectedTreino: (letra: TreinoLetter) => void;
  markTreinoAsCompleted: (letra: TreinoLetter) => Promise<void>;
  getNextAvailableLetter: () => TreinoLetter | null;
}

const TreinoContext = createContext<TreinoContextType | undefined>(undefined);

const STORAGE_KEY = '@LiftUp:treinos';

export function TreinoProvider({ children }: { children: ReactNode }) {
  const [treinos, setTreinos] = useState<{ [key in TreinoLetter]: Treino | null }>({
    A: null,
    B: null,
    C: null,
    D: null,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTreino, setSelectedTreino] = useState<TreinoLetter>('A');

  // Função para salvar treinos no AsyncStorage
  const saveTreinosToStorage = async (newTreinos: { [key in TreinoLetter]: Treino | null }) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTreinos));
    } catch (error) {
      console.error('Erro ao salvar treinos:', error);
    }
  };

  // Função para encontrar próxima letra disponível
  const getNextAvailableLetter = (): TreinoLetter | null => {
    const letters: TreinoLetter[] = ['A', 'B', 'C', 'D'];
    return letters.find(letter => treinos[letter] === null) || null;
  };

  const createNewTreino = async (nome: string, exercicios: Exercicio[]): Promise<boolean> => {
    setIsLoading(true);
    try {
      const nextLetter = getNextAvailableLetter();
      
      if (!nextLetter) {
        Alert.alert('Erro', 'Você já tem o máximo de 4 treinos (A, B, C, D)');
        return false;
      }

      const newTreino: Treino = {
        id: Date.now().toString(),
        nome: nome,
        exercicios: exercicios,
        letra: nextLetter,
        dataCriacao: new Date().toISOString(),
        ultimaExecucao: null,
      };

      const newTreinos = {
        ...treinos,
        [nextLetter]: newTreino
      };

      setTreinos(newTreinos);
      await saveTreinosToStorage(newTreinos);

      Alert.alert('Sucesso', `Treino ${nextLetter} criado com sucesso!`);
      return true;
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      Alert.alert('Erro', 'Erro inesperado ao criar treino');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loadTreinos = async () => {
    setIsLoading(true);
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedTreinos = JSON.parse(saved);
        setTreinos(parsedTreinos);
      }
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeTreino = async (letra: TreinoLetter) => {
    const treino = treinos[letra];
    if (!treino) return;

    setIsLoading(true);
    try {
      const newTreinos = {
        ...treinos,
        [letra]: null
      };

      setTreinos(newTreinos);
      await saveTreinosToStorage(newTreinos);
      Alert.alert('Sucesso', `Treino ${letra} removido com sucesso!`);
    } catch (error) {
      console.error('Erro ao remover treino:', error);
      Alert.alert('Erro', 'Erro inesperado ao remover treino');
    } finally {
      setIsLoading(false);
    }
  };

  const markTreinoAsCompleted = async (letra: TreinoLetter) => {
    const treino = treinos[letra];
    if (!treino) return;

    try {
      const updatedTreino = { 
        ...treino,
        ultimaExecucao: new Date().toISOString()
      };
      const newTreinos = {
        ...treinos,
        [letra]: updatedTreino
      };

      setTreinos(newTreinos);
      await saveTreinosToStorage(newTreinos);
      Alert.alert('Parabéns!', `Treino ${letra} concluído! 💪`);
    } catch (error) {
      console.error('Erro ao marcar treino como concluído:', error);
    }
  };

  // Carregar treinos ao inicializar
  useEffect(() => {
    loadTreinos();
  }, []);

  return (
    <TreinoContext.Provider value={{
      treinos,
      isLoading,
      createNewTreino,
      loadTreinos,
      removeTreino,
      selectedTreino,
      setSelectedTreino,
      markTreinoAsCompleted,
      getNextAvailableLetter,
    }}>
      {children}
    </TreinoContext.Provider>
  );
}

export function useTreino() {
  const context = useContext(TreinoContext);
  if (context === undefined) {
    throw new Error('useTreino must be used within a TreinoProvider');
  }
  return context;
}
