import React from 'react';
import { Flag, Strikethrough } from 'lucide-react';
import { cn } from '@/lib/utils';
import RichText from '@/components/RichText';
import { PlanNode, SymbolIcon, TIERS, typeInfo } from './symbols';

interface StripRackProps {
  nodes: PlanNode[];
  selectedId: string | null;
  hoveredId: string | null;
  flagged: ReadonlySet<string>;
  struck: ReadonlySet<string>;
  descriptions: Record<string, string>;
  describing: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onToggleFlag: (id: string) => void;
  onToggleStrike: (id: string) => void;
}

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 } as const;
const PRIORITY_WORD = { high: 'High', medium: 'Medium', low: 'Low' } as const;

const Field: React.FC<{ name: string; children: React.ReactNode; className?: string }> = ({ name, children, className }) => (
  <div className={cn('min-w-0 border border-strip-edge px-2 pb-1 pt-0.5', className)}>
    <div className="font-label text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-foreground/70">{name}</div>
    <div className="break-words font-label text-[0.9375rem] font-semibold leading-tight">{children}</div>
  </div>
);

const StripRack: React.FC<StripRackProps> = ({
  nodes,
  selectedId,
  hoveredId,
  flagged,
  struck,
  descriptions,
  describing,
  onSelect,
  onHover,
  onToggleFlag,
  onToggleStrike,
}) => {
  const byId = new Map(nodes.map(n => [n.id, n]));
  const bays = TIERS.map((name, tier) => ({
    name,
    items: nodes
      .filter(n => typeInfo(n.type).tier === tier)
      .sort(
        (a, b) =>
          PRIORITY_RANK[a.priority ?? 'medium'] - PRIORITY_RANK[b.priority ?? 'medium'] || a.label.localeCompare(b.label),
      ),
  })).filter(b => b.items.length > 0);

  return (
    <div className="space-y-6">
      {bays.map(bay => (
        <section key={bay.name} aria-label={`${bay.name} bay`}>
          <div className="h-1.5 rounded-[1px] bg-foreground/85" aria-hidden="true" />
          <h3 className="label-caps mb-2.5 mt-2 flex items-baseline justify-between text-muted-foreground">
            <span>{bay.name}</span>
            <span className="tabular-nums">{bay.items.length}</span>
          </h3>
          <ol className="space-y-2">
            {bay.items.map(n => {
              const info = typeInfo(n.type);
              const isSel = selectedId === n.id;
              const isFlag = flagged.has(n.id);
              const isStruck = struck.has(n.id);
              const feeds = n.connections.map(id => byId.get(id)?.label).filter(Boolean) as string[];
              // The model usually opens with the part's own name in bold; the strip already shows it.
              const description = descriptions[n.id]?.replace(/^\s*\*\*[^*\n]+\*\*\s*\n+/, '');
              return (
                <li
                  key={n.id}
                  onMouseEnter={() => onHover(n.id)}
                  onMouseLeave={() => onHover(null)}
                  className={cn(
                    'border bg-strip text-foreground shadow-[0_1px_0_hsl(var(--strip-edge)),0_3px_8px_-4px_hsl(208_36%_12%/0.35)] transition-[margin,box-shadow,opacity] duration-200 ease-out',
                    isSel ? 'border-primary' : 'border-strip-edge',
                    isFlag && 'ml-4',
                    isStruck && 'border-dashed opacity-70',
                    hoveredId === n.id && !isSel && 'border-foreground/50',
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={isSel}
                    onClick={() => onSelect(n.id)}
                    onFocus={() => onHover(n.id)}
                    onBlur={() => onHover(null)}
                    className="block w-full px-3 py-2.5 text-left focus-visible:outline-offset-[-2px]"
                  >
                    <span className="flex items-center gap-3">
                      <SymbolIcon type={n.type} priority={n.priority} size={34} className="shrink-0 text-foreground" />
                      <span className={cn('min-w-0 flex-1 font-label text-[1.0625rem] font-semibold leading-tight', isStruck && 'line-through')}>
                        {n.label}
                      </span>
                      {isFlag && (
                        <span className="flex items-center gap-1 font-label text-xs font-semibold uppercase tracking-[0.08em] text-destructive">
                          <Flag className="size-3.5 fill-current" aria-hidden="true" />
                          Flagged
                        </span>
                      )}
                    </span>
                    <span className="mt-2 grid grid-cols-2 gap-1">
                      <Field name="Type">{info.name}</Field>
                      <Field name="Priority">{PRIORITY_WORD[n.priority ?? 'medium']}</Field>
                      <Field name="Feeds" className="col-span-2">
                        {feeds.length ? feeds.join(', ') : 'Nothing downstream'}
                      </Field>
                    </span>
                  </button>

                  {isSel && (
                    <div className="border-t border-strip-edge px-3 pb-3 pt-2.5">
                      <div className="font-label text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-foreground/70">Remarks</div>
                      {description ? (
                        <RichText text={description} className="mt-1 max-w-[60ch] text-[0.9375rem] leading-relaxed text-foreground/90" />
                      ) : (
                        <p className="mt-1 text-[0.9375rem] text-foreground/70">
                          {describing ? 'Writing remarks for this part…' : 'The model wrote no remarks for this part.'}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          aria-pressed={isFlag}
                          onClick={() => onToggleFlag(n.id)}
                          className={cn(
                            'inline-flex h-9 items-center gap-1.5 border px-3 font-label text-[0.8125rem] font-semibold uppercase tracking-[0.06em] transition-colors',
                            isFlag
                              ? 'border-destructive bg-destructive text-destructive-foreground'
                              : 'border-foreground/60 hover:bg-foreground hover:text-background',
                          )}
                        >
                          <Flag className="size-3.5" aria-hidden="true" />
                          {isFlag ? 'Unflag' : 'Flag to discuss'}
                        </button>
                        <button
                          type="button"
                          aria-pressed={isStruck}
                          onClick={() => onToggleStrike(n.id)}
                          className={cn(
                            'inline-flex h-9 items-center gap-1.5 border px-3 font-label text-[0.8125rem] font-semibold uppercase tracking-[0.06em] transition-colors',
                            isStruck
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-foreground/60 hover:bg-foreground hover:text-background',
                          )}
                        >
                          <Strikethrough className="size-3.5" aria-hidden="true" />
                          {isStruck ? 'Restore' : 'Strike from plan'}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
};

export default StripRack;
