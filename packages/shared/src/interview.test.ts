import { describe, expect, it } from 'vitest';
import { answerLengthFeedback, composeStarAnswer, formatDuration } from './interview.js';

describe('composeStarAnswer', () => {
  it('joins the parts in STAR order and skips empty ones', () => {
    expect(
      composeStarAnswer({
        situation: 'Our API was slow. ',
        task: '',
        action: 'I added caching.',
        result: 'Latency dropped by 60%.',
      }),
    ).toBe('Our API was slow. I added caching. Latency dropped by 60%.');
  });
});

describe('answerLengthFeedback', () => {
  it('flags answers outside the 1 to 3 minute range', () => {
    expect(answerLengthFeedback(45)).toBe('too_short');
    expect(answerLengthFeedback(60)).toBe('good');
    expect(answerLengthFeedback(180)).toBe('good');
    expect(answerLengthFeedback(181)).toBe('too_long');
  });
});

describe('formatDuration', () => {
  it('formats seconds as m:ss', () => {
    expect(formatDuration(5)).toBe('0:05');
    expect(formatDuration(125)).toBe('2:05');
  });
});
