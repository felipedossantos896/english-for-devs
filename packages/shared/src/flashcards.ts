import type { DeckLayer } from './enums.js';
import { nextDueDate, reviewCard, type CardSchedule, type Grade } from './sm2.js';

export interface DeckDto {
  id: string;
  name: string;
  layer: DeckLayer;
  total: number;
  due: number;
  /** Cards never reviewed. */
  fresh: number;
}

export interface CardDto {
  id: string;
  deckId: string;
  front: string;
  back: string;
  example: string | null;
  intervalDays: number;
  repetitions: number;
  dueAt: string;
}

/** The four answer buttons shown after revealing a card, mapped to SM-2 grades. */
export const reviewAnswers = [
  { label: 'Again', grade: 1 },
  { label: 'Hard', grade: 3 },
  { label: 'Good', grade: 4 },
  { label: 'Easy', grade: 5 },
] as const satisfies readonly { label: string; grade: Grade }[];

/** Applies a review to a card: the new SM-2 schedule plus when it is due next. */
export function scheduleReview(card: CardSchedule, grade: Grade, now: Date = new Date()) {
  const next = reviewCard(card, grade);
  return { ...next, dueAt: nextDueDate(now, next.intervalDays) };
}
