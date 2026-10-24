import { cn } from '../../lib/cn';

export function ProgressBar({
  value,
  label,
  tone = 'primary',
  className,
}: {
  /** 0 to 1. */
  value: number;
  label: string;
  tone?: 'primary' | 'accent' | 'success';
  className?: string;
}) {
  const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  const fill = { primary: 'bg-primary', accent: 'bg-accent', success: 'bg-success' }[tone];
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cn('h-2.5 overflow-hidden rounded-full bg-ink-100', className)}
    >
      <div className={cn('h-full rounded-full transition-[width] duration-500', fill)} style={{ width: `${pct}%` }} />
    </div>
  );
}
