# English for Devs

A study app to take my English from beginner to passing every stage of an international developer interview.

It tracks four things:

- **Phases & goals**: study phases by CEFR level (A1 → B2) with measurable goals and progress.
- **Daily routine**: daily tasks with check-offs and a Monday–Friday streak (weekends never break it).
- **Flashcards**: spaced repetition (SM-2) with decks grouped by layer: vocabulary, phrases, tech terms and interview expressions.
- **Interview bank**: questions by stage (HR, behavioral, technical, system design, closing) with STAR answers and a rehearsal log.

## Stack

React, TypeScript, Vite, Tailwind CSS and TanStack Query on the frontend. Node, Fastify, Drizzle ORM and PostgreSQL on the backend. pnpm workspaces, Vitest and GitHub Actions for tooling.

## Getting started

Requirements: Node 22, pnpm 10 and Docker.

```bash
pnpm install
cp .env.example .env
docker compose up -d     # PostgreSQL on localhost:5432
pnpm db:migrate          # apply migrations
pnpm db:seed             # load the initial study plan
pnpm dev                 # api on :3333, web on :5173
```

For production, `pnpm build` bundles the API into `apps/api/dist` (run it with `pnpm --filter @efd/api start`) and the web app into `apps/web/dist`.

## Project structure

```
apps/web         React SPA
apps/api         Fastify REST API + Drizzle schema and migrations
packages/shared  Types and domain logic shared by both (SM-2, streak)
docs/            Architecture notes
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the data model and roadmap.
See [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) for the UI tokens, shadcn/ui components and UX rules (live reference at `/ui`).
