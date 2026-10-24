import { answerLengthFeedback, formatDuration, type InterviewQuestionDetailDto } from '@efd/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Field, Heading, ListCard, Text, Textarea } from '../../components/ui';
import { cn } from '../../lib/cn';
import { interviewApi } from './api';

const feedbackText = {
  too_short: 'A bit short. Try adding more detail to the Action and Result.',
  good: 'Good length.',
  too_long: 'A bit long. Try to keep it under 3 minutes.',
} as const;

export function PracticePanel({ question }: { question: InterviewQuestionDetailDto }) {
  const queryClient = useQueryClient();
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [peek, setPeek] = useState(false);

  useEffect(() => {
    if (startedAt === null) return;
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 250);
    return () => clearInterval(timer);
  }, [startedAt]);

  const reset = () => {
    setStartedAt(null);
    setElapsed(0);
    setFinished(false);
    setScore(null);
    setNotes('');
  };

  const save = useMutation({
    mutationFn: () =>
      interviewApi.addRehearsal(question.id, {
        durationSec: Math.max(elapsed, 1),
        selfScore: score!,
        notes: notes || null,
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(['interview', 'question', question.id], updated);
      void queryClient.invalidateQueries({ queryKey: ['interview', 'list'] });
      reset();
    },
  });

  const answerText = question.answer?.fullAnswer;

  return (
    <div className="space-y-5">
      <Card padding="lg" className="space-y-4 text-center">
        <p
          role="timer"
          aria-label="Elapsed time"
          className={cn('font-mono text-5xl font-medium tabular-nums', startedAt !== null ? 'text-accent' : 'text-navy-900')}
        >
          {formatDuration(elapsed)}
        </p>
        {!finished && startedAt === null && (
          <Button size="lg" onClick={() => setStartedAt(Date.now())}>
            ▶ Start answering out loud
          </Button>
        )}
        {startedAt !== null && !finished && (
          <Button
            size="lg"
            variant="accent"
            onClick={() => {
              setStartedAt(null);
              setFinished(true);
            }}
          >
            ■ Stop
          </Button>
        )}
        {finished && (
          <Alert tone={answerLengthFeedback(elapsed) === 'good' ? 'success' : 'info'}>
            {feedbackText[answerLengthFeedback(elapsed)]}
          </Alert>
        )}
      </Card>

      {finished && (
        <Card className="space-y-4">
          <div className="space-y-2">
            <Text size="sm" className="font-semibold" id="score-label">
              How did it go?
            </Text>
            <div role="radiogroup" aria-labelledby="score-label" className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={score === n}
                  onClick={() => setScore(n)}
                  className={cn(
                    'size-11 rounded-control border text-sm font-semibold transition-colors',
                    score === n
                      ? 'border-primary bg-primary text-white'
                      : 'border-border-strong bg-surface hover:border-navy-300 hover:bg-primary-soft',
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <Field label="Notes" hint="Words you got stuck on, what to improve...">
            {(props) => <Textarea {...props} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />}
          </Field>
          <div className="flex gap-2">
            <Button disabled={score === null} loading={save.isPending} loadingText="Saving..." onClick={() => save.mutate()}>
              Save practice
            </Button>
            <Button variant="ghost" onClick={reset}>
              Discard
            </Button>
          </div>
          {save.error && <Alert tone="danger">Could not save: {save.error.message}</Alert>}
        </Card>
      )}

      {answerText && (
        <div className="space-y-2">
          <Button variant="ghost" size="sm" aria-expanded={peek} onClick={() => setPeek(!peek)}>
            {peek ? 'Hide my answer' : 'Peek at my answer'}
          </Button>
          {peek && (
            <Card className="bg-primary-soft text-sm leading-relaxed whitespace-pre-line">{answerText}</Card>
          )}
        </div>
      )}

      {question.rehearsals.length > 0 && (
        <div className="space-y-3">
          <Heading level={3} as="h2">
            Recent practice
          </Heading>
          <ListCard className="text-sm">
            {question.rehearsals.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-4 px-5 py-3">
                <span className="text-fg-muted">{new Date(r.practicedAt).toLocaleDateString('en-US')}</span>
                <span className="font-mono tabular-nums">{formatDuration(r.durationSec)}</span>
                <Badge tone="accent">★ {r.selfScore}</Badge>
                {r.notes && <span className="min-w-0 flex-1 truncate text-fg-muted">{r.notes}</span>}
              </li>
            ))}
          </ListCard>
        </div>
      )}
    </div>
  );
}
