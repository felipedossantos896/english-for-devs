import { and, asc, desc, eq, max, sql } from 'drizzle-orm';
import type { InterviewStage } from '@efd/shared';
import { db } from '../../db/client.js';
import { interviewQuestions, rehearsals, starAnswers } from '../../db/schema.js';

export type QuestionInput = Pick<
  typeof interviewQuestions.$inferInsert,
  'stage' | 'question' | 'tags' | 'difficulty'
>;
export type AnswerInput = Pick<
  typeof starAnswers.$inferInsert,
  'situation' | 'task' | 'action' | 'result' | 'fullAnswer'
>;
export type RehearsalInput = Pick<typeof rehearsals.$inferInsert, 'durationSec' | 'selfScore' | 'notes'>;

const answered = db
  .selectDistinct({ questionId: starAnswers.questionId })
  .from(starAnswers)
  .as('answered');

const practice = db
  .select({
    questionId: rehearsals.questionId,
    count: sql<number>`count(*)::int`.as('count'),
    lastPracticedAt: max(rehearsals.practicedAt).as('last_practiced_at'),
    averageScore: sql<number>`avg(${rehearsals.selfScore})::float`.as('average_score'),
  })
  .from(rehearsals)
  .groupBy(rehearsals.questionId)
  .as('practice');

/** Questions with whether they have an answer and their practice stats. */
export function findQuestions(userId: string, filter: { stage?: InterviewStage; id?: string } = {}) {
  return db
    .select({
      question: interviewQuestions,
      hasAnswer: sql<boolean>`${answered.questionId} is not null`,
      rehearsalCount: sql<number>`coalesce(${practice.count}, 0)`,
      lastPracticedAt: practice.lastPracticedAt,
      averageScore: practice.averageScore,
    })
    .from(interviewQuestions)
    .leftJoin(answered, eq(answered.questionId, interviewQuestions.id))
    .leftJoin(practice, eq(practice.questionId, interviewQuestions.id))
    .where(
      and(
        eq(interviewQuestions.userId, userId),
        filter.stage ? eq(interviewQuestions.stage, filter.stage) : undefined,
        filter.id ? eq(interviewQuestions.id, filter.id) : undefined,
      ),
    )
    .orderBy(asc(interviewQuestions.stage), asc(interviewQuestions.difficulty), asc(interviewQuestions.question));
}

export async function questionExists(userId: string, id: string) {
  const [row] = await db
    .select({ id: interviewQuestions.id })
    .from(interviewQuestions)
    .where(and(eq(interviewQuestions.id, id), eq(interviewQuestions.userId, userId)));
  return Boolean(row);
}

export async function insertQuestion(userId: string, input: QuestionInput) {
  const [row] = await db
    .insert(interviewQuestions)
    .values({ userId, ...input })
    .returning({ id: interviewQuestions.id });
  return row!.id;
}

export async function updateQuestion(id: string, input: Partial<QuestionInput>) {
  await db.update(interviewQuestions).set(input).where(eq(interviewQuestions.id, id));
}

export async function deleteQuestion(id: string) {
  await db.delete(interviewQuestions).where(eq(interviewQuestions.id, id));
}

export async function findLatestAnswer(questionId: string) {
  const [answer] = await db
    .select()
    .from(starAnswers)
    .where(eq(starAnswers.questionId, questionId))
    .orderBy(desc(starAnswers.version))
    .limit(1);
  return answer;
}

/** Saves the answer as a new version. The unique (question, version) key rejects concurrent saves. */
export async function insertAnswerVersion(questionId: string, input: AnswerInput) {
  const latest = await findLatestAnswer(questionId);
  const [answer] = await db
    .insert(starAnswers)
    .values({ questionId, ...input, version: (latest?.version ?? 0) + 1 })
    .returning();
  return answer!;
}

export function findRehearsals(questionId: string, limit: number) {
  return db
    .select()
    .from(rehearsals)
    .where(eq(rehearsals.questionId, questionId))
    .orderBy(desc(rehearsals.practicedAt))
    .limit(limit);
}

export async function insertRehearsal(questionId: string, input: RehearsalInput) {
  const [row] = await db
    .insert(rehearsals)
    .values({ questionId, ...input })
    .returning();
  return row!;
}
