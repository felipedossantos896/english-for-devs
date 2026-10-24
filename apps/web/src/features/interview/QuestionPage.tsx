import { stageLabels } from '@efd/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { interviewApi } from './api';
import { PracticePanel } from './PracticePanel';
import { StarEditor } from './StarEditor';

export function QuestionPage() {
  const { questionId = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'answer' | 'practice'>('answer');

  const { data, isPending, error } = useQuery({
    queryKey: ['interview', 'question', questionId],
    queryFn: () => interviewApi.get(questionId),
  });

  const remove = useMutation({
    mutationFn: () => interviewApi.remove(questionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['interview', 'list'] });
      navigate('/interview');
    },
  });

  if (isPending) return <p className="text-slate-500">Loading...</p>;
  if (error) return <p className="text-red-600">Could not load the question: {error.message}</p>;

  const tabClass = (active: boolean) =>
    `border-b-2 px-1 pb-2 text-sm ${active ? 'border-indigo-600 font-medium text-indigo-600' : 'border-transparent text-slate-500'}`;

  return (
    <section className="space-y-6">
      <div className="flex justify-between text-sm">
        <Link to="/interview" className="text-slate-500">
          ← All questions
        </Link>
        <button
          type="button"
          onClick={() => window.confirm('Delete this question and its answers?') && remove.mutate()}
          className="text-slate-400 hover:text-red-600"
        >
          Delete
        </button>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">{stageLabels[data.stage]}</p>
        <h2 className="mt-1 text-2xl font-semibold">{data.question}</h2>
      </div>

      <div className="flex gap-6 border-b border-slate-200">
        <button type="button" className={tabClass(tab === 'answer')} onClick={() => setTab('answer')}>
          My answer
        </button>
        <button type="button" className={tabClass(tab === 'practice')} onClick={() => setTab('practice')}>
          Practice
        </button>
      </div>

      {tab === 'answer' ? (
        <StarEditor key={data.id} question={data} />
      ) : (
        <PracticePanel key={data.id} question={data} />
      )}
    </section>
  );
}
