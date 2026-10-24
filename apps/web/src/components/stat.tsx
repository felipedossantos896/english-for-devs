import type * as React from 'react';
import { cn } from '@/lib/utils';

/** A single big number with a label underneath, e.g. the streak counter. */
function Stat({
  value,
  label,
  icon,
  tone = 'primary',
  className,
}: {
  value: React.ReactNode;
  label: string;
  icon?: React.ReactNode;
  tone?: 'primary' | 'highlight';
  className?: string;
}) {
  return (
    <div className={cn('text-right', className)}>
      <p className={cn('text-3xl font-bold tabular-nums', tone === 'highlight' ? 'text-highlight' : 'text-primary')}>
        {icon && (
          <span aria-hidden className="mr-1">
            {icon}
          </span>
        )}
        {value}
      </p>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

export { Stat };
