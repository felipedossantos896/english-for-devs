import { Link } from 'react-router-dom';

export function BackLink({ to, children }: { to: string; children: string }) {
  return (
    <Link
      to={to}
      className="inline-flex min-h-11 items-center gap-1 rounded-control text-sm font-medium text-fg-muted hover:text-primary"
    >
      <span aria-hidden>←</span> {children}
    </Link>
  );
}
