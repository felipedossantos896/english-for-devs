import { answerLengthFeedback, formatDuration, type InterviewQuestionDetailDto } from '@efd/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
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
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
        <p className="font-mono text-4xl">{formatDuration(elapsed)}</p>
        {!finished && startedAt === null && (
          <button
            type="button"
            onClick={() => setStartedAt(Date.now())}
            className="mt-4 rounded-md bg-indigo-600 px-6 py-2 font-medium text-white"
          >
            Start answering out loud
          </button>
        )}
        {startedAt !== null && !finished && (
          <button
            type="button"
            onClick={() => {
              setStartedAt(null);
              setFinished(true);
            }}
            className="mt-4 rounded-md bg-slate-800 px-6 py-2 font-medium text-white"
          >
            Stop
          </button>
        )}
        {finished && <p className="mt-2 text-sm text-slate-600">{feedbackText[answerLengthFeedback(elapsed)]}</p>}
      </div>

      {finished && (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium">How did it go?</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setScore(n)}
                className={`size-10 rounded-md border text-sm ${score === n ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}
              >
                {n}
              </button>
            ))}
          </div>
          <textarea
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            rows={2}
            placeholder="Notes: words you got stuck on, what to improve..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={score === null || save.isPending}
              onClick={() => save.mutate()}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Save practice
            </button>
            <button type="button" onClick={reset} className="px-4 py-2 text-sm text-slate-500">
              Discard
            </button>
          </div>
          {save.error && <p className="text-sm text-red-600">Could not save: {save.error.message}</p>}
        </div>
      )}

      {answerText && (
        <div>
          <button type="button" onClick={() => setPeek(!peek)} className="text-sm text-indigo-600">
            {peek ? 'Hide my answer' : 'Peek at my answer'}
          </button>
          {peek && <p className="mt-2 whitespace-pre-line rounded-lg bg-slate-100 p-4 text-sm">{answerText}</p>}
        </div>
      )}

      {question.rehearsals.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium">Recent practice</h3>
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white text-sm">
            {question.rehearsals.map((r) => (
              <li key={r.id} className="flex gap-4 px-4 py-2">
                <span className="text-slate-500">{new Date(r.practicedAt).toLocaleDateString('en-US')}</span>
                <span>{formatDuration(r.durationSec)}</span>
                <span>★ {r.selfScore}</span>
                {r.notes && <span className="flex-1 truncate text-slate-500">{r.notes}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
