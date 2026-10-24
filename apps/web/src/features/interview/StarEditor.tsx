import { composeStarAnswer, type InterviewQuestionDetailDto, type StarParts } from '@efd/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { interviewApi } from './api';

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
    <div className="space-y-4">
      {fields.map((f) => (
        <label key={f.key} className="block">
          <span className="text-sm font-medium">{f.label}</span>
          <span className="ml-2 text-xs text-slate-500">{f.hint}</span>
          <textarea
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            rows={3}
            value={parts[f.key]}
            onChange={(e) => setParts({ ...parts, [f.key]: e.target.value })}
          />
        </label>
      ))}

      <label className="block">
        <span className="text-sm font-medium">Full answer</span>
        <span className="ml-2 text-xs text-slate-500">What you will actually say, in your own words.</span>
        <textarea
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={6}
          value={fullAnswer}
          onChange={(e) => setFullAnswer(e.target.value)}
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setFullAnswer(composeStarAnswer(parts))}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm"
        >
          Build from STAR
        </button>
        <button
          type="button"
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Save answer
        </button>
        {saved && (
          <span className="text-xs text-slate-500">
            Version {saved.version}, saved {new Date(saved.updatedAt).toLocaleString('en-US')}
          </span>
        )}
      </div>
      {save.error && <p className="text-sm text-red-600">Could not save: {save.error.message}</p>}
    </div>
  );
}
