import type {
  InterviewQuestionDetailDto,
  InterviewQuestionDto,
  InterviewStage,
  RehearsalDto,
  StarAnswerDto,
} from '@efd/shared';
import * as repo from './repository.js';

export class NotFoundError extends Error {}

const RECENT_REHEARSALS = 10;

type QuestionRow = Awaited<ReturnType<typeof repo.findQuestions>>[number];
type AnswerRow = NonNullable<Awaited<ReturnType<typeof repo.findLatestAnswer>>>;
type RehearsalRow = Awaited<ReturnType<typeof repo.findRehearsals>>[number];

const toQuestionDto = (row: QuestionRow): InterviewQuestionDto => ({
  id: row.question.id,
  stage: row.question.stage,
  question: row.question.question,
  tags: row.question.tags,
  difficulty: row.question.difficulty,
  hasAnswer: row.hasAnswer,
  rehearsalCount: row.rehearsalCount,
  lastPracticedAt: row.lastPracticedAt ? new Date(row.lastPracticedAt).toISOString() : null,
  averageScore: row.averageScore,
});

const toAnswerDto = (answer: AnswerRow): StarAnswerDto => ({
  situation: answer.situation,
  task: answer.task,
  action: answer.action,
  result: answer.result,
  fullAnswer: answer.fullAnswer,
  version: answer.version,
  updatedAt: answer.updatedAt.toISOString(),
});

const toRehearsalDto = (r: RehearsalRow): RehearsalDto => ({
  id: r.id,
  practicedAt: r.practicedAt.toISOString(),
  durationSec: r.durationSec,
  selfScore: r.selfScore,
  notes: r.notes,
});

async function requireQuestion(userId: string, id: string) {
  if (!(await repo.questionExists(userId, id))) throw new NotFoundError('Question not found');
}

export async function listQuestions(userId: string, stage?: InterviewStage) {
  return (await repo.findQuestions(userId, { stage })).map(toQuestionDto);
}

export async function getQuestion(userId: string, id: string): Promise<InterviewQuestionDetailDto> {
  const [row] = await repo.findQuestions(userId, { id });
  if (!row) throw new NotFoundError('Question not found');

  const [answer, rehearsals] = await Promise.all([
    repo.findLatestAnswer(id),
    repo.findRehearsals(id, RECENT_REHEARSALS),
  ]);
  return {
    ...toQuestionDto(row),
    answer: answer ? toAnswerDto(answer) : null,
    rehearsals: rehearsals.map(toRehearsalDto),
  };
}

export async function createQuestion(userId: string, input: repo.QuestionInput) {
  return getQuestion(userId, await repo.insertQuestion(userId, input));
}

export async function editQuestion(userId: string, id: string, input: Partial<repo.QuestionInput>) {
  await requireQuestion(userId, id);
  await repo.updateQuestion(id, input);
  return getQuestion(userId, id);
}

export async function removeQuestion(userId: string, id: string) {
  await requireQuestion(userId, id);
  await repo.deleteQuestion(id);
}

export async function saveAnswer(userId: string, id: string, input: repo.AnswerInput) {
  await requireQuestion(userId, id);
  await repo.insertAnswerVersion(id, input);
  return getQuestion(userId, id);
}

export async function addRehearsal(userId: string, id: string, input: repo.RehearsalInput) {
  await requireQuestion(userId, id);
  await repo.insertRehearsal(id, input);
  return getQuestion(userId, id);
}
