// Tipos para Treino e Exercício (Equipment e Exercicio são a mesma coisa)

export type TreinoLetter = 'A' | 'B' | 'C' | 'D';

export interface Exercicio {
  id: string;
  nome: string;
  peso: number;
}

export interface Treino {
  id: string;
  nome: string;
  exercicios: Exercicio[];
  letra: TreinoLetter;
  dataCriacao: string;
  ultimaExecucao: string | null;
  repeticoes: string; // sempre "8-15"
  series: number; // sempre "3"
}
