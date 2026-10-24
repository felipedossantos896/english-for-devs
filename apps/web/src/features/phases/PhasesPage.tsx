import { useQuery } from '@tanstack/react-query';
import type { CefrLevel, PhaseStatus } from '@efd/shared';
import { Badge, Card, ErrorState, Heading, LoadingState, PageHeader, ProgressBar, type BadgeTone } from '../../components/ui';
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

const statusBadge: Record<PhaseStatus, { label: string; tone: BadgeTone }> = {
  active: { label: 'In progress', tone: 'accent' },
  done: { label: 'Done', tone: 'success' },
  locked: { label: 'Locked', tone: 'neutral' },
};

export function PhasesPage() {
  const { data, isPending, error } = useQuery({
    queryKey: ['phases'],
    queryFn: () => api<Phase[]>('/phases'),
  });

  if (isPending) return <LoadingState />;
  if (error) return <ErrorState title="Could not load phases" error={error} />;

  return (
    <section className="space-y-6">
      <PageHeader eyebrow="Your path" title="Phases" description="From beginner to interview-ready, one level at a time." />
      <ol className="space-y-4">
        {data.map((phase) => (
          <Card
            as="li"
            key={phase.id}
            className={phase.status === 'active' ? 'border-l-4 border-l-accent' : phase.status === 'locked' ? 'opacity-75' : ''}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge tone="primary">{phase.cefrLevel}</Badge>
                <Heading level={3} as="h2">
                  {phase.title}
                </Heading>
              </div>
              <Badge tone={statusBadge[phase.status].tone}>{statusBadge[phase.status].label}</Badge>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <ProgressBar
                label={`${phase.title} progress`}
                value={phase.progress}
                tone={phase.status === 'done' ? 'success' : 'primary'}
                className="flex-1"
              />
              <span className="w-10 text-right text-sm font-semibold tabular-nums">{Math.round(phase.progress * 100)}%</span>
            </div>
            {phase.goals.length > 0 && (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {phase.goals.map((goal) => (
                  <li key={goal.id} className="flex justify-between gap-3 rounded-control bg-ink-50 px-3 py-2 text-sm">
                    <span className="text-fg-muted">{goal.title}</span>
                    <span className="shrink-0 font-medium tabular-nums">
                      {goal.currentValue}/{goal.targetValue} {goal.unit}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </ol>
    </section>
  );
}
