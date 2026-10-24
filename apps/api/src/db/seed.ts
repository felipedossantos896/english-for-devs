import { eq } from 'drizzle-orm';
import { db, pool } from './client.js';
import { cards, decks, goals, interviewQuestions, phases, routineTasks, users } from './schema.js';
import { starterCards } from './starter-cards.js';
import { starterQuestions } from './starter-questions.js';

async function seed() {
  const [user] = await db
    .insert(users)
    .values({ name: 'Felipe', email: 'me@example.com' })
    .onConflictDoNothing()
    .returning();
  if (!user) {
    console.log('Already seeded, skipping.');
    return;
  }

  const phaseRows = await db
    .insert(phases)
    .values([
      { userId: user.id, title: 'Foundations', cefrLevel: 'A1', position: 1, status: 'active', startedAt: new Date() },
      { userId: user.id, title: 'Everyday dev English', cefrLevel: 'A2', position: 2 },
      { userId: user.id, title: 'Talking about your work', cefrLevel: 'B1', position: 3 },
      { userId: user.id, title: 'Interview ready', cefrLevel: 'B2', position: 4 },
    ])
    .returning();

  await db.insert(goals).values([
    { phaseId: phaseRows[0]!.id, title: 'Learn the 500 most common words', targetValue: 500, unit: 'cards' },
    { phaseId: phaseRows[0]!.id, title: 'Record a 1-minute self introduction', targetValue: 1, unit: 'recordings' },
    { phaseId: phaseRows[1]!.id, title: 'Read 20 technical articles', targetValue: 20, unit: 'articles' },
    { phaseId: phaseRows[2]!.id, title: 'Explain 5 past projects out loud', targetValue: 5, unit: 'projects' },
    { phaseId: phaseRows[3]!.id, title: 'Complete 10 mock interviews', targetValue: 10, unit: 'mock_interviews' },
  ]);

  await db.insert(routineTasks).values([
    { userId: user.id, title: 'Flashcard review', minutes: 15, position: 1 },
    { userId: user.id, title: 'Listening (podcast or video)', minutes: 20, position: 2 },
    { userId: user.id, title: 'Speaking practice (shadowing)', minutes: 15, position: 3 },
    { userId: user.id, title: 'Rehearse one interview answer', minutes: 10, position: 4 },
  ]);

  await db.insert(decks).values([
    { userId: user.id, name: 'Core vocabulary', layer: 'vocabulary', position: 1 },
    { userId: user.id, name: 'Useful phrases', layer: 'phrases', position: 2 },
    { userId: user.id, name: 'Tech terms', layer: 'tech', position: 3 },
    { userId: user.id, name: 'Interview expressions', layer: 'interview', position: 4 },
  ]);

  console.log('Seed complete.');
}

/** Fills empty decks with starter cards. Safe to run on an already seeded database. */
async function seedCards() {
  for (const deck of await db.select().from(decks)) {
    const [existing] = await db
      .select({ id: cards.id })
      .from(cards)
      .where(eq(cards.deckId, deck.id))
      .limit(1);
    if (existing) continue;

    const starter = starterCards[deck.layer];
    await db.insert(cards).values(starter.map((card) => ({ deckId: deck.id, ...card })));
    console.log(`Added ${starter.length} cards to "${deck.name}".`);
  }
}

/** Adds starter interview questions the user does not have yet, matched by text. */
async function seedQuestions() {
  for (const user of await db.select().from(users)) {
    const existing = await db
      .select({ question: interviewQuestions.question })
      .from(interviewQuestions)
      .where(eq(interviewQuestions.userId, user.id));
    const known = new Set(existing.map((q) => q.question));

    const missing = starterQuestions.filter((q) => !known.has(q.question));
    if (missing.length === 0) continue;
    await db.insert(interviewQuestions).values(missing.map((q) => ({ userId: user.id, ...q })));
    console.log(`Added ${missing.length} interview questions.`);
  }
}

seed()
  .then(seedCards)
  .then(seedQuestions)
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
