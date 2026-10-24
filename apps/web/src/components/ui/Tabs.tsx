import { useRef, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn';

export interface TabItem<T extends string> {
  value: T;
  label: string;
}

/** Underlined tabs with arrow-key navigation, following the WAI-ARIA tabs pattern. */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + items.length) % items.length;
    onChange(items[next]!.value);
    refs.current[next]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className="flex gap-6 border-b border-border">
      {items.map((item, i) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              '-mb-px min-h-11 border-b-3 px-1 text-sm font-medium transition-colors',
              active ? 'border-accent text-primary' : 'border-transparent text-fg-muted hover:text-fg',
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
