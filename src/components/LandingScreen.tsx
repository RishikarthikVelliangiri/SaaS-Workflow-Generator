import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ArchitectureChart from '@/components/chart/ArchitectureChart';
import Legend from '@/components/chart/Legend';
import { layoutPlan } from '@/components/chart/layout';
import type { PlanNode } from '@/components/chart/symbols';

interface LandingScreenProps {
  initialIdea: string;
  onStart: (idea: string) => void;
}

const node = (id: string, label: string, type: string, priority: PlanNode['priority'], connections: string[]): PlanNode => ({
  id,
  label,
  type,
  priority,
  connections,
  x: 0,
  y: 0,
});

// Synthetic example for the first screen. It is labelled as an example beside the chart.
const EXAMPLE = layoutPlan(
  [
    node('web', 'Booking app', 'frontend', 'high', ['auth', 'api']),
    node('cdn', 'Asset delivery', 'cdn', 'low', ['web']),
    node('auth', 'Sign-in', 'auth', 'high', ['core']),
    node('api', 'API', 'api', 'high', ['core']),
    node('core', 'Scheduling service', 'backend', 'high', ['db', 'pay', 'sms']),
    node('db', 'Appointments DB', 'database', 'high', []),
    node('pay', 'Deposits', 'payment', 'medium', []),
    node('sms', 'Reminders', 'notification', 'medium', []),
  ],
  720,
);

const LandingScreen: React.FC<LandingScreenProps> = ({ initialIdea, onStart }) => {
  const [idea, setIdea] = React.useState(initialIdea);
  const [error, setError] = React.useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) onStart(idea.trim());
    else setError('Describe your idea in a sentence to continue.');
  };

  return (
    <div className="mx-auto grid max-w-[84rem] gap-x-14 gap-y-12 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:py-16">
      <div className="self-start">
        <h1 className="font-display text-[clamp(3rem,6.4vw,5.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.01em]">
          Plot your SaaS before you build it
        </h1>
        <p className="mt-6 max-w-[44ch] text-[1.125rem] leading-relaxed text-muted-foreground">
          Describe the idea and answer six plain questions. You get a diagram of the parts, the technology for each, and
          the reason it was chosen.
        </p>

        <form onSubmit={submit} className="mt-10 max-w-[34rem]">
          <label htmlFor="idea" className="label-caps mb-2 block">
            Your idea
          </label>
          <Textarea
            id="idea"
            rows={5}
            value={idea}
            onChange={e => {
              setIdea(e.target.value);
              setError('');
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'idea-error' : undefined}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(e);
            }}
            placeholder="A project management tool for remote teams"
            className="min-h-[9.5rem] resize-none"
          />
          <p id="idea-error" role="alert" className="mt-2 min-h-[1.5rem] font-medium text-destructive">
            {error}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button type="submit" size="lg">
              Plan this idea
              <ArrowRight />
            </Button>
            <p className="text-[0.9375rem] text-muted-foreground">Runs on your own OpenRouter key.</p>
          </div>
        </form>
      </div>

      <figure className="min-w-0 self-start">
        <div className="overflow-x-auto border border-border bg-card">
          <div className="min-w-[560px] p-2">
            <ArchitectureChart
              nodes={EXAMPLE.nodes}
              layout={EXAMPLE}
              readOnly
              animate
              label="Example architecture chart for a dog groomer booking tool"
            />
          </div>
        </div>
        <figcaption className="mt-3 text-[0.9375rem] text-muted-foreground">
          Example plan for a dog-groomer booking tool. It is a sample, not generated from your idea.
        </figcaption>
        <Legend types={EXAMPLE.nodes.map(n => n.type)} className="mt-5" />
      </figure>
    </div>
  );
};

export default LandingScreen;
