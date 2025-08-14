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

  // Carregar treinos do AsyncStorage
  const loadTreinos = async () => {
    try {
      setIsLoading(true);
      const treinosData = await AsyncStorage.getItem(STORAGE_KEY);
      if (treinosData) {
        const parsedTreinos = JSON.parse(treinosData);
        setTreinos(parsedTreinos);
      }
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
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

  // Criar novo treino
  const createNewTreino = async (nome: string, exercicios: Exercicio[]): Promise<Treino> => {
    const nextLetter = getNextAvailableLetter();
    
    if (!nextLetter) {
      throw new Error('Todos os slots de treino (A-D) estão ocupados');
    }
    
    const newTreino: Treino = {
      id: Date.now().toString(),
      nome: nome,
      letra: nextLetter,
      exercicios: exercicios,
      dataCriacao: new Date().toISOString(),
      ultimaExecucao: null,
      repeticoes: "8-15",
      series: 3,
    };

    const updatedTreinos = {
      ...treinos,
      [nextLetter]: newTreino,
    };

    setTreinos(updatedTreinos);
    await saveTreinos(updatedTreinos);
    
    return newTreino;
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

  // Deletar treino
  const deleteTreino = async (letter: TreinoLetter) => {
    const updatedTreinos = {
      ...treinos,
      [letter]: null,
    };

    setTreinos(updatedTreinos);
    await saveTreinos(updatedTreinos);
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
