import { useQuery } from '@tanstack/react-query';
import { Badge, ButtonLink, Card, EmptyState, ErrorState, Eyebrow, Heading, LoadingState, PageHeader } from '../../components/ui';
import { flashcardsApi } from './api';

const layerLabels = {
  vocabulary: 'Vocabulary',
  phrases: 'Phrases',
  tech: 'Tech terms',
  interview: 'Interview',
} as const;

export function DecksPage() {
  const { data, isPending, error } = useQuery({ queryKey: ['decks'], queryFn: flashcardsApi.decks });

  if (isPending) return <LoadingState />;
  if (error) return <ErrorState title="Could not load decks" error={error} />;

  const totalDue = data.reduce((sum, d) => sum + d.due, 0);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Spaced repetition"
        title="Flashcards"
        description={totalDue > 0 ? `${totalDue} cards are waiting for you.` : 'You are all caught up.'}
        actions={
          totalDue > 0 && (
            <ButtonLink to="/cards/review" variant="accent" size="lg">
              Review all ({totalDue})
            </ButtonLink>
          )
        }
      />

      {data.length === 0 ? (
        <EmptyState icon="🗂️" title="No decks yet" />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {data.map((deck) => (
            <Card as="li" key={deck.id} className="flex flex-col">
              <Eyebrow>{layerLabels[deck.layer]}</Eyebrow>
              <Heading level={3} className="mt-1">
                {deck.name}
              </Heading>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone={deck.due > 0 ? 'accent' : 'neutral'}>{deck.due} due</Badge>
                <Badge tone="primary">{deck.fresh} new</Badge>
                <Badge>{deck.total} total</Badge>
              </div>
              <div className="mt-5 flex gap-2 pt-1">
                {deck.due > 0 && (
                  <ButtonLink to={`/cards/review?deckId=${deck.id}`} variant="primary">
                    Review
                  </ButtonLink>
                )}
                <ButtonLink to={`/cards/decks/${deck.id}`} variant={deck.due > 0 ? 'ghost' : 'secondary'}>
                  Manage cards
                </ButtonLink>
              </div>
            </Card>
          ))}
        </ul>
      )}
    </section>
  );
}
