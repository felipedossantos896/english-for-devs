import { useQuery } from '@tanstack/react-query';
import type { CefrLevel, PhaseStatus } from '@efd/shared';
import { ErrorState, LoadingState } from '@/components/states';
import { PageHeader } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

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

const statusBadge = {
  active: { label: 'In progress', variant: 'highlight' },
  done: { label: 'Done', variant: 'success' },
  locked: { label: 'Locked', variant: 'secondary' },
} as const satisfies Record<PhaseStatus, { label: string; variant: string }>;

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
          <li key={phase.id}>
            <Card
              className={cn(
                'gap-4',
                phase.status === 'active' && 'border-l-4 border-l-highlight',
                phase.status === 'locked' && 'opacity-75',
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge>{phase.cefrLevel}</Badge>
                  <h2>{phase.title}</h2>
                </CardTitle>
                <CardAction>
                  <Badge variant={statusBadge[phase.status].variant}>{statusBadge[phase.status].label}</Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Progress
                    aria-label={`${phase.title} progress`}
                    value={phase.progress * 100}
                    indicatorClassName={phase.status === 'done' ? 'bg-success' : undefined}
                  />
                  <span className="w-10 text-right text-sm font-semibold tabular-nums">{Math.round(phase.progress * 100)}%</span>
                </div>
                {phase.goals.length > 0 && (
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {phase.goals.map((goal) => (
                      <li key={goal.id} className="flex justify-between gap-3 rounded-md bg-ink-50 px-3 py-2 text-sm">
                        <span className="text-muted-foreground">{goal.title}</span>
                        <span className="shrink-0 font-medium tabular-nums">
                          {goal.currentValue}/{goal.targetValue} {goal.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  );
}
