import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { BackLink } from '@/components/back-link';
import { Field } from '@/components/field';
import { ListCard } from '@/components/list-card';
import { EmptyState, ErrorState, LoadingState, SaveError } from '@/components/states';
import { Heading, Text } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

  if (isPending) return <LoadingState />;
  if (error) return <ErrorState title="Could not load cards" error={error} />;

  return (
    <section className="space-y-6">
      <BackLink to="/cards">All decks</BackLink>

      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>
              <h2 className="text-lg">Add a card</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Front" hint="The English word or phrase.">
                {(props) => <Input {...props} value={front} onChange={(e) => setFront(e.target.value)} required />}
              </Field>
              <Field label="Back" hint="What it means.">
                {(props) => <Input {...props} value={back} onChange={(e) => setBack(e.target.value)} required />}
              </Field>
            </div>
            <Field label="Example sentence" hint="Optional. A sentence you could say at work.">
              {(props) => <Input {...props} value={example} onChange={(e) => setExample(e.target.value)} />}
            </Field>
            <SaveError error={create.error} />
          </CardContent>
          <CardFooter>
            <Button type="submit" loading={create.isPending}>
              Add card
            </Button>
          </CardFooter>
        </Card>
      </form>

      <div className="space-y-3">
        <Heading level={2}>Cards ({data.length})</Heading>
        {data.length === 0 ? (
          <EmptyState icon="✍️" title="This deck is empty">
            <Text tone="muted" size="sm">
              Add your first card above.
            </Text>
          </EmptyState>
        ) : (
          <ListCard>
            {data.map((card) => (
              <li key={card.id} className="flex items-start gap-4 px-5 py-4">
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="font-semibold">{card.front}</p>
                  <Text size="sm" tone="muted">
                    {card.back}
                  </Text>
                  {card.example && (
                    <Text size="sm" tone="subtle" className="italic">
                      {card.example}
                    </Text>
                  )}
                </div>
                <Badge variant={card.repetitions === 0 ? 'default' : 'secondary'}>
                  {card.repetitions === 0 ? 'new' : `every ${card.intervalDays}d`}
                </Badge>
                <Button
                  variant="destructive"
                  size="sm"
                  aria-label={`Delete card ${card.front}`}
                  disabled={remove.isPending}
                  onClick={() => remove.mutate(card.id)}
                >
                  <Trash2 /> Delete
                </Button>
              </li>
            ))}
          </ListCard>
        )}
      </div>
    </section>
  );
}
