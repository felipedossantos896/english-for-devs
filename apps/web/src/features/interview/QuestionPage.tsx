import { stageLabels } from '@efd/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackLink } from '@/components/back-link';
import { ErrorState, LoadingState } from '@/components/states';
import { Eyebrow, Heading } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { interviewApi } from './api';
import { PracticePanel } from './PracticePanel';
import { StarEditor } from './StarEditor';

export function QuestionPage() {
  const { questionId = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
          variant="destructive"
          size="sm"
          loading={remove.isPending}
          onClick={() => window.confirm('Delete this question and its answers?') && remove.mutate()}
        >
          {!remove.isPending && <Trash2 />} Delete question
        </Button>
      </div>

      <div className="space-y-2">
        <Eyebrow>{stageLabels[data.stage]}</Eyebrow>
        <Heading level={1}>{data.question}</Heading>
      </div>

      <Tabs defaultValue="answer">
        <TabsList aria-label="Question sections">
          <TabsTrigger value="answer">My answer</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
        </TabsList>
        <TabsContent value="answer">
          <StarEditor key={data.id} question={data} />
        </TabsContent>
        <TabsContent value="practice">
          <PracticePanel key={data.id} question={data} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
