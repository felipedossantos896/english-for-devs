import type * as React from 'react';
import { cn } from '@/lib/utils';

type HeadingLevel = 1 | 2 | 3;

const headingStyles: Record<HeadingLevel, string> = {
  1: 'text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl',
  2: 'text-xl font-semibold tracking-tight text-navy-900',
  3: 'text-base font-semibold text-foreground',
};

function Heading({
  level = 2,
  as,
  className,
  ...props
}: React.ComponentProps<'h2'> & {
  level?: HeadingLevel;
  /** Render as a different heading tag while keeping the visual level. */
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}) {
  const Tag = as ?? (`h${level}` as const);
  return <Tag className={cn(headingStyles[level], className)} {...props} />;
}

const toneStyles = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  subtle: 'text-ink-500',
  highlight: 'text-highlight',
  success: 'text-success',
  destructive: 'text-destructive',
} as const;

const sizeStyles = { xs: 'text-xs', sm: 'text-sm', md: 'text-base', lg: 'text-lg' } as const;

function Text({
  tone = 'default',
  size = 'md',
  as: Tag = 'p',
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  tone?: keyof typeof toneStyles;
  size?: keyof typeof sizeStyles;
  as?: 'p' | 'span' | 'div';
}) {
  return <Tag className={cn(toneStyles[tone], sizeStyles[size], className)} {...props} />;
}

/** Small uppercase label above a title, e.g. the category of a card. */
function Eyebrow({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('text-xs font-semibold tracking-wider text-highlight uppercase', className)} {...props} />;
}

function PageHeader({
  title,
  description,
  eyebrow,
  actions,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  /** Keep this to one main action so the next step is obvious (Hick's law). */
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 space-y-1">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Heading level={1}>{title}</Heading>
        {description && <Text tone="muted">{description}</Text>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </header>
  );
}

export { Eyebrow, Heading, PageHeader, Text };
