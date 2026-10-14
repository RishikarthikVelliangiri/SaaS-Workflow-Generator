import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  short: string;
  question: string;
  type: 'textarea' | 'select' | 'multiselect';
  options?: string[];
  placeholder?: string;
}

const questions: Question[] = [
  {
    id: 'audience',
    short: 'Audience',
    question: 'Who is your target audience?',
    type: 'textarea',
    placeholder: 'Describe your ideal users, their needs, and pain points...',
  },
  {
    id: 'features',
    short: 'Features',
    question: 'What are the core features you envision?',
    type: 'textarea',
    placeholder: 'List the main features and functionalities...',
  },
  {
    id: 'authentication',
    short: 'Sign-in',
    question: 'What authentication methods do you need?',
    type: 'multiselect',
    options: ['Email/Password', 'Social Login (Google, GitHub)', 'SSO', 'Multi-factor Authentication'],
  },
  {
    id: 'payment',
    short: 'Payments',
    question: 'Do you need payment processing?',
    type: 'select',
    options: ['No payments needed', 'One-time payments', 'Subscriptions', 'Both one-time and subscriptions'],
  },
  {
    id: 'scale',
    short: 'Scale',
    question: 'What scale are you planning for?',
    type: 'select',
    options: ['MVP (< 1K users)', 'Growing (1K-10K users)', 'Scale (10K-100K users)', 'Enterprise (100K+ users)'],
  },
  {
    id: 'integrations',
    short: 'Integrations',
    question: 'Any specific third-party integrations needed?',
    type: 'textarea',
    placeholder: 'APIs, services, or tools you want to integrate...',
  },
];

const AI = 'AI_DECIDE';

interface RequirementsGatheringProps {
  idea: string;
  initial: Record<string, any>;
  onComplete: (responses: Record<string, any>) => void;
  onBack: (responses: Record<string, any>) => void;
}

const isEmpty = (v: unknown) => v === undefined || v === '' || (Array.isArray(v) && v.length === 0);

const RequirementsGathering: React.FC<RequirementsGatheringProps> = ({ idea, initial, onComplete, onBack }) => {
  const [step, setStep] = React.useState(0);
  const [responses, setResponses] = React.useState<Record<string, any>>(initial);
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  const q = questions[step];
  const value = responses[q.id];
  const delegated = value === AI;
  const last = step === questions.length - 1;

  React.useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const update = (v: any) => setResponses(prev => ({ ...prev, [q.id]: v }));

  // A question left blank is sent as "let the AI decide", not as an empty string in the prompt.
  const finish = () => {
    const out: Record<string, any> = {};
    for (const item of questions) out[item.id] = isEmpty(responses[item.id]) ? AI : responses[item.id];
    onComplete(out);
  };

  const next = () => (last ? finish() : setStep(step + 1));
  const back = () => (step === 0 ? onBack(responses) : setStep(step - 1));

  const status = (id: string) => {
    const v = responses[id];
    if (v === AI) return 'AI decides';
    return isEmpty(v) ? '' : 'Answered';
  };

  const renderInput = () => {
    if (delegated) {
      return (
        <div className="border border-border bg-card p-5">
          <p className="max-w-[52ch] text-[1.0625rem] leading-relaxed">
            The model will choose for this one from your idea and general good practice.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => update('')}>
            Answer it myself
          </Button>
        </div>
      );
    }

    if (q.type === 'textarea') {
      return (
        <Textarea
          aria-labelledby="question-heading"
          value={typeof value === 'string' ? value : ''}
          onChange={e => update(e.target.value)}
          placeholder={q.placeholder}
          rows={5}
          className="max-w-[44rem] resize-none"
        />
      );
    }

    const multi = q.type === 'multiselect';
    const selected: string[] = multi ? (Array.isArray(value) ? value : []) : [];
    return (
      <fieldset className="max-w-[44rem]">
        <legend className="sr-only">{q.question}</legend>
        <div className="border-b border-border">
          {q.options!.map(option => {
            const on = multi ? selected.includes(option) : value === option;
            return (
              <label
                key={option}
                className={cn(
                  'flex min-h-[3.5rem] cursor-pointer items-center gap-4 border-t border-border px-3 py-3 transition-colors hover:bg-accent/60',
                  on && 'bg-accent',
                )}
              >
                <input
                  type={multi ? 'checkbox' : 'radio'}
                  name={q.id}
                  checked={on}
                  onChange={() =>
                    multi ? update(on ? selected.filter(s => s !== option) : [...selected, option]) : update(option)
                  }
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid size-5 shrink-0 place-items-center border-[1.5px] border-foreground/70 text-primary-foreground transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring',
                    multi ? 'rounded-[2px]' : 'rounded-full',
                    on && 'border-primary bg-primary',
                  )}
                >
                  {on && (multi ? <Check className="size-3.5" strokeWidth={3} /> : <span className="size-2 rounded-full bg-primary-foreground" />)}
                </span>
                <span className="text-[1.0625rem]">{option}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  };

  return (
    <div className="mx-auto grid max-w-[84rem] gap-x-16 gap-y-10 px-5 py-10 sm:px-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:py-16">
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <nav aria-label="Questions">
          <div className="h-1.5 rounded-[1px] bg-foreground/85" aria-hidden="true" />
          <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:block lg:space-y-2">
            {questions.map((item, i) => {
              const s = status(item.id);
              const current = i === step;
              return (
                <li
                  key={item.id}
                  className={cn(
                    'border bg-strip shadow-[0_1px_0_hsl(var(--strip-edge)),0_3px_8px_-4px_hsl(208_36%_12%/0.35)] transition-[margin] duration-200 ease-out',
                    current ? 'border-primary shadow-[0_0_0_1px_hsl(var(--primary))]' : 'border-strip-edge',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    aria-current={current ? 'step' : undefined}
                    className="block w-full px-2.5 py-2 text-left"
                  >
                    <span className={cn('flex items-baseline gap-2 font-label text-[0.9375rem] uppercase tracking-[0.07em]', current ? 'font-bold' : 'font-semibold')}>
                      <span className="tabular-nums">{i + 1}</span>
                      {item.short}
                    </span>
                    <span className="mt-0.5 block min-h-[1rem] font-label text-[0.75rem] uppercase tracking-[0.06em] text-muted-foreground">
                      {s || 'Open'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="mt-8 hidden lg:block">
          <p className="label-caps text-muted-foreground">Your idea</p>
          <p className="mt-1.5 line-clamp-4 text-[0.9375rem] leading-relaxed">{idea}</p>
          <button
            type="button"
            onClick={() => onBack(responses)}
            className="mt-2 text-[0.9375rem] text-primary underline underline-offset-4"
          >
            Change idea
          </button>
        </div>
      </aside>

      <section aria-labelledby="question-heading" className="min-w-0">
        <h2
          id="question-heading"
          ref={headingRef}
          tabIndex={-1}
          className="max-w-[20ch] font-display text-[clamp(2.25rem,4.4vw,3.75rem)] font-bold uppercase leading-[0.98] tracking-[-0.005em] outline-none"
        >
          {q.question}
        </h2>

        <div className="mt-8">{renderInput()}</div>

        {!delegated && (
          <button
            type="button"
            onClick={() => update(AI)}
            className="mt-5 text-[0.9375rem] text-primary underline underline-offset-4"
          >
            Not sure? Let the AI decide this one
          </button>
        )}

        <div className="mt-12 flex max-w-[44rem] items-center justify-between border-t border-border pt-6">
          <Button variant="ghost" onClick={back}>
            <ArrowLeft />
            {step === 0 ? 'Idea' : 'Back'}
          </Button>
          <Button size="lg" onClick={next}>
            {last ? 'Generate plan' : 'Next'}
            <ArrowRight />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default RequirementsGathering;
