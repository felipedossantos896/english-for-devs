# Design system

The web app uses a small component library on top of Tailwind CSS v4, with a palette taken from the US flag.
A live reference of every token and component is at **`/ui`** when running the app (`pnpm dev`).

## Tokens

Defined once in `apps/web/src/index.css` inside `@theme`, so each one is also a Tailwind utility
(`bg-primary`, `text-fg-muted`, `rounded-card`, ...).

| Scale  | Base                         | Use |
|--------|------------------------------|-----|
| `navy` | `navy-700` = `#0A3161` (flag) | Brand, primary actions, headings |
| `red`  | `red-600` = `#B31942` (flag)  | Accent: the one thing to notice, active nav, destructive actions |
| `ink`  | blue-tinted greys             | Text, borders, backgrounds |
| white  | `surface`                     | Cards and inputs |

Components use the **semantic** tokens, not the scales, so the palette can change in one place:
`primary`, `accent`, `surface`, `canvas`, `border`, `fg`, `fg-muted`, `fg-subtle`, `success`, `danger`
(plus `*-soft` and `*-hover` variants), `rounded-control`, `rounded-card`, `shadow-card`, `shadow-raised`.

All text pairs meet WCAG AA (4.5:1). Checked values:

| Pair | Ratio |
|------|-------|
| `navy-700` on white | 12.9 |
| white on `red-600` | 6.7 |
| `ink-600` (`fg-muted`) on white | 7.6 |
| `ink-500` (`fg-subtle`, smallest allowed text color) on white / canvas | 5.2 / 4.9 |
| `navy-100` (nav links) on `navy-700` | 9.9 |

## Components

All exported from `apps/web/src/components/ui`:

| Component | Notes |
|-----------|-------|
| `Button`, `ButtonLink` | Variants `primary`, `accent`, `secondary`, `ghost`, `danger`; sizes `sm`, `md`, `lg`; `loading` + `loadingText`; `block` |
| `Heading`, `Text`, `Eyebrow`, `PageHeader` | Type scale and tones; `PageHeader` = eyebrow + title + description + one action |
| `Card`, `ListCard` | Surface container; `ListCard` for divided rows |
| `Field`, `Input`, `Textarea`, `Select` | `Field` wires label, hint and error to the control with `id` / `aria-describedby` / `aria-invalid` |
| `Badge` | `neutral`, `primary`, `accent`, `success` |
| `ChipGroup` | Single-choice filter chips with `aria-pressed` |
| `Tabs` | WAI-ARIA tabs with arrow-key navigation |
| `ProgressBar` | `role="progressbar"` with value |
| `Stat` | Big number + label (streak) |
| `Alert`, `LoadingState`, `ErrorState`, `EmptyState` | Consistent feedback for every screen state |
| `BackLink` | "← Back" link with a 44px hit area |

`AppShell` (`components/AppShell.tsx`) holds the navy header, the red-white-red stripe and the main navigation.

## UX laws applied

| Law | Where |
|-----|-------|
| **Fitts's law** (bigger and closer targets are faster) | `md`/`lg` buttons are at least 44px tall; whole task rows are clickable in Today; review grade buttons are large and right under the card; back links have a 44px hit area |
| **Hick's law** (fewer choices, faster decisions) | One primary (navy or red) action per screen, the rest are `secondary`/`ghost`; the default review answer ("Good") is the only filled button; four nav items |
| **Jakob's law** (work like other sites) | Logo left with nav beside it, underlined active tab, labels above inputs, checkboxes for tasks, "← Back" links |
| **Miller's law** (chunk information) | STAR answer split into four numbered boxes; deck stats as separate badges; phase goals as small tiles |
| **Law of proximity** (Gestalt) | `Field` keeps label, hint, control and error together; related actions grouped; sections separated by whitespace |
| **Von Restorff effect** (the different thing stands out) | Red is rare: streak counter, "Review all", due counts, active phase border, active nav/tab underline |
| **Doherty threshold** (feedback under 400ms) | Loading spinners, `loading` buttons with "Saving..." text, disabled state while a request runs |
| **Peak-end rule** | Celebratory end state after a review session and when all daily tasks are done |
| **Accessibility** | AA contrast, one visible `:focus-visible` ring, skip link, `aria-*` on tabs, chips, progress, score picker; reduced-motion respected |

## Adding a screen

1. Start with `PageHeader` and at most one primary action.
2. Use `LoadingState` / `ErrorState` / `EmptyState` for the non-happy states.
3. Wrap content in `Card` or `ListCard`, forms in `Card as="form"` with `Field`s.
4. Only reach for raw Tailwind for layout (grid, gap, flex). Colors come from semantic tokens.
