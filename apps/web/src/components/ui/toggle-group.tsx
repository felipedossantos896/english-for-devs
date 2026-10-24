import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

// Based on shadcn/ui toggle + toggle-group, merged into one file with two looks:
// `chip` for filters and `square` for small numeric pickers.
const toggleItemVariants = cva(
  'inline-flex items-center justify-center border text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=off]:border-input data-[state=off]:bg-card data-[state=off]:hover:border-navy-300 data-[state=off]:hover:bg-accent',
  {
    variants: {
      variant: {
        chip: 'h-10 rounded-full px-4 data-[state=off]:text-muted-foreground data-[state=off]:hover:text-foreground',
        square: 'size-11 rounded-md font-semibold',
      },
    },
    defaultVariants: {
      variant: 'chip',
    },
  },
);

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleItemVariants>>({ variant: 'chip' });

function ToggleGroup({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleItemVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn('flex flex-wrap items-center gap-2', className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  const { variant } = React.useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(toggleItemVariants({ variant }), className)}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
