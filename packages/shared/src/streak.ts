const isWeekend = (d: Date) => d.getUTCDay() === 0 || d.getUTCDay() === 6;

const toKey = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Counts consecutive completed weekdays ending today (or the last weekday before today).
 * Weekends never count and never break the streak. Today being incomplete does not
 * break it either, since the day is not over yet.
 *
 * @param completedDays ISO dates (YYYY-MM-DD) where every scheduled task was checked.
 * @param today the current date (UTC midnight).
 */
export function weekdayStreak(completedDays: Iterable<string>, today: Date): number {
  const done = new Set(completedDays);
  const cursor = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  if (!done.has(toKey(cursor))) cursor.setUTCDate(cursor.getUTCDate() - 1);

  let streak = 0;
  for (;;) {
    if (isWeekend(cursor)) {
      cursor.setUTCDate(cursor.getUTCDate() - 1);
      continue;
    }
    if (!done.has(toKey(cursor))) return streak;
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
}
