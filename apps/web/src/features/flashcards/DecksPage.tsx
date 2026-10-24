import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { flashcardsApi } from './api';

const layerLabels = {
  vocabulary: 'Vocabulary',
  phrases: 'Phrases',
  tech: 'Tech terms',
  interview: 'Interview',
} as const;

export function DecksPage() {
  const { data, isPending, error } = useQuery({ queryKey: ['decks'], queryFn: flashcardsApi.decks });

  if (isPending) return <p className="text-slate-500">Loading...</p>;
  if (error) return <p className="text-red-600">Could not load decks: {error.message}</p>;

  const totalDue = data.reduce((sum, d) => sum + d.due, 0);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Flashcards</h2>
        {totalDue > 0 && (
          <Link to="/cards/review" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
            Review all ({totalDue})
          </Link>
        )}
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {data.map((deck) => (
          <li key={deck.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">{layerLabels[deck.layer]}</p>
            <h3 className="mt-1 font-medium">{deck.name}</h3>
            <p className="mt-2 text-sm text-slate-500">
              {deck.due} due · {deck.fresh} new · {deck.total} total
            </p>
            <div className="mt-3 flex gap-3 text-sm">
              {deck.due > 0 && (
                <Link to={`/cards/review?deckId=${deck.id}`} className="font-medium text-indigo-600">
                  Review
                </Link>
              )}
              <Link to={`/cards/decks/${deck.id}`} className="text-slate-600">
                Manage cards
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
