# English for Devs — Architecture Proposal

A study app to go from beginner English to passing international job interviews.
Code, README and commits in English.

## Stack

| Layer    | Choice |
|----------|--------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS + TanStack Query + React Router |
| Backend  | Node 20 + TypeScript + Fastify + Zod (validation) |
| Database | PostgreSQL 16 + Drizzle ORM + drizzle-kit (migrations) |
| Tooling  | pnpm workspaces, ESLint, Prettier, Vitest, Docker Compose (Postgres), GitHub Actions CI |

## Monorepo layout

```
english-for-devs/
├── apps/
│   ├── web/            # React SPA
│   │   └── src/{features/{phases,routine,flashcards,interview},components,lib}
│   └── api/            # Fastify REST API
│       └── src/{modules/{phases,routine,flashcards,interview},db,plugins}
├── packages/
│   └── shared/         # Zod schemas + types shared by web and api
├── docker-compose.yml  # Postgres for local dev
└── .github/workflows/ci.yml
```

Each feature is a vertical module: `routes.ts` (HTTP), `service.ts` (rules), `repository.ts` (Drizzle queries).
Single user at first (`users` table exists so auth can be added later without migrations pain).

## Modules (MVP)

1. **Phases & goals** — study phases (e.g. A1 → B2 → interview-ready), each with measurable goals and a progress %.
2. **Daily routine** — tasks per day, check them off, Mon–Fri streak (weekends neither break nor count).
3. **Flashcards** — spaced repetition (SM-2), cards grouped by layer (vocabulary, phrases, tech terms, interview).
4. **Interview bank** — questions by stage (HR screen, behavioral, technical, system design) with STAR answers and rehearsal log.

## Database schema (Drizzle)

```ts
// users
users: id uuid pk, name text, email text unique, timezone text default 'America/Sao_Paulo', created_at

// 1. Phases & goals
phases: id, user_id fk, title, description, cefr_level ('A1'..'C1'), position int,
        status ('locked'|'active'|'done'), started_at, finished_at
goals:  id, phase_id fk, title, target_value int, current_value int default 0,
        unit text ('cards','hours','mock_interviews',...), done_at
// phase progress = avg(min(current/target, 1)) over its goals — computed, not stored

// 2. Daily routine
routine_tasks: id, user_id fk, title, minutes int, weekdays int[] (1=Mon..5=Fri),
               position int, active bool
daily_logs:    id, user_id fk, date date, unique(user_id, date)
task_checks:   id, daily_log_id fk, routine_task_id fk, checked_at, unique(daily_log_id, routine_task_id)
// streak = consecutive weekdays (skipping Sat/Sun) whose daily_log has all scheduled tasks checked

// 3. Flashcards (SM-2)
decks:  id, user_id fk, name, layer ('vocabulary'|'phrases'|'tech'|'interview'), position
cards:  id, deck_id fk, front text, back text, example text, audio_url text,
        ease_factor real default 2.5, interval_days int default 0, repetitions int default 0,
        due_at timestamptz default now(), created_at
        index(deck_id, due_at)
reviews: id, card_id fk, grade int (0..5), reviewed_at, prev_interval int, new_interval int

// 4. Interview bank
interview_questions: id, user_id fk, stage ('hr'|'behavioral'|'technical'|'system_design'|'closing'),
                     question text, tags text[], difficulty int
star_answers: id, question_id fk, situation, task, action, result, full_answer text, version int,
              updated_at
rehearsals:   id, question_id fk, practiced_at, duration_sec int, self_score int (1..5), notes text
```

## API sketch

```
GET  /phases                      POST /goals/:id/progress
GET  /routine/today (tasks + streak)  PUT|DELETE /routine/today/checks/:taskId
GET  /decks   GET|POST /decks/:id/cards   PATCH|DELETE /cards/:id
GET  /reviews/due?deckId=&limit=   POST /cards/:id/review { grade }
GET|POST /interview/questions?stage=   GET|PATCH|DELETE /interview/questions/:id
PUT  /interview/questions/:id/answer (saves a new version)   POST /interview/questions/:id/rehearsals
```

## Delivery plan

1. Scaffold monorepo, Docker Postgres, Drizzle schema + first migration, seed from the study plan, CI.
2. Phases & goals + daily routine/streak.
3. Flashcards with SM-2 review screen.
4. Interview bank with STAR editor and rehearsal timer.
