import * as WorkoutService from '@/services/workoutService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Exercicio, Treino, TreinoLetter } from '../types/workout';

interface TreinoContextType {
  treinos: { [key in TreinoLetter]: Treino | null };
  selectedTreino: TreinoLetter;
  setSelectedTreino: (letter: TreinoLetter) => void;
  createNewTreino: (nome: string, exercicios: Exercicio[]) => Promise<Treino>;
  loadTreinos: () => Promise<void>;
  markTreinoAsCompleted: (letter: TreinoLetter) => Promise<void>;
  deleteTreino: (letter: TreinoLetter) => Promise<void>;
  updateTreinoExercicios: (letter: TreinoLetter, exercicios: Exercicio[]) => Promise<void>;
  getNextAvailableLetter: () => TreinoLetter | null;
  isLoading: boolean;
}

const TreinoContext = createContext<TreinoContextType | undefined>(undefined);

interface TreinoProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = '@LiftUp:treinos';

export const TreinoProvider: React.FC<TreinoProviderProps> = ({ children }) => {
  const [treinos, setTreinos] = useState<{ [key in TreinoLetter]: Treino | null }>({
    A: null,
    B: null,
    C: null,
    D: null,
  });
  const [selectedTreino, setSelectedTreino] = useState<TreinoLetter>('A');
  const [isLoading, setIsLoading] = useState(false);

  // Função para obter a próxima letra disponível
  const getNextAvailableLetter = (): TreinoLetter | null => {
    const letters: TreinoLetter[] = ['A', 'B', 'C', 'D'];
    for (const letter of letters) {
      if (!treinos[letter]) {
        return letter;
      }
    }
    return null; // Todos os slots estão ocupados
  };

  // Carregar treinos da API e AsyncStorage como backup
  const loadTreinos = async () => {
    try {
      setIsLoading(true);
      const result = await WorkoutService.getTreinos();
      
      if (result.success && result.data) {
        // Converter array de treinos para formato do contexto
        const treinosMap: { [key in TreinoLetter]: Treino | null } = {
          A: null,
          B: null,
          C: null,
          D: null
        };
        
        result.data.forEach((treino, index) => {
          const letter = ['A', 'B', 'C', 'D'][index] as TreinoLetter;
          if (letter) {
            treinosMap[letter] = treino;
          }
        });
        
        setTreinos(treinosMap);
        // Também salvar local para backup
        await saveTreinos(treinosMap);
      }
    } catch (error) {
      console.error('Erro ao carregar treinos da API:', error);
      // Em caso de erro, tenta carregar do storage local
      try {
        const treinosData = await AsyncStorage.getItem(STORAGE_KEY);
        if (treinosData) {
          const parsedTreinos = JSON.parse(treinosData);
          setTreinos(parsedTreinos);
        }
      } catch (localError) {
        console.error('Erro ao carregar treinos locais:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar treinos no AsyncStorage
  const saveTreinos = async (newTreinos: { [key in TreinoLetter]: Treino | null }) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTreinos));
    } catch (error) {
      console.error('Erro ao salvar treinos:', error);
    }
  };

  // Criar novo treino via API
  const createNewTreino = async (nome: string, exercicios: Exercicio[]): Promise<Treino> => {
    const nextLetter = getNextAvailableLetter();
    
    if (!nextLetter) {
      throw new Error('Todos os slots de treino (A-D) estão ocupados');
    }
    
    try {
      // Criar treino via API
      const result = await WorkoutService.createTreino(nome, exercicios, nextLetter);
      
      if (result.success && result.data) {
        const updatedTreinos = {
          ...treinos,
          [nextLetter]: result.data,
        };

        setTreinos(updatedTreinos);
        await saveTreinos(updatedTreinos);
        
        return result.data;
      } else {
        throw new Error(result.error || 'Erro ao criar treino');
      }
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      throw error;
    }
  };

  // Marcar treino como completado
  const markTreinoAsCompleted = async (letter: TreinoLetter) => {
    const treino = treinos[letter];
    if (!treino) return;

    const updatedTreino = {
      ...treino,
      ultimaExecucao: new Date().toISOString(),
    };

    const updatedTreinos = {
      ...treinos,
      [letter]: updatedTreino,
    };

    setTreinos(updatedTreinos);
    await saveTreinos(updatedTreinos);
  };

  // Deletar treino via API
  const deleteTreino = async (letter: TreinoLetter) => {
    const treino = treinos[letter];
    if (!treino) return;

    try {
      // Deletar via API
      const result = await WorkoutService.deleteTreino(treino.id);
      
      if (result.success) {
        const updatedTreinos = {
          ...treinos,
          [letter]: null,
        };

        setTreinos(updatedTreinos);
        await saveTreinos(updatedTreinos);
      } else {
        throw new Error(result.error || 'Erro ao deletar treino');
      }
    } catch (error) {
      console.error('Erro ao deletar treino:', error);
      throw error;
    }
  };

  // Atualizar exercícios de um treino via API
  const updateTreinoExercicios = async (letter: TreinoLetter, exercicios: Exercicio[]) => {
    const treino = treinos[letter];
    if (!treino) return;

    try {
      // Atualizar via API
      const result = await WorkoutService.updateTreinoExercicios(treino.id, exercicios);
      
      if (result.success) {
        const updatedTreino = {
          ...treino,
          exercicios: exercicios,
        };

        const updatedTreinos = {
          ...treinos,
          [letter]: updatedTreino,
        };

        setTreinos(updatedTreinos);
        await saveTreinos(updatedTreinos);
      } else {
        throw new Error(result.error || 'Erro ao atualizar treino');
      }
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
      throw error;
    }
  };

  // Carregar treinos na inicialização
  useEffect(() => {
    loadTreinos();
  }, []);

  const value: TreinoContextType = {
    treinos,
    selectedTreino,
    setSelectedTreino,
    createNewTreino,
    loadTreinos,
    markTreinoAsCompleted,
    deleteTreino,
    updateTreinoExercicios,
    getNextAvailableLetter,
    isLoading,
  };

  return (
    <TreinoContext.Provider value={value}>
      {children}
    </TreinoContext.Provider>
  );
};

export const useTreino = (): TreinoContextType => {
  const context = useContext(TreinoContext);
  if (context === undefined) {
    throw new Error('useTreino deve ser usado dentro de um TreinoProvider');
  }
  return context;
};