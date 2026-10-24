import { interviewStages, stageLabels, type InterviewStage } from '@efd/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Badge,
  Button,
  Card,
  ChipGroup,
  EmptyState,
  ErrorState,
  Field,
  Heading,
  Input,
  ListCard,
  LoadingState,
  PageHeader,
  Select,
  type ChipOption,
} from '../../components/ui';
import { interviewApi } from './api';

const stageFilters: ChipOption<InterviewStage | 'all'>[] = [
  { value: 'all', label: 'All' },
  ...interviewStages.map((s) => ({ value: s, label: stageLabels[s] })),
];

export function InterviewPage() {
  const [params, setParams] = useSearchParams();
  const stage = (params.get('stage') as InterviewStage | null) ?? undefined;
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: ['interview', 'list', stage ?? 'all'],
    queryFn: () => interviewApi.list(stage),
  });

  const [newQuestion, setNewQuestion] = useState('');
  const [newStage, setNewStage] = useState<InterviewStage>('behavioral');

  const create = useMutation({
    mutationFn: () => interviewApi.create({ stage: newStage, question: newQuestion }),
    onSuccess: () => {
      setNewQuestion('');
      void queryClient.invalidateQueries({ queryKey: ['interview', 'list'] });
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    create.mutate();
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Interview prep"
        title="Interview bank"
        description="Write your answers with STAR, then practice them out loud."
      />

      <ChipGroup
        label="Filter by stage"
        options={stageFilters}
        value={stage ?? 'all'}
        onChange={(v) => setParams(v === 'all' ? {} : { stage: v })}
      />

      {isPending && <LoadingState />}
      {error && <ErrorState title="Could not load questions" error={error} />}

      {data &&
        (data.length === 0 ? (
          <EmptyState icon="💬" title="No questions yet" />
        ) : (
          <ListCard>
            {data.map((q) => (
              <li key={q.id}>
                <Link
                  to={`/interview/${q.id}`}
                  className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-primary-soft sm:flex-row sm:items-center sm:gap-4"
                >
                  <Badge tone="primary" className="w-fit sm:w-32 sm:justify-center">
                    {stageLabels[q.stage]}
                  </Badge>
                  <span className="flex-1 font-medium">{q.question}</span>
                  <span className="flex shrink-0 flex-wrap gap-2">
                    {q.hasAnswer ? <Badge tone="success">✓ Answer</Badge> : <Badge>No answer</Badge>}
                    <Badge>
                      {q.rehearsalCount} {q.rehearsalCount === 1 ? 'practice' : 'practices'}
                    </Badge>
                    {q.averageScore !== null && <Badge tone="accent">★ {q.averageScore.toFixed(1)}</Badge>}
                  </span>
                </Link>
              </li>
            ))}
          </ListCard>
        ))}

      <Card as="form" onSubmit={onSubmit} className="space-y-4">
        <Heading level={2}>Add a question</Heading>
        <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
          <Field label="Stage">
            {(props) => (
              <Select {...props} value={newStage} onChange={(e) => setNewStage(e.target.value as InterviewStage)}>
                {interviewStages.map((s) => (
                  <option key={s} value={s}>
                    {stageLabels[s]}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Question">
            {(props) => (
              <Input
                {...props}
                placeholder="A question you might be asked"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                required
              />
            )}
          </Field>
        </div>
        <Button type="submit" loading={create.isPending} loadingText="Adding...">
          Add question
        </Button>
        {create.error && <Alert tone="danger">Could not save: {create.error.message}</Alert>}
      </Card>
    </section>
  );
}
