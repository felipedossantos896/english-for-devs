import { reviewAnswers, type CardDto } from '@efd/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { flashcardsApi } from './api';

export function ReviewPage() {
  const [params] = useSearchParams();
  const deckId = params.get('deckId') ?? undefined;
  const queryClient = useQueryClient();

  // Load the queue once per session; answered cards are dropped locally.
  const { data, isPending, error } = useQuery({
    queryKey: ['due', deckId ?? 'all'],
    queryFn: () => flashcardsApi.due(deckId),
    staleTime: Infinity,
    gcTime: 0,
  });

  const [queue, setQueue] = useState<CardDto[] | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  useEffect(() => {
    if (data && queue === null) setQueue(data);
  }, [data, queue]);

  const answer = useMutation({
    mutationFn: ({ card, grade }: { card: CardDto; grade: number }) => flashcardsApi.review(card.id, grade),
    onSuccess: (_, { card, grade }) => {
      setRevealed(false);
      setReviewed((n) => n + 1);
      // A failed card goes to the back of the queue so it is seen again this session.
      setQueue((q) => {
        const rest = (q ?? []).slice(1);
        return grade < 3 ? [...rest, card] : rest;
      });
      void queryClient.invalidateQueries({ queryKey: ['decks'] });
    },
  });

  const card = queue?.[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!card || answer.isPending) return;
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      const option = revealed ? reviewAnswers[Number(e.key) - 1] : undefined;
      if (option) answer.mutate({ card, grade: option.grade });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card, revealed, answer]);

  if (isPending || queue === null) return <p className="text-slate-500">Loading...</p>;
  if (error) return <p className="text-red-600">Could not load reviews: {error.message}</p>;

  if (!card) {
    return (
      <section className="space-y-4 text-center">
        <p className="text-4xl">🎉</p>
        <h2 className="text-lg font-semibold">
          {reviewed > 0 ? `Done! You reviewed ${reviewed} cards.` : 'Nothing to review right now.'}
        </h2>
        <Link to="/cards" className="text-sm font-medium text-indigo-600">
          Back to decks
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl space-y-4">
      <div className="flex justify-between text-sm text-slate-500">
        <Link to="/cards">← Decks</Link>
        <span>{queue.length} left</span>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
        <p className="text-2xl font-medium">{card.front}</p>
        {revealed && (
          <div className="mt-6 space-y-2 border-t border-slate-100 pt-6">
            <p className="text-lg text-slate-700">{card.back}</p>
            {card.example && <p className="italic text-slate-500">{card.example}</p>}
          </div>
        )}
      </div>

      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="w-full rounded-md bg-indigo-600 py-3 font-medium text-white"
        >
          Show answer <span className="text-indigo-200">(space)</span>
        </button>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {reviewAnswers.map((option, i) => (
            <button
              key={option.grade}
              type="button"
              disabled={answer.isPending}
              onClick={() => answer.mutate({ card, grade: option.grade })}
              className="rounded-md border border-slate-300 bg-white py-3 text-sm font-medium disabled:opacity-50"
            >
              {option.label} <span className="text-slate-400">({i + 1})</span>
            </button>
          ))}
        </div>
      )}
      {answer.error && <p className="text-sm text-red-600">Could not save: {answer.error.message}</p>}
    </section>
  );
}
