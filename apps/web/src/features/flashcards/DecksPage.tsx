import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState } from '@/components/states';
import { Eyebrow, PageHeader } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
            <Button asChild variant="highlight" size="lg">
              <Link to="/cards/review">Review all ({totalDue})</Link>
            </Button>
          )
        }
      />

      {data.length === 0 ? (
        <EmptyState icon="🗂️" title="No decks yet" />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {data.map((deck) => (
            <li key={deck.id}>
              <Card className="h-full gap-4">
                <CardHeader>
                  <Eyebrow>{layerLabels[deck.layer]}</Eyebrow>
                  <CardTitle>
                    <h2>{deck.name}</h2>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant={deck.due > 0 ? 'highlight' : 'secondary'}>{deck.due} due</Badge>
                  <Badge>{deck.fresh} new</Badge>
                  <Badge variant="secondary">{deck.total} total</Badge>
                </CardContent>
                <CardFooter className="mt-auto gap-2">
                  {deck.due > 0 && (
                    <Button asChild>
                      <Link to={`/cards/review?deckId=${deck.id}`}>Review</Link>
                    </Button>
                  )}
                  <Button asChild variant={deck.due > 0 ? 'ghost' : 'outline'}>
                    <Link to={`/cards/decks/${deck.id}`}>Manage cards</Link>
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
