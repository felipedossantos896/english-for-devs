import { describe, expect, it } from 'vitest';
import { scheduleReview } from './flashcards.js';

const now = new Date('2026-10-23T15:00:00Z');

describe('scheduleReview', () => {
  it('makes a new card due tomorrow after a good answer', () => {
    const next = scheduleReview({ easeFactor: 2.5, intervalDays: 0, repetitions: 0 }, 4, now);
    expect(next.intervalDays).toBe(1);
    expect(next.dueAt.toISOString()).toBe('2026-10-24T15:00:00.000Z');
  });

  it('brings a forgotten card back tomorrow', () => {
    const next = scheduleReview({ easeFactor: 2.5, intervalDays: 30, repetitions: 5 }, 1, now);
    expect(next.repetitions).toBe(0);
    expect(next.dueAt.toISOString()).toBe('2026-10-24T15:00:00.000Z');
  });
});
