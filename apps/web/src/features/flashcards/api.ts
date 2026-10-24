import type { CardDto, DeckDto } from '@efd/shared';
import { api } from '@/lib/api';

export interface CardInput {
  front: string;
  back: string;
  example?: string | null;
}

export const flashcardsApi = {
  decks: () => api<DeckDto[]>('/decks'),
  cards: (deckId: string) => api<CardDto[]>(`/decks/${deckId}/cards`),
  due: (deckId?: string) => api<CardDto[]>(`/reviews/due${deckId ? `?deckId=${deckId}` : ''}`),
  createCard: (deckId: string, input: CardInput) =>
    api<CardDto>(`/decks/${deckId}/cards`, { method: 'POST', body: JSON.stringify(input) }),
  deleteCard: (cardId: string) => api<void>(`/cards/${cardId}`, { method: 'DELETE' }),
  review: (cardId: string, grade: number) =>
    api<CardDto>(`/cards/${cardId}/review`, { method: 'POST', body: JSON.stringify({ grade }) }),
};
