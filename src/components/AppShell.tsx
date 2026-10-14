import React from 'react';
import { cn } from '@/lib/utils';
import { SymbolIcon } from '@/components/chart/symbols';

export const STEPS = ['Key', 'Idea', 'Questions', 'Plan'] as const;

interface AppShellProps {
  step: number;
  keyActive: boolean;
  onRemoveKey: () => void;
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ step, keyActive, onRemoveKey, children }) => (
  <div className="flex min-h-screen flex-col">
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-[84rem] items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <SymbolIcon type="frontend" size={30} className="text-primary" />
          <span className="font-display text-[1.3125rem] font-semibold uppercase leading-none tracking-[0.04em]">
            SaaS Architect Genesis
          </span>
        </div>

        <nav aria-label="Progress" className="hidden md:block">
          <ol className="flex items-center gap-1">
            {STEPS.map((name, i) => (
              <li
                key={name}
                aria-current={i === step ? 'step' : undefined}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 font-label text-[0.875rem] font-semibold uppercase tracking-[0.08em]',
                  i === step ? 'text-foreground' : i < step ? 'text-muted-foreground' : 'text-muted-foreground/70',
                )}
              >
                <span
                  className={cn(
                    'grid size-5 place-items-center border text-[0.75rem] tabular-nums',
                    i === step ? 'border-foreground bg-foreground text-background' : 'border-current',
                  )}
                >
                  {i + 1}
                </span>
                {name}
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-[7rem] text-right">
          {keyActive && (
            <button
              type="button"
              onClick={onRemoveKey}
              className="font-label text-[0.875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground underline decoration-1 underline-offset-4 hover:text-foreground"
            >
              Remove key
            </button>
          )}
        </div>
      </div>
    </header>
    <main className="flex-1">{children}</main>
  </div>
);

export default AppShell;
