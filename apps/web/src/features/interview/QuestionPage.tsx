import { stageLabels } from '@efd/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackLink, Button, ErrorState, Eyebrow, Heading, LoadingState, Tabs, type TabItem } from '../../components/ui';
import { interviewApi } from './api';
import { PracticePanel } from './PracticePanel';
import { StarEditor } from './StarEditor';

type Tab = 'answer' | 'practice';

const tabs: TabItem<Tab>[] = [
  { value: 'answer', label: 'My answer' },
  { value: 'practice', label: 'Practice' },
];

export function QuestionPage() {
  const { questionId = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>('answer');

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

  if (isPending) return <LoadingState />;
  if (error) return <ErrorState title="Could not load the question" error={error} />;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <BackLink to="/interview">All questions</BackLink>
        {/* Destructive action kept small, away from the main actions, and confirmed first. */}
        <Button
          variant="danger"
          size="sm"
          loading={remove.isPending}
          onClick={() => window.confirm('Delete this question and its answers?') && remove.mutate()}
        >
          Delete question
        </Button>
      </div>

      <div className="space-y-2">
        <Eyebrow>{stageLabels[data.stage]}</Eyebrow>
        <Heading level={1}>{data.question}</Heading>
      </div>

      <Tabs label="Question sections" items={tabs} value={tab} onChange={setTab} />

      <div role="tabpanel" aria-label={tabs.find((t) => t.value === tab)?.label}>
        {tab === 'answer' ? (
          <StarEditor key={data.id} question={data} />
        ) : (
          <PracticePanel key={data.id} question={data} />
        )}
      </div>
    </section>
  );
}
