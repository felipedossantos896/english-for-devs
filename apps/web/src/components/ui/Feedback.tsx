import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Spinner } from './Button';

export type AlertTone = 'info' | 'success' | 'danger';

const alertTones: Record<AlertTone, string> = {
  info: 'border-navy-200 bg-primary-soft text-navy-800',
  success: 'border-green-200 bg-success-soft text-success',
  danger: 'border-red-200 bg-danger-soft text-red-800',
};

export function Alert({ tone = 'info', children, className }: { tone?: AlertTone; children: ReactNode; className?: string }) {
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('rounded-control border px-4 py-3 text-sm', alertTones[tone], className)}
    >
      {children}
    </div>
  );
}

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-3 py-8 text-fg-muted">
      <Spinner className="size-5 text-primary" />
      {label}
    </div>
  );
}

export function ErrorState({ title, error }: { title: string; error: Error }) {
  return (
    <Alert tone="danger">
      <strong className="font-semibold">{title}.</strong> {error.message}
    </Alert>
  );
}

export function EmptyState({ icon, title, children }: { icon?: ReactNode; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border-strong bg-surface px-6 py-10 text-center">
      {icon && (
        <span aria-hidden className="text-4xl">
          {icon}
        </span>
      )}
      <p className="text-lg font-semibold text-navy-900">{title}</p>
      {children}
    </div>
  );
}
