import { describe, expect, it } from 'vitest';
import { reviewCard } from './sm2.js';

const fresh = { easeFactor: 2.5, intervalDays: 0, repetitions: 0 };

describe('reviewCard', () => {
  it('schedules 1 day, then 6 days, then interval * ease', () => {
    const first = reviewCard(fresh, 4);
    expect(first.intervalDays).toBe(1);
    const second = reviewCard(first, 4);
    expect(second.intervalDays).toBe(6);
    const third = reviewCard(second, 4);
    expect(third.intervalDays).toBe(Math.round(6 * third.easeFactor));
  });

  it('resets repetitions on a failed recall', () => {
    const learned = { easeFactor: 2.5, intervalDays: 15, repetitions: 4 };
    expect(reviewCard(learned, 2)).toMatchObject({ intervalDays: 1, repetitions: 0 });
  });

  it('never drops the ease factor below 1.3', () => {
    let card = fresh;
    for (let i = 0; i < 10; i++) card = reviewCard(card, 0);
    expect(card.easeFactor).toBe(1.3);
  });
});
