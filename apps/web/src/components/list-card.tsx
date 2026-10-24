import type * as React from 'react';
import { cn } from '@/lib/utils';

/** A card holding a list of rows separated by dividers. */
function ListCard({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul className={cn('divide-y overflow-hidden rounded-xl border bg-card shadow-card', className)} {...props} />
  );
}

export { ListCard };
