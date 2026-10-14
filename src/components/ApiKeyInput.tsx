import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { setApiKey } from '@/utils/deepseekApi';

interface ApiKeyInputProps {
  onReady: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onReady }) => {
  const [value, setValue] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setApiKey(value);
      setValue('');
      onReady();
    } catch {
      setError('Paste your OpenRouter key to continue.');
    }
  };

  return (
    <div className="mx-auto grid max-w-[84rem] gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,34rem)_1fr] lg:py-24">
      <form onSubmit={submit} noValidate>
        <h1 className="font-display text-[clamp(2.75rem,6vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.01em]">
          Connect your OpenRouter key
        </h1>
        <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          Plans are written by an AI model that your browser calls directly through OpenRouter. There is no account here
          and no server of ours in between.
        </p>

        <div className="mt-10">
          <label htmlFor="api-key" className="label-caps mb-2 block">
            OpenRouter API key
          </label>
          <div className="flex gap-2">
            <Input
              id="api-key"
              type={show ? 'text' : 'password'}
              autoComplete="off"
              spellCheck={false}
              placeholder="sk-or-…"
              value={value}
              onChange={e => {
                setValue(e.target.value);
                setError('');
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'api-key-error api-key-help' : 'api-key-help'}
              className="font-label tracking-wide"
            />
            <Button type="button" variant="outline" className="h-12 shrink-0" onClick={() => setShow(s => !s)} aria-pressed={show}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </div>
          <p id="api-key-error" role="alert" className="mt-2 min-h-[1.5rem] font-medium text-destructive">
            {error}
          </p>
          <p id="api-key-help" className="text-[0.9375rem] leading-relaxed text-muted-foreground">
            Create one at{' '}
            <a className="text-primary underline underline-offset-4" href="https://openrouter.ai/keys" target="_blank" rel="noreferrer">
              openrouter.ai/keys
            </a>
            . It stays in this tab’s memory and is gone when you reload or close the tab.
          </p>
        </div>

        <Button type="submit" size="lg" className="mt-8">
          Continue
          <ArrowRight />
        </Button>
      </form>

      <dl className="max-w-[30rem] self-start lg:mt-4 lg:justify-self-end">
        {[
          ['Sent to', 'openrouter.ai, and nowhere else.'],
          ['Kept in', 'this tab’s memory while you work.'],
          ['Cleared when', 'you reload, close the tab, or press Remove key.'],
        ].map(([term, def]) => (
          <div key={term} className="border-t border-border py-4">
            <dt className="label-caps text-muted-foreground">{term}</dt>
            <dd className="mt-1 text-[1.125rem] leading-snug">{def}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default ApiKeyInput;
