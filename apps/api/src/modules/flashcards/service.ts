import { scheduleReview, type CardDto, type DeckDto, type Grade } from '@efd/shared';
import * as repo from './repository.js';

export class NotFoundError extends Error {}

const toDto = (card: repo.Card): CardDto => ({
  id: card.id,
  deckId: card.deckId,
  front: card.front,
  back: card.back,
  example: card.example,
  intervalDays: card.intervalDays,
  repetitions: card.repetitions,
  dueAt: card.dueAt.toISOString(),
});

export function listDecks(userId: string): Promise<DeckDto[]> {
  return repo.findDecksWithCounts(userId, new Date());
}

async function requireDeck(userId: string, deckId: string) {
  const deck = await repo.findDeck(userId, deckId);
  if (!deck) throw new NotFoundError('Deck not found');
  return deck;
}

async function requireCard(userId: string, cardId: string) {
  const card = await repo.findCard(userId, cardId);
  if (!card) throw new NotFoundError('Card not found');
  return card;
}

export async function listCards(userId: string, deckId: string) {
  await requireDeck(userId, deckId);
  return (await repo.findCards(deckId)).map(toDto);
}

export async function createCard(userId: string, deckId: string, input: repo.CardInput) {
  await requireDeck(userId, deckId);
  return toDto(await repo.insertCard(deckId, input));
}

export async function editCard(userId: string, cardId: string, input: Partial<repo.CardInput>) {
  await requireCard(userId, cardId);
  return toDto(await repo.updateCard(cardId, input));
}

export async function removeCard(userId: string, cardId: string) {
  await requireCard(userId, cardId);
  await repo.deleteCard(cardId);
}

export async function dueCards(userId: string, limit: number, deckId?: string) {
  if (deckId) await requireDeck(userId, deckId);
  return (await repo.findDueCards(userId, new Date(), limit, deckId)).map(toDto);
}

export async function reviewCard(userId: string, cardId: string, grade: Grade) {
  const card = await requireCard(userId, cardId);
  return toDto(await repo.saveReview(card, grade, scheduleReview(card, grade)));
}
