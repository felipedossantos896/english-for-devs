import { and, asc, eq, lte, sql } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { cards, decks, reviews } from '../../db/schema.js';

export type Card = typeof cards.$inferSelect;
export type CardInput = Pick<typeof cards.$inferInsert, 'front' | 'back' | 'example'>;

export function findDecksWithCounts(userId: string, now: Date) {
  return db
    .select({
      id: decks.id,
      name: decks.name,
      layer: decks.layer,
      total: sql<number>`count(${cards.id})::int`,
      due: sql<number>`count(${cards.id}) filter (where ${cards.dueAt} <= ${now})::int`,
      fresh: sql<number>`count(${cards.id}) filter (where ${cards.repetitions} = 0 and ${cards.intervalDays} = 0)::int`,
    })
    .from(decks)
    .leftJoin(cards, eq(cards.deckId, decks.id))
    .where(eq(decks.userId, userId))
    .groupBy(decks.id)
    .orderBy(asc(decks.position));
}

export async function findDeck(userId: string, deckId: string) {
  const [deck] = await db
    .select()
    .from(decks)
    .where(and(eq(decks.id, deckId), eq(decks.userId, userId)));
  return deck;
}

export function findCards(deckId: string) {
  return db.select().from(cards).where(eq(cards.deckId, deckId)).orderBy(asc(cards.createdAt));
}

/** A card, only if it belongs to one of the user's decks. */
export async function findCard(userId: string, cardId: string) {
  const [row] = await db
    .select({ card: cards })
    .from(cards)
    .innerJoin(decks, eq(decks.id, cards.deckId))
    .where(and(eq(cards.id, cardId), eq(decks.userId, userId)));
  return row?.card;
}

export function findDueCards(userId: string, now: Date, limit: number, deckId?: string) {
  return db
    .select({ card: cards })
    .from(cards)
    .innerJoin(decks, eq(decks.id, cards.deckId))
    .where(
      and(eq(decks.userId, userId), lte(cards.dueAt, now), deckId ? eq(cards.deckId, deckId) : undefined),
    )
    .orderBy(asc(cards.dueAt))
    .limit(limit)
    .then((rows) => rows.map((r) => r.card));
}

export async function insertCard(deckId: string, input: CardInput) {
  const [card] = await db
    .insert(cards)
    .values({ deckId, ...input })
    .returning();
  return card!;
}

export async function updateCard(cardId: string, input: Partial<CardInput>) {
  const [card] = await db.update(cards).set(input).where(eq(cards.id, cardId)).returning();
  return card!;
}

export async function deleteCard(cardId: string) {
  await db.delete(cards).where(eq(cards.id, cardId));
}

export function saveReview(
  card: Card,
  grade: number,
  next: Pick<Card, 'easeFactor' | 'intervalDays' | 'repetitions' | 'dueAt'>,
) {
  return db.transaction(async (tx) => {
    await tx.insert(reviews).values({
      cardId: card.id,
      grade,
      prevInterval: card.intervalDays,
      newInterval: next.intervalDays,
    });
    const [updated] = await tx.update(cards).set(next).where(eq(cards.id, card.id)).returning();
    return updated!;
  });
}
