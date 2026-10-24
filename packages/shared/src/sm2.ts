/** Recall quality from 0 (blackout) to 5 (perfect). */
export type Grade = 0 | 1 | 2 | 3 | 4 | 5;

export interface CardSchedule {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
}

const MIN_EASE = 1.3;

/** SuperMemo-2: returns the next schedule for a card after a review. */
export function reviewCard(card: CardSchedule, grade: Grade): CardSchedule {
  const easeFactor = Math.max(
    MIN_EASE,
    card.easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)),
  );

  if (grade < 3) {
    return { easeFactor, intervalDays: 1, repetitions: 0 };
  }

  const repetitions = card.repetitions + 1;
  const intervalDays =
    repetitions === 1 ? 1 : repetitions === 2 ? 6 : Math.round(card.intervalDays * easeFactor);

  return { easeFactor, intervalDays, repetitions };
}

export function nextDueDate(from: Date, intervalDays: number): Date {
  const due = new Date(from);
  due.setUTCDate(due.getUTCDate() + intervalDays);
  return due;
}
