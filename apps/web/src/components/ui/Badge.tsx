import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export type BadgeTone = 'neutral' | 'primary' | 'accent' | 'success';

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-ink-100 text-ink-700',
  primary: 'bg-primary-soft text-primary',
  accent: 'bg-accent-soft text-accent-hover',
  success: 'bg-success-soft text-success',
};

export function Badge({ tone = 'neutral', className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap', tones[tone], className)}
      {...props}
    />
  );
}
