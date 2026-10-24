import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function BackLink({ to, children }: { to: string; children: string }) {
  return (
    <Link
      to={to}
      className="inline-flex h-11 items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-primary"
    >
      <ArrowLeft className="size-4" aria-hidden /> {children}
    </Link>
  );
}

export { BackLink };
