import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  BackLink,
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Field,
  Heading,
  Input,
  ListCard,
  LoadingState,
  Text,
} from '../../components/ui';
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

      <Card as="form" onSubmit={onSubmit} className="space-y-4">
        <Heading level={2}>Add a card</Heading>
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
        <Button type="submit" loading={create.isPending} loadingText="Adding...">
          Add card
        </Button>
        {create.error && <Alert tone="danger">Could not save: {create.error.message}</Alert>}
      </Card>

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
                <Badge tone={card.repetitions === 0 ? 'primary' : 'neutral'}>
                  {card.repetitions === 0 ? 'new' : `every ${card.intervalDays}d`}
                </Badge>
                <Button
                  variant="danger"
                  size="sm"
                  aria-label={`Delete card ${card.front}`}
                  disabled={remove.isPending}
                  onClick={() => remove.mutate(card.id)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ListCard>
        )}
      </div>
    </section>
  );
}
