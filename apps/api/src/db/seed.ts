import { eq } from 'drizzle-orm';
import { db, pool } from './client.js';
import { cards, decks, goals, interviewQuestions, phases, routineTasks, users } from './schema.js';
import { starterCards } from './starter-cards.js';

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

  await db.insert(interviewQuestions).values([
    { userId: user.id, stage: 'hr', question: 'Tell me about yourself.' },
    { userId: user.id, stage: 'hr', question: 'Why do you want to work here?' },
    { userId: user.id, stage: 'behavioral', question: 'Tell me about a time you disagreed with a teammate.' },
    { userId: user.id, stage: 'behavioral', question: 'Describe a project you are proud of.' },
    { userId: user.id, stage: 'technical', question: 'Walk me through how you would debug a slow API endpoint.' },
    { userId: user.id, stage: 'closing', question: 'Do you have any questions for us?' },
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

seed()
  .then(seedCards)
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
