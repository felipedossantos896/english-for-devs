import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { cefrLevels, deckLayers, interviewStages, phaseStatuses } from '@efd/shared';

const id = () => uuid('id').primaryKey().defaultRandom();
const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

export const cefrLevel = pgEnum('cefr_level', cefrLevels);
export const phaseStatus = pgEnum('phase_status', phaseStatuses);
export const deckLayer = pgEnum('deck_layer', deckLayers);
export const interviewStage = pgEnum('interview_stage', interviewStages);

export const users = pgTable('users', {
  id: id(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  timezone: text('timezone').notNull().default('America/Sao_Paulo'),
  createdAt: createdAt(),
});

// Phases & goals

export const phases = pgTable('phases', {
  id: id(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  cefrLevel: cefrLevel('cefr_level').notNull(),
  position: integer('position').notNull(),
  status: phaseStatus('status').notNull().default('locked'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
});

export const goals = pgTable('goals', {
  id: id(),
  phaseId: uuid('phase_id').notNull().references(() => phases.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  targetValue: integer('target_value').notNull(),
  currentValue: integer('current_value').notNull().default(0),
  unit: text('unit').notNull(),
  doneAt: timestamp('done_at', { withTimezone: true }),
});

// Daily routine

export const routineTasks = pgTable('routine_tasks', {
  id: id(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  minutes: integer('minutes').notNull(),
  /** ISO weekdays the task is scheduled on, 1 = Monday ... 5 = Friday. */
  weekdays: smallint('weekdays').array().notNull().default([1, 2, 3, 4, 5]),
  position: integer('position').notNull(),
  active: boolean('active').notNull().default(true),
});

export const dailyLogs = pgTable(
  'daily_logs',
  {
    id: id(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
  },
  (t) => [unique().on(t.userId, t.date)],
);

export const taskChecks = pgTable(
  'task_checks',
  {
    id: id(),
    dailyLogId: uuid('daily_log_id').notNull().references(() => dailyLogs.id, { onDelete: 'cascade' }),
    routineTaskId: uuid('routine_task_id').notNull().references(() => routineTasks.id, { onDelete: 'cascade' }),
    checkedAt: timestamp('checked_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.dailyLogId, t.routineTaskId)],
);

// Flashcards (SM-2)

export const decks = pgTable('decks', {
  id: id(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  layer: deckLayer('layer').notNull(),
  position: integer('position').notNull(),
});

export const cards = pgTable(
  'cards',
  {
    id: id(),
    deckId: uuid('deck_id').notNull().references(() => decks.id, { onDelete: 'cascade' }),
    front: text('front').notNull(),
    back: text('back').notNull(),
    example: text('example'),
    audioUrl: text('audio_url'),
    easeFactor: real('ease_factor').notNull().default(2.5),
    intervalDays: integer('interval_days').notNull().default(0),
    repetitions: integer('repetitions').notNull().default(0),
    dueAt: timestamp('due_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: createdAt(),
  },
  (t) => [index('cards_deck_due_idx').on(t.deckId, t.dueAt)],
);

export const reviews = pgTable('reviews', {
  id: id(),
  cardId: uuid('card_id').notNull().references(() => cards.id, { onDelete: 'cascade' }),
  grade: smallint('grade').notNull(),
  prevInterval: integer('prev_interval').notNull(),
  newInterval: integer('new_interval').notNull(),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }).notNull().defaultNow(),
});

// Interview bank

export const interviewQuestions = pgTable('interview_questions', {
  id: id(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stage: interviewStage('stage').notNull(),
  question: text('question').notNull(),
  tags: text('tags').array().notNull().default([]),
  difficulty: smallint('difficulty').notNull().default(1),
});

export const starAnswers = pgTable('star_answers', {
  id: id(),
  questionId: uuid('question_id').notNull().references(() => interviewQuestions.id, { onDelete: 'cascade' }),
  situation: text('situation').notNull().default(''),
  task: text('task').notNull().default(''),
  action: text('action').notNull().default(''),
  result: text('result').notNull().default(''),
  fullAnswer: text('full_answer'),
  version: integer('version').notNull().default(1),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const rehearsals = pgTable('rehearsals', {
  id: id(),
  questionId: uuid('question_id').notNull().references(() => interviewQuestions.id, { onDelete: 'cascade' }),
  practicedAt: timestamp('practiced_at', { withTimezone: true }).notNull().defaultNow(),
  durationSec: integer('duration_sec').notNull(),
  selfScore: smallint('self_score').notNull(),
  notes: text('notes'),
});

// Relations

export const phasesRelations = relations(phases, ({ many }) => ({ goals: many(goals) }));
export const goalsRelations = relations(goals, ({ one }) => ({
  phase: one(phases, { fields: [goals.phaseId], references: [phases.id] }),
}));
export const decksRelations = relations(decks, ({ many }) => ({ cards: many(cards) }));
export const cardsRelations = relations(cards, ({ one, many }) => ({
  deck: one(decks, { fields: [cards.deckId], references: [decks.id] }),
  reviews: many(reviews),
}));
export const reviewsRelations = relations(reviews, ({ one }) => ({
  card: one(cards, { fields: [reviews.cardId], references: [cards.id] }),
}));
export const interviewQuestionsRelations = relations(interviewQuestions, ({ many }) => ({
  answers: many(starAnswers),
  rehearsals: many(rehearsals),
}));
export const starAnswersRelations = relations(starAnswers, ({ one }) => ({
  question: one(interviewQuestions, { fields: [starAnswers.questionId], references: [interviewQuestions.id] }),
}));
export const rehearsalsRelations = relations(rehearsals, ({ one }) => ({
  question: one(interviewQuestions, { fields: [rehearsals.questionId], references: [interviewQuestions.id] }),
}));
