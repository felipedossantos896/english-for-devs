import { useState, type ReactNode } from 'react';
import { AlertCircle, PartyPopper, Plus } from 'lucide-react';
import { Field } from '@/components/field';
import { EmptyState, LoadingState } from '@/components/states';
import { Stat } from '@/components/stat';
import { Eyebrow, Heading, PageHeader, Text } from '@/components/typography';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const swatches = [
  { name: 'navy', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
  { name: 'red', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { name: 'ink', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
];

const semantic = ['primary', 'highlight', 'background', 'card', 'accent', 'muted', 'border', 'foreground', 'muted-foreground', 'success', 'destructive'];

/** Living reference of the design system at /ui. Not linked from the main navigation. */
export function StyleguidePage() {
  const [chip, setChip] = useState('all');
  const [checked, setChecked] = useState(true);

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Design system" title="UI components" description="shadcn/ui components themed with the US-flag palette." />

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
              <span key={name} className="flex items-center gap-2 rounded-full border bg-card py-1 pr-3 pl-1 text-xs">
                <span className="size-5 rounded-full border border-black/10" style={{ background: `var(--${name})` }} />
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

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="highlight">Highlight</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add">
            <Plus />
          </Button>
        </div>
      </Section>

      <Section title="Card">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Core vocabulary</CardTitle>
            <CardDescription>14 due · 20 new · 120 total</CardDescription>
          </CardHeader>
          <CardContent>
            <Text size="sm" tone="muted">
              Cards group related content with a header, body and footer.
            </Text>
          </CardContent>
          <CardFooter className="gap-2">
            <Button>Review</Button>
            <Button variant="ghost">Manage cards</Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Form">
        <Card>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Front" hint="The English word or phrase.">
              {(props) => <Input {...props} placeholder="deploy" />}
            </Field>
            <Field label="Stage">
              {(props) => (
                <Select defaultValue="behavioral">
                  <SelectTrigger {...props}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </Field>
            <Field label="With error" error="This field is required.">
              {(props) => <Input {...props} />}
            </Field>
            <Field label="Notes">{(props) => <Textarea {...props} />}</Field>
            <div className="flex items-center gap-3">
              <Checkbox id="sg-check" checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
              <Label htmlFor="sg-check">Review flashcards</Label>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Badge, toggle group and tabs">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="highlight">Highlight</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
        <ToggleGroup type="single" aria-label="Example filter" value={chip} onValueChange={(v) => v && setChip(v)}>
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="hr">HR screen</ToggleGroupItem>
          <ToggleGroupItem value="tech">Technical</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" variant="square" aria-label="Example score" defaultValue="4">
          {[1, 2, 3, 4, 5].map((n) => (
            <ToggleGroupItem key={n} value={String(n)}>
              {n}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Tabs defaultValue="answer">
          <TabsList aria-label="Example tabs">
            <TabsTrigger value="answer">My answer</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
          </TabsList>
          <TabsContent value="answer">
            <Text size="sm" tone="muted">
              Answer tab content.
            </Text>
          </TabsContent>
          <TabsContent value="practice">
            <Text size="sm" tone="muted">
              Practice tab content.
            </Text>
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Progress and stat">
        <Card>
          <CardContent className="flex items-center gap-6">
            <Progress aria-label="Example progress" value={60} />
            <Stat icon="🔥" value={12} label="weekday streak" tone="highlight" />
          </CardContent>
        </Card>
      </Section>

      <Section title="Feedback">
        <Alert>
          <AlertDescription>No study tasks today. Enjoy the weekend.</AlertDescription>
        </Alert>
        <Alert variant="success">
          <PartyPopper />
          <AlertDescription>All done for today. Great work!</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Could not save</AlertTitle>
          <AlertDescription>500 Internal Server Error</AlertDescription>
        </Alert>
        <LoadingState />
        <EmptyState icon="🗂️" title="No decks yet" />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <Heading level={2} className="border-b pb-2">
        {title}
      </Heading>
      {children}
    </section>
  );
}
