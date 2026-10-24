import { addDays, isoWeekday, localDate, weekdayStreak, type RoutineTodayDto } from '@efd/shared';
import * as repo from './repository.js';

/** How far back to look when computing the streak. */
const STREAK_LOOKBACK_DAYS = 400;

type Task = Awaited<ReturnType<typeof repo.findActiveTasks>>[number];

const scheduledOn = (tasks: Task[], date: string) =>
  tasks.filter((t) => t.weekdays.includes(isoWeekday(date)));

/**
 * A day is complete when every task scheduled for that weekday was checked.
 * Uses the current task list, so editing the routine also affects past days.
 */
function completedDays(tasks: Task[], checksByDate: Map<string, Set<string>>) {
  const days: string[] = [];
  for (const [date, checked] of checksByDate) {
    const scheduled = scheduledOn(tasks, date);
    if (scheduled.length > 0 && scheduled.every((t) => checked.has(t.id))) days.push(date);
  }
  return days;
}

export async function getToday(userId: string, timezone: string): Promise<RoutineTodayDto> {
  const date = localDate(timezone);
  const tasks = await repo.findActiveTasks(userId);
  const checksByDate = await repo.findChecksSince(userId, addDays(date, -STREAK_LOOKBACK_DAYS));
  const checkedToday = checksByDate.get(date) ?? new Set<string>();
  const today = scheduledOn(tasks, date);

  return {
    date,
    isStudyDay: today.length > 0,
    tasks: today.map((t) => ({
      id: t.id,
      title: t.title,
      minutes: t.minutes,
      checked: checkedToday.has(t.id),
    })),
    completed: today.length > 0 && today.every((t) => checkedToday.has(t.id)),
    streak: weekdayStreak(completedDays(tasks, checksByDate), new Date(`${date}T00:00:00Z`)),
  };
}

export class TaskNotFoundError extends Error {}

export async function setChecked(userId: string, timezone: string, taskId: string, checked: boolean) {
  const task = await repo.findTask(userId, taskId);
  if (!task) throw new TaskNotFoundError(taskId);

  const date = localDate(timezone);
  if (checked) await repo.checkTask(userId, date, taskId);
  else await repo.uncheckTask(userId, date, taskId);

  return getToday(userId, timezone);
}
