import { and, asc, eq, gte } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { dailyLogs, routineTasks, taskChecks } from '../../db/schema.js';

export function findActiveTasks(userId: string) {
  return db
    .select()
    .from(routineTasks)
    .where(and(eq(routineTasks.userId, userId), eq(routineTasks.active, true)))
    .orderBy(asc(routineTasks.position));
}

export async function findTask(userId: string, taskId: string) {
  const [task] = await db
    .select()
    .from(routineTasks)
    .where(and(eq(routineTasks.id, taskId), eq(routineTasks.userId, userId)));
  return task;
}

/** Checked task ids grouped by date, for every log on or after `since`. */
export async function findChecksSince(userId: string, since: string) {
  const rows = await db
    .select({ date: dailyLogs.date, taskId: taskChecks.routineTaskId })
    .from(dailyLogs)
    .innerJoin(taskChecks, eq(taskChecks.dailyLogId, dailyLogs.id))
    .where(and(eq(dailyLogs.userId, userId), gte(dailyLogs.date, since)));

  const byDate = new Map<string, Set<string>>();
  for (const { date, taskId } of rows) {
    if (!byDate.has(date)) byDate.set(date, new Set());
    byDate.get(date)!.add(taskId);
  }
  return byDate;
}

async function upsertDailyLog(userId: string, date: string) {
  const [log] = await db
    .insert(dailyLogs)
    .values({ userId, date })
    .onConflictDoUpdate({ target: [dailyLogs.userId, dailyLogs.date], set: { date } })
    .returning();
  return log!;
}

export async function checkTask(userId: string, date: string, taskId: string) {
  const log = await upsertDailyLog(userId, date);
  await db
    .insert(taskChecks)
    .values({ dailyLogId: log.id, routineTaskId: taskId })
    .onConflictDoNothing();
}

export async function uncheckTask(userId: string, date: string, taskId: string) {
  const [log] = await db
    .select()
    .from(dailyLogs)
    .where(and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, date)));
  if (!log) return;
  await db
    .delete(taskChecks)
    .where(and(eq(taskChecks.dailyLogId, log.id), eq(taskChecks.routineTaskId, taskId)));
}
