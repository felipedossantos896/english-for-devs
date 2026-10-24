import { composeStarAnswer, type InterviewQuestionDetailDto, type StarParts } from '@efd/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Field } from '@/components/field';
import { SaveError } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { interviewApi } from './api';

// Four small chunks are easier to write and remember than one big answer (Miller's law).
const fields: { key: keyof StarParts; label: string; hint: string }[] = [
  { key: 'situation', label: 'Situation', hint: 'Where were you, and what was going on?' },
  { key: 'task', label: 'Task', hint: 'What were you responsible for?' },
  { key: 'action', label: 'Action', hint: 'What did you do? Use "I", not "we".' },
  { key: 'result', label: 'Result', hint: 'What happened? Use numbers if you can.' },
];

export function StarEditor({ question }: { question: InterviewQuestionDetailDto }) {
  const queryClient = useQueryClient();
  const saved = question.answer;

  const [parts, setParts] = useState<StarParts>({
    situation: saved?.situation ?? '',
    task: saved?.task ?? '',
    action: saved?.action ?? '',
    result: saved?.result ?? '',
  });
  const [fullAnswer, setFullAnswer] = useState(saved?.fullAnswer ?? '');

  const save = useMutation({
    mutationFn: () => interviewApi.saveAnswer(question.id, { ...parts, fullAnswer: fullAnswer || null }),
    onSuccess: (updated) => {
      queryClient.setQueryData(['interview', 'question', question.id], updated);
      void queryClient.invalidateQueries({ queryKey: ['interview', 'list'] });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          {fields.map((f, i) => (
            <Field
              key={f.key}
              label={
                <>
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {i + 1}
                  </span>
                  {f.label}
                </>
              }
              hint={f.hint}
            >
              {(props) => (
                <Textarea
                  {...props}
                  className="min-h-28"
                  value={parts[f.key]}
                  onChange={(e) => setParts({ ...parts, [f.key]: e.target.value })}
                />
              )}
            </Field>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <Field label="Full answer" hint="What you will actually say, in your own words.">
            {(props) => (
              <Textarea {...props} className="min-h-44" value={fullAnswer} onChange={(e) => setFullAnswer(e.target.value)} />
            )}
          </Field>
          <SaveError error={save.error} />
        </CardContent>
        <CardFooter className="flex-wrap gap-3">
          <Button onClick={() => save.mutate()} loading={save.isPending}>
            Save answer
          </Button>
          <Button variant="outline" onClick={() => setFullAnswer(composeStarAnswer(parts))}>
            <Wand2 /> Build from STAR
          </Button>
          {saved && (
            <span className="text-sm text-muted-foreground">
              Version {saved.version}, saved {new Date(saved.updatedAt).toLocaleString('en-US')}
            </span>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
