import { useState, type ReactNode } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  ChipGroup,
  EmptyState,
  Eyebrow,
  Field,
  Heading,
  Input,
  PageHeader,
  ProgressBar,
  Select,
  Stat,
  Tabs,
  Text,
  Textarea,
} from '../../components/ui';

const swatches = [
  { name: 'navy', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
  { name: 'red', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { name: 'ink', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
];

const semantic = ['primary', 'accent', 'surface', 'canvas', 'border', 'fg', 'fg-muted', 'success', 'danger'];

/** Living reference of the design system at /ui. Not linked from the main navigation. */
export function StyleguidePage() {
  const [chip, setChip] = useState<'all' | 'hr' | 'tech'>('all');
  const [tab, setTab] = useState<'one' | 'two'>('one');

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Design system" title="UI components" description="Tokens and building blocks used across the app." />

      <Section title="Colors">
        <div className="space-y-3">
          {swatches.map((s) => (
            <div key={s.name} className="flex flex-wrap items-center gap-1">
              <span className="w-12 text-sm font-medium">{s.name}</span>
              {s.shades.map((shade) => (
                <span
                  key={shade}
                  title={`${s.name}-${shade}`}
                  className="flex size-10 items-end justify-center rounded border border-black/5 pb-0.5 text-[10px]"
                  style={{
                    background: `var(--color-${s.name}-${shade})`,
                    color: shade >= 500 ? 'white' : 'var(--color-ink-900)',
                  }}
                >
                  {shade}
                </span>
              ))}
            </div>
          ))}
          <div className="flex flex-wrap gap-2 pt-2">
            {semantic.map((name) => (
              <span key={name} className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pr-3 pl-1 text-xs">
                <span className="size-5 rounded-full border border-black/10" style={{ background: `var(--color-${name})` }} />
                {name}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Typography">
        <Eyebrow>Eyebrow</Eyebrow>
        <Heading level={1}>Heading 1</Heading>
        <Heading level={2}>Heading 2</Heading>
        <Heading level={3}>Heading 3</Heading>
        <Text>Body text. Tell me about yourself.</Text>
        <Text tone="muted" size="sm">
          Muted small text for hints and metadata.
        </Text>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading loadingText="Saving...">
            Save
          </Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section title="Form fields">
        <Card className="grid gap-4 sm:grid-cols-2">
          <Field label="Front" hint="The English word or phrase.">
            {(props) => <Input {...props} placeholder="deploy" />}
          </Field>
          <Field label="Stage">
            {(props) => (
              <Select {...props}>
                <option>Behavioral</option>
                <option>Technical</option>
              </Select>
            )}
          </Field>
          <Field label="With error" error="This field is required.">
            {(props) => <Input {...props} />}
          </Field>
          <Field label="Notes">{(props) => <Textarea {...props} rows={2} />}</Field>
        </Card>
      </Section>

      <Section title="Badges, chips and tabs">
        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge>
          <Badge tone="primary">Primary</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success">Success</Badge>
        </div>
        <ChipGroup
          label="Example filter"
          value={chip}
          onChange={setChip}
          options={[
            { value: 'all', label: 'All' },
            { value: 'hr', label: 'HR screen' },
            { value: 'tech', label: 'Technical' },
          ]}
        />
        <Tabs
          label="Example tabs"
          value={tab}
          onChange={setTab}
          items={[
            { value: 'one', label: 'My answer' },
            { value: 'two', label: 'Practice' },
          ]}
        />
      </Section>

      <Section title="Progress and stats">
        <Card className="flex items-center gap-6">
          <ProgressBar label="Example progress" value={0.6} className="flex-1" />
          <Stat icon="🔥" value={12} label="weekday streak" tone="accent" />
        </Card>
      </Section>

      <Section title="Feedback">
        <Alert>Info: no study tasks today.</Alert>
        <Alert tone="success">All done for today. Great work!</Alert>
        <Alert tone="danger">Could not save: 500 Internal Server Error</Alert>
        <EmptyState icon="🗂️" title="No decks yet" />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <Heading level={2} className="border-b border-border pb-2">
        {title}
      </Heading>
      {children}
    </section>
  );
}
