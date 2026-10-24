import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Padding = 'none' | 'sm' | 'md' | 'lg';

const paddings: Record<Padding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-8',
};

export interface CardProps extends HTMLAttributes<HTMLElement> {
  padding?: Padding;
  as?: 'div' | 'section' | 'article' | 'li' | 'form';
  /** Lift on hover, for cards that are themselves clickable. */
  interactive?: boolean;
}

export function Card({ padding = 'md', as: Tag = 'div', interactive = false, className, ...props }: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-card border border-border bg-surface shadow-card',
        paddings[padding],
        interactive && 'transition-shadow hover:border-navy-200 hover:shadow-raised',
        className,
      )}
      {...(props as HTMLAttributes<HTMLElement>)}
    />
  );
}

/** A card holding a list of rows separated by dividers. */
export function ListCard({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn('divide-y divide-border overflow-hidden rounded-card border border-border bg-surface shadow-card', className)}
      {...props}
    />
  );
}
