import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { RoutineTodayDto } from '@efd/shared';
import { api } from '../../lib/api';

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

  if (isPending) return <p className="text-slate-500">Loading...</p>;
  if (error) return <p className="text-red-600">Could not load today's routine: {error.message}</p>;

  const doneCount = data.tasks.filter((t) => t.checked).length;
  const totalMinutes = data.tasks.reduce((sum, t) => sum + t.minutes, 0);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold">Today</h2>
          <p className="text-sm text-slate-500">
            {new Date(`${data.date}T12:00:00`).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">🔥 {data.streak}</p>
          <p className="text-xs text-slate-500">weekday streak</p>
        </div>
      </div>

      {!data.isStudyDay ? (
        <p className="rounded-lg border border-slate-200 bg-white p-4 text-slate-600">
          No study tasks today. Enjoy the weekend: your streak is safe.
        </p>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="flex justify-between border-b border-slate-100 px-4 py-3 text-sm text-slate-500">
            <span>
              {doneCount}/{data.tasks.length} done
            </span>
            <span>{totalMinutes} min</span>
          </div>
          <ul>
            {data.tasks.map((task) => (
              <li key={task.id} className="border-b border-slate-100 last:border-0">
                <label className="flex cursor-pointer items-center gap-3 px-4 py-3">
                  <input
                    type="checkbox"
                    className="size-5 accent-indigo-600"
                    checked={task.checked}
                    disabled={toggle.isPending}
                    onChange={(e) => toggle.mutate({ taskId: task.id, checked: e.target.checked })}
                  />
                  <span className={task.checked ? 'text-slate-400 line-through' : ''}>{task.title}</span>
                  <span className="ml-auto text-sm text-slate-400">{task.minutes} min</span>
                </label>
              </li>
            ))}
          </ul>
          {data.completed && (
            <p className="rounded-b-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              All done for today. Great work!
            </p>
          )}
        </div>
      )}
      {toggle.error && <p className="text-sm text-red-600">Could not save: {toggle.error.message}</p>}
    </section>
  );
}
