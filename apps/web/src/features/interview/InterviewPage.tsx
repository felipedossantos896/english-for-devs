import { interviewStages, stageLabels, type InterviewStage } from '@efd/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1 text-sm ${active ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Interview bank</h2>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={chip(!stage)} onClick={() => setParams({})}>
          All
        </button>
        {interviewStages.map((s) => (
          <button key={s} type="button" className={chip(stage === s)} onClick={() => setParams({ stage: s })}>
            {stageLabels[s]}
          </button>
        ))}
      </div>

      {isPending && <p className="text-slate-500">Loading...</p>}
      {error && <p className="text-red-600">Could not load questions: {error.message}</p>}

      {data && (
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
          {data.map((q) => (
            <li key={q.id}>
              <Link to={`/interview/${q.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
                <span className="w-28 shrink-0 text-xs font-medium uppercase tracking-wide text-indigo-600">
                  {stageLabels[q.stage]}
                </span>
                <span className="flex-1">{q.question}</span>
                <span className="flex shrink-0 gap-3 text-xs text-slate-500">
                  {q.hasAnswer ? <span className="text-emerald-600">✓ answer</span> : <span>no answer</span>}
                  <span>
                    {q.rehearsalCount} {q.rehearsalCount === 1 ? 'practice' : 'practices'}
                  </span>
                  {q.averageScore !== null && <span>★ {q.averageScore.toFixed(1)}</span>}
                </span>
              </Link>
            </li>
          ))}
          {data.length === 0 && <li className="px-4 py-3 text-slate-500">No questions yet.</li>}
        </ul>
      )}

      <form onSubmit={onSubmit} className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-4">
        <select
          className="rounded-md border border-slate-300 px-2 py-2 text-sm"
          value={newStage}
          onChange={(e) => setNewStage(e.target.value as InterviewStage)}
        >
          {interviewStages.map((s) => (
            <option key={s} value={s}>
              {stageLabels[s]}
            </option>
          ))}
        </select>
        <input
          className="min-w-64 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="Add a question you might be asked"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Add
        </button>
        {create.error && <p className="w-full text-sm text-red-600">Could not save: {create.error.message}</p>}
      </form>
    </section>
  );
}
