import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-control font-medium transition-colors select-none ' +
  'disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-card hover:bg-primary-hover',
  accent: 'bg-accent text-white shadow-card hover:bg-accent-hover',
  secondary: 'border border-border-strong bg-surface text-fg hover:border-navy-300 hover:bg-primary-soft',
  ghost: 'text-fg-muted hover:bg-ink-100 hover:text-fg',
  danger: 'text-danger hover:bg-danger-soft',
};

// md and lg are at least 44px tall so they are easy to hit on touch screens (Fitts's law).
const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-4 text-sm',
  lg: 'min-h-13 px-6 text-base',
};

export function buttonClass({
  variant = 'primary',
  size = 'md',
  block = false,
}: { variant?: ButtonVariant; size?: ButtonSize; block?: boolean } = {}) {
  return cn(base, variants[variant], sizes[size], block && 'w-full');
}

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to the container width. */
  block?: boolean;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, StyleProps {
  /** Shows a spinner, disables the button and swaps the label for `loadingText` when given. */
  loading?: boolean;
  loadingText?: ReactNode;
}

export function Button({
  variant,
  size,
  block,
  loading = false,
  loadingText,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonClass({ variant, size, block }), className)}
      {...props}
    >
      {loading && <Spinner />}
      {loading && loadingText ? loadingText : children}
    </button>
  );
}

/** A router link that looks like a button, for navigation that is the main action of a screen. */
export function ButtonLink({ variant, size, block, className, ...props }: LinkProps & StyleProps) {
  return <Link className={cn(buttonClass({ variant, size, block }), className)} {...props} />;
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent', className)}
    />
  );
}
