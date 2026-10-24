import { useQuery } from '@tanstack/react-query';
import type { CefrLevel, PhaseStatus } from '@efd/shared';
import { api } from '../../lib/api';

interface Goal {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
}

interface Phase {
  id: string;
  title: string;
  cefrLevel: CefrLevel;
  status: PhaseStatus;
  progress: number;
  goals: Goal[];
}

export function PhasesPage() {
  const { data, isPending, error } = useQuery({
    queryKey: ['phases'],
    queryFn: () => api<Phase[]>('/phases'),
  });

  if (isPending) return <p className="text-slate-500">Loading...</p>;
  if (error) return <p className="text-red-600">Could not load phases: {error.message}</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Phases</h2>
      {data.map((phase) => (
        <article key={phase.id} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              {phase.title} <span className="text-sm text-slate-500">({phase.cefrLevel})</span>
            </h3>
            <span className="text-sm text-slate-500">{Math.round(phase.progress * 100)}%</span>
          </div>
          <div className="mt-2 h-2 rounded bg-slate-100">
            <div className="h-2 rounded bg-indigo-500" style={{ width: `${phase.progress * 100}%` }} />
          </div>
          <ul className="mt-3 space-y-1 text-sm text-slate-600">
            {phase.goals.map((goal) => (
              <li key={goal.id}>
                {goal.title}: {goal.currentValue}/{goal.targetValue} {goal.unit}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
