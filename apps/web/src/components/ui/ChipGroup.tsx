import { cn } from '../../lib/cn';

export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

/** A row of toggle chips for picking one filter. */
export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name for the group. */
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'min-h-10 rounded-full border px-4 text-sm font-medium transition-colors',
              active
                ? 'border-primary bg-primary text-white'
                : 'border-border-strong bg-surface text-fg-muted hover:border-navy-300 hover:text-fg',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
