import { composeStarAnswer, type InterviewQuestionDetailDto, type StarParts } from '@efd/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert, Button, Card, Field, Text, Textarea } from '../../components/ui';
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
      <Card className="grid gap-5 sm:grid-cols-2">
        {fields.map((f, i) => (
          <Field
            key={f.key}
            label={
              <>
                <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                  {i + 1}
                </span>
                {f.label}
              </>
            }
            hint={f.hint}
          >
            {(props) => (
              <Textarea {...props} rows={4} value={parts[f.key]} onChange={(e) => setParts({ ...parts, [f.key]: e.target.value })} />
            )}
          </Field>
        ))}
      </Card>

      <Card className="space-y-4">
        <Field label="Full answer" hint="What you will actually say, in your own words.">
          {(props) => <Textarea {...props} rows={7} value={fullAnswer} onChange={(e) => setFullAnswer(e.target.value)} />}
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => save.mutate()} loading={save.isPending} loadingText="Saving...">
            Save answer
          </Button>
          <Button variant="secondary" onClick={() => setFullAnswer(composeStarAnswer(parts))}>
            Build from STAR
          </Button>
          {saved && (
            <Text as="span" size="sm" tone="muted">
              Version {saved.version}, saved {new Date(saved.updatedAt).toLocaleString('en-US')}
            </Text>
          )}
        </div>
        {save.error && <Alert tone="danger">Could not save: {save.error.message}</Alert>}
      </Card>
    </div>
  );
}
