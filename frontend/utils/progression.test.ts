import { calculateNextWeight, roundToAvailableIncrement } from './progression';

describe('load progression', () => {
  it.each([
    [15, 25],
    [13, 22.5],
    [10, 21.5],
    [8, 20],
    [6, 19],
    [5, 17.5],
  ])('adjusts 20 kg after %i reps to %f kg', (reps, expected) => {
    expect(calculateNextWeight(20, reps)).toBe(expected);
  });

  it('uses smaller increments for isolated exercises', () => {
    expect(calculateNextWeight(8, 15, 'small')).toBe(10);
  });

  it('does not produce a negative load', () => {
    expect(calculateNextWeight(1, 3)).toBe(0);
  });

  it('rounds loads to realistic equipment increments', () => {
    expect(roundToAvailableIncrement(6.12)).toBe(6);
    expect(roundToAvailableIncrement(42.24)).toBe(42);
    expect(roundToAvailableIncrement(83.9)).toBe(85);
  });
});
