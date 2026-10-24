import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type HeadingLevel = 1 | 2 | 3;

const headingStyles: Record<HeadingLevel, string> = {
  1: 'text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl',
  2: 'text-xl font-semibold tracking-tight text-navy-900',
  3: 'text-base font-semibold text-fg',
};

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  /** Render as a different heading tag while keeping the visual level. */
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export function Heading({ level = 2, as, className, ...props }: HeadingProps) {
  const Tag = as ?? (`h${level}` as const);
  return <Tag className={cn(headingStyles[level], className)} {...props} />;
}

type TextTone = 'default' | 'muted' | 'subtle' | 'accent' | 'success' | 'danger';
type TextSize = 'xs' | 'sm' | 'md' | 'lg';

const toneStyles: Record<TextTone, string> = {
  default: 'text-fg',
  muted: 'text-fg-muted',
  subtle: 'text-fg-subtle',
  accent: 'text-accent',
  success: 'text-success',
  danger: 'text-danger',
};

const sizeStyles: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export interface TextProps extends HTMLAttributes<HTMLElement> {
  tone?: TextTone;
  size?: TextSize;
  as?: 'p' | 'span' | 'div';
}

export function Text({ tone = 'default', size = 'md', as: Tag = 'p', className, ...props }: TextProps) {
  return <Tag className={cn(toneStyles[tone], sizeStyles[size], className)} {...props} />;
}

/** Small uppercase label above a title, e.g. the category of a card. */
export function Eyebrow({ className, tone = 'accent', ...props }: HTMLAttributes<HTMLParagraphElement> & { tone?: 'accent' | 'primary' }) {
  return (
    <p
      className={cn(
        'text-xs font-semibold uppercase tracking-wider',
        tone === 'accent' ? 'text-accent' : 'text-primary',
        className,
      )}
      {...props}
    />
  );
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
}: {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  /** Keep this to one primary action so the next step is obvious (Hick's law). */
  actions?: ReactNode;
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
