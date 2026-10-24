import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { flashcardsApi } from './api';

export function DeckPage() {
  const { deckId = '' } = useParams();
  const queryClient = useQueryClient();
  const { data, isPending, error } = useQuery({
    queryKey: ['cards', deckId],
    queryFn: () => flashcardsApi.cards(deckId),
  });

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [example, setExample] = useState('');

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['cards', deckId] });
    void queryClient.invalidateQueries({ queryKey: ['decks'] });
  };

  const create = useMutation({
    mutationFn: () => flashcardsApi.createCard(deckId, { front, back, example: example || null }),
    onSuccess: () => {
      setFront('');
      setBack('');
      setExample('');
      invalidate();
    },
  });

  const remove = useMutation({ mutationFn: flashcardsApi.deleteCard, onSuccess: invalidate });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    create.mutate();
  };

  if (isPending) return <p className="text-slate-500">Loading...</p>;
  if (error) return <p className="text-red-600">Could not load cards: {error.message}</p>;

  const input = 'w-full rounded-md border border-slate-300 px-3 py-2 text-sm';

  return (
    <section className="space-y-6">
      <Link to="/cards" className="text-sm text-slate-500">
        ← All decks
      </Link>

      <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-semibold">Add a card</h2>
        <input className={input} placeholder="Front (English)" value={front} onChange={(e) => setFront(e.target.value)} required />
        <input className={input} placeholder="Back (meaning)" value={back} onChange={(e) => setBack(e.target.value)} required />
        <input className={input} placeholder="Example sentence (optional)" value={example} onChange={(e) => setExample(e.target.value)} />
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Add card
        </button>
        {create.error && <p className="text-sm text-red-600">Could not save: {create.error.message}</p>}
      </form>

      <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
        {data.map((card) => (
          <li key={card.id} className="flex items-start gap-4 px-4 py-3">
            <div className="flex-1">
              <p className="font-medium">{card.front}</p>
              <p className="text-sm text-slate-600">{card.back}</p>
              {card.example && <p className="text-sm italic text-slate-400">{card.example}</p>}
            </div>
            <span className="text-xs text-slate-400">
              {card.repetitions === 0 ? 'new' : `every ${card.intervalDays}d`}
            </span>
            <button
              type="button"
              onClick={() => remove.mutate(card.id)}
              className="text-xs text-slate-400 hover:text-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
