import React from 'react';
import { cn } from '@/lib/utils';
import { SymbolIcon, typeInfo } from './symbols';

interface LegendProps {
  types: string[];
  className?: string;
}

/** Ranked symbol table: each symbol beside its plain-language reading. Only types present in the plan. */
const Legend: React.FC<LegendProps> = ({ types, className }) => {
  const unique = [...new Set(types)].sort((a, b) => typeInfo(a).tier - typeInfo(b).tier);
  return (
    <div className={className}>
      <dl className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
        {unique.map(t => {
          const info = typeInfo(t);
          return (
            <div key={t} className="flex items-start gap-3 border-t border-border py-2.5">
              <SymbolIcon type={t} size={30} className="mt-0.5 shrink-0 text-foreground" />
              <div className="min-w-0">
                <dt className="font-label text-[0.9375rem] font-semibold uppercase tracking-[0.06em]">{info.name}</dt>
                <dd className="text-[0.9375rem] leading-snug text-muted-foreground">{info.gloss}</dd>
              </div>
            </div>
          );
        })}
      </dl>
      <p className={cn('mt-3 border-t border-border pt-3 text-[0.9375rem] leading-snug text-muted-foreground')}>
        A double ring marks high priority, a single ring medium, a dashed ring low. Arrows show which part feeds which.
      </p>
    </div>
  );
};

export default Legend;
