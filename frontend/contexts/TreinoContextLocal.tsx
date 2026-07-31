import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import * as WorkoutService from '@/services/workoutService';
import { Exercicio, Treino, TreinoLetter } from '@/types/workout';

type TreinosMap = { [key in TreinoLetter]: Treino | null };

interface TreinoContextType {
  treinos: TreinosMap;
  createNewTreino: (nome: string, exercicios: Exercicio[]) => Promise<Treino>;
  markTreinoAsCompleted: (letter: TreinoLetter) => Promise<void>;
  deleteTreino: (letter: TreinoLetter) => Promise<void>;
  updateTreinoExercicios: (letter: TreinoLetter, exercicios: Exercicio[]) => Promise<void>;
  getNextAvailableLetter: () => TreinoLetter | null;
  isLoading: boolean;
}

const TreinoContext = createContext<TreinoContextType | undefined>(undefined);
const STORAGE_KEY = '@LiftUp:treinos';
const LETTERS: TreinoLetter[] = ['A', 'B', 'C', 'D'];
const EMPTY_TREINOS: TreinosMap = { A: null, B: null, C: null, D: null };

export function TreinoProvider({ children }: { children: ReactNode }) {
  const [treinos, setTreinos] = useState<TreinosMap>(EMPTY_TREINOS);
  const [isLoading, setIsLoading] = useState(true);

  const saveTreinos = async (newTreinos: TreinosMap) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTreinos));
  };

  const loadTreinos = async () => {
    try {
      const result = await WorkoutService.getTreinos();
      const loaded = { ...EMPTY_TREINOS };

      result.data?.forEach((treino) => {
        loaded[treino.letra] = treino;
      });

      setTreinos(loaded);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTreinos();
  }, []);

  const getNextAvailableLetter = (): TreinoLetter | null =>
    LETTERS.find((letter) => !treinos[letter]) ?? null;

  const createNewTreino = async (nome: string, exercicios: Exercicio[]): Promise<Treino> => {
    const nextLetter = getNextAvailableLetter();
    if (!nextLetter) {
      throw new Error('Todos os slots de treino (A–D) estão ocupados.');
    }

    const result = await WorkoutService.createTreino(nome, exercicios, nextLetter);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Erro ao criar treino.');
    }

    setTreinos((current) => ({ ...current, [nextLetter]: result.data! }));
    return result.data;
  };

  const markTreinoAsCompleted = async (letter: TreinoLetter) => {
    const treino = treinos[letter];
    if (!treino) return;

    const updatedTreinos = {
      ...treinos,
      [letter]: { ...treino, ultimaExecucao: new Date().toISOString() },
    };

    setTreinos(updatedTreinos);
    await saveTreinos(updatedTreinos);
  };

  const deleteTreino = async (letter: TreinoLetter) => {
    const treino = treinos[letter];
    if (!treino) return;

    const result = await WorkoutService.deleteTreino(treino.id);
    if (!result.success) {
      throw new Error(result.error || 'Erro ao excluir treino.');
    }

    setTreinos((current) => ({ ...current, [letter]: null }));
  };

  const updateTreinoExercicios = async (letter: TreinoLetter, exercicios: Exercicio[]) => {
    const treino = treinos[letter];
    if (!treino) return;

    const result = await WorkoutService.updateTreinoExercicios(treino.id, exercicios);
    if (!result.success) {
      throw new Error(result.error || 'Erro ao atualizar treino.');
    }

    setTreinos((current) => ({
      ...current,
      [letter]: current[letter] ? { ...current[letter]!, exercicios } : null,
    }));
  };

  return (
    <TreinoContext.Provider
      value={{
        treinos,
        createNewTreino,
        markTreinoAsCompleted,
        deleteTreino,
        updateTreinoExercicios,
        getNextAvailableLetter,
        isLoading,
      }}
    >
      {children}
    </TreinoContext.Provider>
  );
}

export function useTreino(): TreinoContextType {
  const context = useContext(TreinoContext);
  if (!context) {
    throw new Error('useTreino deve ser usado dentro de um TreinoProvider.');
  }
  return context;
}
