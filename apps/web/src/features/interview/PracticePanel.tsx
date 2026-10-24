import { answerLengthFeedback, formatDuration, type InterviewQuestionDetailDto } from '@efd/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Eye, EyeOff, Mic, Square, Star } from 'lucide-react';
import { Field } from '@/components/field';
import { ListCard } from '@/components/list-card';
import { SaveError } from '@/components/states';
import { Heading } from '@/components/typography';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
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
      <Card className="items-center py-8 text-center">
        <p
          role="timer"
          aria-label="Elapsed time"
          className={cn('font-mono text-5xl font-medium tabular-nums', startedAt !== null ? 'text-highlight' : 'text-navy-900')}
        >
          {formatDuration(elapsed)}
        </p>
        {!finished && startedAt === null && (
          <Button size="lg" onClick={() => setStartedAt(Date.now())}>
            <Mic /> Start answering out loud
          </Button>
        )}
        {startedAt !== null && !finished && (
          <Button
            size="lg"
            variant="highlight"
            onClick={() => {
              setStartedAt(null);
              setFinished(true);
            }}
          >
            <Square /> Stop
          </Button>
        )}
        {finished && (
          <Alert variant={answerLengthFeedback(elapsed) === 'good' ? 'success' : 'default'} className="mx-6 w-auto">
            <AlertDescription>{feedbackText[answerLengthFeedback(elapsed)]}</AlertDescription>
          </Alert>
        )}
      </Card>

      {finished && (
        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p id="score-label" className="text-sm font-semibold">
                How did it go?
              </p>
              <ToggleGroup
                type="single"
                variant="square"
                aria-labelledby="score-label"
                value={score === null ? '' : String(score)}
                onValueChange={(v) => setScore(v ? Number(v) : null)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <ToggleGroupItem key={n} value={String(n)}>
                    {n}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            <Field label="Notes" hint="Words you got stuck on, what to improve...">
              {(props) => <Textarea {...props} value={notes} onChange={(e) => setNotes(e.target.value)} />}
            </Field>
            <SaveError error={save.error} />
          </CardContent>
          <CardFooter className="gap-2">
            <Button disabled={score === null} loading={save.isPending} onClick={() => save.mutate()}>
              Save practice
            </Button>
            <Button variant="ghost" onClick={reset}>
              Discard
            </Button>
          </CardFooter>
        </Card>
      )}

      {answerText && (
        <div className="space-y-2">
          <Button variant="ghost" size="sm" aria-expanded={peek} onClick={() => setPeek(!peek)}>
            {peek ? <EyeOff /> : <Eye />}
            {peek ? 'Hide my answer' : 'Peek at my answer'}
          </Button>
          {peek && <p className="rounded-xl bg-accent p-5 text-sm leading-relaxed whitespace-pre-line">{answerText}</p>}
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
                <span className="text-muted-foreground">{new Date(r.practicedAt).toLocaleDateString('en-US')}</span>
                <span className="font-mono tabular-nums">{formatDuration(r.durationSec)}</span>
                <Badge variant="highlight">
                  <Star /> {r.selfScore}
                </Badge>
                {r.notes && <span className="min-w-0 flex-1 truncate text-muted-foreground">{r.notes}</span>}
              </li>
            ))}
          </ListCard>
        </div>
      )}
    </div>
  );
}
