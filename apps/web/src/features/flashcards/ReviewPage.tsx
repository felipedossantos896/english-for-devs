import { reviewAnswers, type CardDto } from '@efd/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BackLink } from '@/components/back-link';
import { EmptyState, ErrorState, LoadingState, SaveError } from '@/components/states';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

  if (isPending || queue === null) return <LoadingState />;
  if (error) return <ErrorState title="Could not load reviews" error={error} />;

  if (!card) {
    // A clear, positive ending makes the session feel worth coming back to (peak-end rule).
    return (
      <EmptyState icon="🎉" title={reviewed > 0 ? `Done! You reviewed ${reviewed} cards.` : 'Nothing to review right now.'}>
        <Button asChild>
          <Link to="/cards">Back to decks</Link>
        </Button>
      </EmptyState>
    );
  }

  return (
    <section className="mx-auto max-w-xl space-y-5">
      <div className="flex items-center justify-between">
        <BackLink to="/cards">Decks</BackLink>
        <Badge>{queue.length} left</Badge>
      </div>

      <Card className="min-h-64 justify-center py-10">
        <CardContent className="space-y-6 text-center">
          <p className="text-3xl font-semibold text-navy-900">{card.front}</p>
          {revealed && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-xl">{card.back}</p>
                {card.example && <p className="text-muted-foreground italic">{card.example}</p>}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Big, full-width buttons right under the card: short distance, large target (Fitts's law). */}
      {!revealed ? (
        <Button size="lg" className="w-full" onClick={() => setRevealed(true)}>
          Show answer <Kbd>Space</Kbd>
        </Button>
      ) : (
        <div role="group" aria-label="How well did you remember?" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {reviewAnswers.map((option, i) => (
            <Button
              key={option.grade}
              size="lg"
              variant={option.label === 'Good' ? 'default' : 'outline'}
              className={option.label === 'Again' ? 'text-highlight' : undefined}
              disabled={answer.isPending}
              onClick={() => answer.mutate({ card, grade: option.grade })}
            >
              {option.label} <Kbd>{i + 1}</Kbd>
            </Button>
          ))}
        </div>
      )}
      <SaveError error={answer.error} />
    </section>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd aria-hidden className="rounded border border-current/30 px-1.5 font-mono text-xs opacity-70">
      {children}
    </kbd>
  );
}
