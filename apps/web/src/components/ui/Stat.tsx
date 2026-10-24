import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** A single number with a label underneath, e.g. the streak counter. */
export function Stat({
  value,
  label,
  icon,
  tone = 'primary',
  className,
}: {
  value: ReactNode;
  label: string;
  icon?: ReactNode;
  tone?: 'primary' | 'accent';
  className?: string;
}) {
  return (
    <div className={cn('text-right', className)}>
      <p className={cn('text-3xl font-bold tabular-nums', tone === 'accent' ? 'text-accent' : 'text-primary')}>
        {icon && (
          <span aria-hidden className="mr-1">
            {icon}
          </span>
        )}
        {value}
      </p>
      <p className="text-xs font-medium text-fg-muted">{label}</p>
    </div>
  );
}
