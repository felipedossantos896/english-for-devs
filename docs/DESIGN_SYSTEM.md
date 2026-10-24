# Design system

The web app uses [shadcn/ui](https://ui.shadcn.com) components (Radix UI primitives + Tailwind CSS v4),
themed with a palette taken from the US flag.
A live reference of every token and component is at **`/ui`** when running the app (`pnpm dev`).

## shadcn/ui setup

- `apps/web/components.json` configures the CLI (style `new-york`, aliases `@/components`, `@/components/ui`, `@/lib/utils`, icons from `lucide-react`).
- The `@/*` alias points to `apps/web/src` (`tsconfig.json` and `vite.config.ts`).
- Add a new component from `apps/web` with `pnpm dlx shadcn@latest add <name>`. It lands in `src/components/ui` and picks up the theme from the CSS variables, so no color edits are needed.
- shadcn components are copied into the repo on purpose: edit them freely. Ours are customized for taller hit areas (see Fitts below), a `highlight` variant and a `loading` state on `Button`.

## Tokens

Defined in `apps/web/src/index.css`.

| Scale  | Base                          | Use |
|--------|-------------------------------|-----|
| `navy` | `navy-700` = `#0A3161` (flag) | Brand, primary actions, headings |
| `red`  | `red-600` = `#B31942` (flag)  | Highlight: the one thing to notice, active nav/tab, destructive actions |
| `ink`  | blue-tinted greys             | Text, borders, backgrounds |
| white  | `card`                        | Cards, inputs, popovers |

Semantic variables follow the shadcn names, so every utility (`bg-primary`, `text-muted-foreground`, ...) works:

| Variable | Value |
|----------|-------|
| `--primary` / `--primary-foreground` | navy-700 / white |
| `--background`, `--card`, `--popover` | ink-50, white, white |
| `--foreground`, `--muted-foreground` | ink-900, ink-600 |
| `--secondary`, `--muted` | ink-100 |
| `--accent` / `--accent-foreground` | navy-50 / navy-800 (hover backgrounds, as in shadcn) |
| `--destructive` | red-600 |
| `--border`, `--input`, `--ring` | ink-200, ink-300, navy-400 |
| `--highlight`, `--highlight-soft` | red-600, red-50 (**our addition**: flag red as attention color) |
| `--success`, `--success-soft` | green for completed states |
| `--radius` | 0.625rem (`rounded-sm` … `rounded-xl` derive from it) |

All text pairs meet WCAG AA (4.5:1). Checked values:

| Pair | Ratio |
|------|-------|
| `navy-700` on white | 12.9 |
| white on `red-600` | 6.7 |
| `ink-600` (`muted-foreground`) on white | 7.6 |
| `ink-500` (lightest text color, placeholders) on white / background | 5.2 / 4.9 |
| `navy-100` (nav links) on `navy-700` | 9.9 |

## Components

**shadcn/ui** (`src/components/ui`): `alert`, `badge`, `button`, `card`, `checkbox`, `input`, `label`, `progress`,
`select`, `separator`, `tabs`, `textarea`, `toggle-group`.

| Component | Our changes |
|-----------|-------------|
| `Button` | Sizes `sm` 36px, `default` 44px, `lg` 48px, `icon` 44px; variants `default`, `highlight`, `outline`, `secondary`, `ghost`, `destructive`, `link`; `loading` prop; `asChild` for links |
| `Badge` | Variants `default` (navy), `secondary`, `highlight`, `success`, `outline` |
| `Alert` | Variants `default` (navy), `success`, `destructive` |
| `Tabs` | Underlined tab bar with a red indicator |
| `ToggleGroup` | `chip` look for filters, `square` look for the 1-5 score |
| `Card` | Navy title color and a soft navy shadow |

**App components** (`src/components`), built on top of shadcn:

| Component | Notes |
|-----------|-------|
| `Heading`, `Text`, `Eyebrow`, `PageHeader` (`typography.tsx`) | Type scale and tones; `PageHeader` = eyebrow + title + description + one action |
| `Field` | Wires `Label`, hint and error to the control with `id` / `aria-describedby` / `aria-invalid` |
| `LoadingState`, `ErrorState`, `SaveError`, `EmptyState` (`states.tsx`) | Consistent feedback for every screen state |
| `ListCard` | Card with divided rows |
| `Stat` | Big number + label (streak) |
| `BackLink` | "← Back" link with a 44px hit area |
| `AppShell` (`app-shell.tsx`) | Navy header, red-white-red stripe, main navigation, skip link |

## UX laws applied

| Law | Where |
|-----|-------|
| **Fitts's law** (bigger and closer targets are faster) | `default`/`lg` buttons and inputs are at least 44px tall; whole task rows are clickable in Today; review grade buttons are large and right under the card; back links have a 44px hit area |
| **Hick's law** (fewer choices, faster decisions) | One filled (navy or red) action per screen, the rest are `outline`/`ghost`; the default review answer ("Good") is the only filled button; four nav items |
| **Jakob's law** (work like other sites) | Logo left with nav beside it, underlined active tab, labels above inputs, checkboxes for tasks, "← Back" links |
| **Miller's law** (chunk information) | STAR answer split into four numbered boxes; deck stats as separate badges; phase goals as small tiles |
| **Law of proximity** (Gestalt) | `Field` keeps label, hint, control and error together; related actions grouped; sections separated by whitespace |
| **Von Restorff effect** (the different thing stands out) | Red is rare: streak counter, "Review all", due counts, active phase border, active nav/tab underline |
| **Doherty threshold** (feedback under 400ms) | Loading spinners, `loading` buttons with "Saving..." text, disabled state while a request runs |
| **Peak-end rule** | Celebratory end state after a review session and when all daily tasks are done |
| **Accessibility** | AA contrast, one visible `:focus-visible` ring, skip link, Radix primitives give keyboard support and ARIA roles to tabs, select, checkbox, toggle groups and progress; reduced-motion respected |

## Adding a screen

1. Start with `PageHeader` and at most one `default` or `highlight` button.
2. Use `LoadingState` / `ErrorState` / `EmptyState` / `SaveError` for the non-happy states.
3. Wrap content in `Card` (`CardHeader`, `CardContent`, `CardFooter`) or `ListCard`; forms use `Field`s.
4. Need something new (dialog, tooltip, ...)? `pnpm dlx shadcn@latest add <name>` before writing your own.
5. Only reach for raw Tailwind for layout (grid, gap, flex). Colors come from semantic tokens.
