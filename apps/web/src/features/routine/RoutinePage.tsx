import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { RoutineTodayDto } from '@efd/shared';
import { PartyPopper } from 'lucide-react';
import { ErrorState, LoadingState, SaveError } from '@/components/states';
import { Stat } from '@/components/stat';
import { PageHeader } from '@/components/typography';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const queryKey = ['routine', 'today'];

export function RoutinePage() {
  const queryClient = useQueryClient();
  const { data, isPending, error } = useQuery({
    queryKey,
    queryFn: () => api<RoutineTodayDto>('/routine/today'),
  });

  const toggle = useMutation({
    mutationFn: ({ taskId, checked }: { taskId: string; checked: boolean }) =>
      api<RoutineTodayDto>(`/routine/today/checks/${taskId}`, { method: checked ? 'PUT' : 'DELETE' }),
    onSuccess: (today) => queryClient.setQueryData(queryKey, today),
  });

  if (isPending) return <LoadingState />;
  if (error) return <ErrorState title="Could not load today's routine" error={error} />;

  const doneCount = data.tasks.filter((t) => t.checked).length;
  const totalMinutes = data.tasks.reduce((sum, t) => sum + t.minutes, 0);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Daily routine"
        title="Today"
        description={new Date(`${data.date}T12:00:00`).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
        actions={<Stat icon="🔥" value={data.streak} label="weekday streak" tone="highlight" />}
      />

      {!data.isStudyDay ? (
        <Alert>
          <AlertDescription>No study tasks today. Enjoy the weekend: your streak is safe.</AlertDescription>
        </Alert>
      ) : (
        <Card className="gap-0 py-0">
          <div className="space-y-2 border-b px-5 py-4">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">
                {doneCount} of {data.tasks.length} done
              </span>
              <span className="text-muted-foreground">{totalMinutes} min total</span>
            </div>
            <Progress
              aria-label="Tasks done today"
              value={data.tasks.length ? (doneCount / data.tasks.length) * 100 : 0}
              indicatorClassName={data.completed ? 'bg-success' : undefined}
            />
          </div>
          <ul className="divide-y">
            {data.tasks.map((task) => (
              <li key={task.id}>
                {/* The whole row is the hit area, not only the small checkbox (Fitts's law). */}
                <label className="flex min-h-14 cursor-pointer items-center gap-4 px-5 py-3 transition-colors hover:bg-accent">
                  <Checkbox
                    checked={task.checked}
                    disabled={toggle.isPending}
                    onCheckedChange={(checked) => toggle.mutate({ taskId: task.id, checked: checked === true })}
                  />
                  <span className={cn('flex-1', task.checked && 'text-ink-500 line-through')}>{task.title}</span>
                  <span className="text-sm text-muted-foreground tabular-nums">{task.minutes} min</span>
                </label>
              </li>
            ))}
          </ul>
          {data.completed && (
            <div className="border-t p-4">
              <Alert variant="success">
                <PartyPopper />
                <AlertDescription>All done for today. Great work!</AlertDescription>
              </Alert>
            </div>
          )}
        </Card>
      )}
      <SaveError error={toggle.error} />
    </section>
  );
}
