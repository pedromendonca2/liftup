export type ExerciseSize = 'big' | 'small';

export function roundToAvailableIncrement(weight: number): number {
  const safeWeight = Math.max(0, weight);

  if (safeWeight < 10) return Math.round(safeWeight * 4) / 4;
  if (safeWeight < 50) return Math.round(safeWeight * 2) / 2;
  return Math.round(safeWeight / 2.5) * 2.5;
}

export function calculateNextWeight(
  currentWeight: number,
  reps: number,
  exerciseSize: ExerciseSize = 'big',
): number {
  if (reps <= 0) return currentWeight;

  const increment = exerciseSize === 'big' ? 2.5 : 1;
  let adjustment = 0;

  if (reps >= 15) adjustment = increment * 2;
  else if (reps >= 13) adjustment = increment;
  else if (reps >= 10) adjustment = increment * 0.5;
  else if (reps >= 8) adjustment = 0;
  else if (reps >= 6) adjustment = increment * -0.5;
  else adjustment = -increment;

  return roundToAvailableIncrement(currentWeight + adjustment);
}
