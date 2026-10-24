import { describe, expect, it } from 'vitest';
import { addDays, isoWeekday, localDate } from './dates.js';

describe('localDate', () => {
  it('uses the given timezone, not UTC', () => {
    // 02:00 UTC on Saturday is still Friday evening in São Paulo (UTC-3).
    const now = new Date('2026-10-24T02:00:00Z');
    expect(localDate('America/Sao_Paulo', now)).toBe('2026-10-23');
    expect(localDate('UTC', now)).toBe('2026-10-24');
  });
});

describe('isoWeekday', () => {
  it('maps Monday to 1 and Sunday to 7', () => {
    expect(isoWeekday('2026-10-19')).toBe(1);
    expect(isoWeekday('2026-10-25')).toBe(7);
  });
});

describe('addDays', () => {
  it('crosses month boundaries', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-11-01', -1)).toBe('2026-10-31');
  });
});
