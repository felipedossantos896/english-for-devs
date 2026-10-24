import type * as React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-3 py-8 text-muted-foreground">
      <Loader2 className="size-5 animate-spin text-primary" aria-hidden />
      {label}
    </div>
  );
}

function ErrorState({ title, error }: { title: string; error: Error }) {
  return (
    <Alert variant="destructive">
      <AlertCircle />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}

/** Inline error under a form or action that failed. */
function SaveError({ error }: { error: Error | null }) {
  if (!error) return null;
  return (
    <Alert variant="destructive">
      <AlertCircle />
      <AlertDescription>Could not save: {error.message}</AlertDescription>
    </Alert>
  );
}

function EmptyState({ icon, title, children }: { icon?: React.ReactNode; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-input bg-card px-6 py-10 text-center">
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

export { EmptyState, ErrorState, LoadingState, SaveError };
