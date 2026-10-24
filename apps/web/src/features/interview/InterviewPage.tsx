import { interviewStages, stageLabels, type InterviewStage } from '@efd/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Check, Star } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Field } from '@/components/field';
import { ListCard } from '@/components/list-card';
import { EmptyState, ErrorState, LoadingState, SaveError } from '@/components/states';
import { PageHeader } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { interviewApi } from './api';

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

      <ToggleGroup
        type="single"
        aria-label="Filter by stage"
        value={stage ?? 'all'}
        // Radix lets a single toggle be switched off; ignore that so one filter is always active.
        onValueChange={(v) => v && setParams(v === 'all' ? {} : { stage: v })}
      >
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        {interviewStages.map((s) => (
          <ToggleGroupItem key={s} value={s}>
            {stageLabels[s]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

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
                  className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-accent sm:flex-row sm:items-center sm:gap-4"
                >
                  <Badge className="sm:w-32">{stageLabels[q.stage]}</Badge>
                  <span className="flex-1 font-medium">{q.question}</span>
                  <span className="flex shrink-0 flex-wrap gap-2">
                    {q.hasAnswer ? (
                      <Badge variant="success">
                        <Check /> Answer
                      </Badge>
                    ) : (
                      <Badge variant="secondary">No answer</Badge>
                    )}
                    <Badge variant="secondary">
                      {q.rehearsalCount} {q.rehearsalCount === 1 ? 'practice' : 'practices'}
                    </Badge>
                    {q.averageScore !== null && (
                      <Badge variant="highlight">
                        <Star /> {q.averageScore.toFixed(1)}
                      </Badge>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ListCard>
        ))}

      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>
              <h2 className="text-lg">Add a question</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
              <Field label="Stage">
                {(props) => (
                  <Select value={newStage} onValueChange={(v) => setNewStage(v as InterviewStage)}>
                    <SelectTrigger {...props}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {interviewStages.map((s) => (
                        <SelectItem key={s} value={s}>
                          {stageLabels[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
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
            <SaveError error={create.error} />
          </CardContent>
          <CardFooter>
            <Button type="submit" loading={create.isPending}>
              Add question
            </Button>
          </CardFooter>
        </Card>
      </form>
    </section>
  );
}
