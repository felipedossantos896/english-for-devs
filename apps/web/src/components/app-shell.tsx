import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Four destinations only: few choices keep navigation fast (Hick's law, Miller's law).
const navItems = [
  { to: '/today', label: 'Today' },
  { to: '/cards', label: 'Flashcards' },
  { to: '/interview', label: 'Interview' },
  { to: '/phases', label: 'Phases' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-card px-4 py-2 font-medium text-primary focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>

      {/* Logo on the left, navigation next to it: the layout people know from other sites (Jakob's law). */}
      <header className="bg-primary text-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-8 gap-y-2 px-4 pt-4 sm:pt-0">
          <Link to="/today" className="flex items-center gap-2 rounded-md text-lg font-bold tracking-tight">
            <span aria-hidden className="text-red-300">
              ★
            </span>
            English for Devs
          </Link>
          <nav aria-label="Main" className="-mx-4 flex basis-full overflow-x-auto px-2 sm:mx-0 sm:basis-auto sm:px-0">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-12 shrink-0 items-center border-b-4 px-3 sm:min-h-14 text-sm font-medium transition-colors',
                    isActive ? 'border-highlight text-white' : 'border-transparent text-navy-100 hover:text-white',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <FlagStripe />
      </header>

      <main id="main" className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}

/** Thin red-white-red band under the header, a nod to the flag's stripes. */
function FlagStripe() {
  return (
    <div aria-hidden className="flex h-1.5 flex-col">
      <span className="flex-1 bg-highlight" />
      <span className="flex-1 bg-white" />
      <span className="flex-1 bg-highlight" />
    </div>
  );
}
