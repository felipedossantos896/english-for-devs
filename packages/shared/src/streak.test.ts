import { describe, expect, it } from 'vitest';
import { weekdayStreak } from './streak.js';

// 2026-10-19 is a Monday.
const day = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe('weekdayStreak', () => {
  it('counts consecutive weekdays', () => {
    expect(weekdayStreak(['2026-10-19', '2026-10-20', '2026-10-21'], day('2026-10-21'))).toBe(3);
  });

  it('does not break when today is still incomplete', () => {
    expect(weekdayStreak(['2026-10-19', '2026-10-20'], day('2026-10-21'))).toBe(2);
  });

  it('skips weekends without breaking', () => {
    const done = ['2026-10-15', '2026-10-16', '2026-10-19'];
    expect(weekdayStreak(done, day('2026-10-19'))).toBe(3);
    expect(weekdayStreak(['2026-10-23'], day('2026-10-25'))).toBe(1);
  });

  it('breaks on a missed weekday', () => {
    expect(weekdayStreak(['2026-10-19', '2026-10-21'], day('2026-10-21'))).toBe(1);
  });
});
