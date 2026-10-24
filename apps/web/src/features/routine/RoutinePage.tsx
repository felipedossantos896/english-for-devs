import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { RoutineTodayDto } from '@efd/shared';
import { Alert, Card, ErrorState, LoadingState, PageHeader, ProgressBar, Stat, Text } from '../../components/ui';
import { api } from '../../lib/api';
import { cn } from '../../lib/cn';

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
        actions={<Stat icon="🔥" value={data.streak} label="weekday streak" tone="accent" />}
      />

      {!data.isStudyDay ? (
        <Alert>No study tasks today. Enjoy the weekend: your streak is safe.</Alert>
      ) : (
        <Card padding="none">
          <div className="space-y-2 border-b border-border px-5 py-4">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-fg">
                {doneCount} of {data.tasks.length} done
              </span>
              <span className="text-fg-muted">{totalMinutes} min total</span>
            </div>
            <ProgressBar
              label="Tasks done today"
              value={data.tasks.length ? doneCount / data.tasks.length : 0}
              tone={data.completed ? 'success' : 'primary'}
            />
          </div>
          <ul className="divide-y divide-border">
            {data.tasks.map((task) => (
              <li key={task.id}>
                {/* The whole row is the hit area, not only the small checkbox (Fitts's law). */}
                <label className="flex min-h-14 cursor-pointer items-center gap-4 px-5 py-3 transition-colors hover:bg-primary-soft">
                  <input
                    type="checkbox"
                    className="size-5 shrink-0 accent-navy-700"
                    checked={task.checked}
                    disabled={toggle.isPending}
                    onChange={(e) => toggle.mutate({ taskId: task.id, checked: e.target.checked })}
                  />
                  <span className={cn('flex-1', task.checked && 'text-fg-subtle line-through')}>{task.title}</span>
                  <Text as="span" size="sm" tone="muted" className="tabular-nums">
                    {task.minutes} min
                  </Text>
                </label>
              </li>
            ))}
          </ul>
          {data.completed && (
            <div className="border-t border-border p-4">
              <Alert tone="success">🎉 All done for today. Great work!</Alert>
            </div>
          )}
        </Card>
      )}
      {toggle.error && <Alert tone="danger">Could not save: {toggle.error.message}</Alert>}
    </section>
  );
}
