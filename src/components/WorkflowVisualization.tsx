import React from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RichText from '@/components/RichText';
import ArchitectureChart from '@/components/chart/ArchitectureChart';
import Legend from '@/components/chart/Legend';
import StripRack from '@/components/chart/StripRack';
import { Layout, layoutPlan } from '@/components/chart/layout';
import { NavSymbol, PlanNode, RING_RADIUS } from '@/components/chart/symbols';
import { cn } from '@/lib/utils';
import {
  generateBatchNodeDescriptions,
  generateTechStackWithReasons,
  generateWorkflowExplanation,
  generateWorkflowNodes,
  getApiFailures,
  isTemplateDescription,
  resetApiFailures,
} from '@/utils/deepseekApi';

interface TechItem {
  id: string;
  name: string;
  category: string;
  reason: string;
}

interface WorkflowVisualizationProps {
  projectData: {
    idea: string;
    requirements: Record<string, any>;
  };
  onBack: () => void;
  onRestart: () => void;
}

type Stage = 'workflow' | 'techStack' | 'explanation' | 'descriptions' | 'done';

const STAGES: { id: Exclude<Stage, 'done'>; label: string; detail: string }[] = [
  { id: 'workflow', label: 'Mapping the parts', detail: 'Choosing components and how they connect.' },
  { id: 'techStack', label: 'Choosing technology', detail: 'Picking a tool for each category, with a reason.' },
  { id: 'explanation', label: 'Writing the walkthrough', detail: 'Explaining how the pieces fit your requirements.' },
  { id: 'descriptions', label: 'Describing each part', detail: 'Writing a short note for every component.' },
];

const toggle = (set: ReadonlySet<string>, id: string) => {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
};

// Each stage is a symbol on a short chart; the airway to the next one is plotted when its stage completes.
const STAGE_SYMBOLS = ['backend', 'database', 'api', 'frontend'];
const GEN_W = 760;
const genX = (i: number) => 96 + (i * (GEN_W - 192)) / 3;

const Generating: React.FC<{ stage: Stage }> = ({ stage }) => {
  const current = Math.max(0, STAGES.findIndex(s => s.id === stage));
  return (
    <div className="mx-auto max-w-[84rem] px-5 py-14 sm:px-8 lg:py-24">
      <h1 className="font-display text-[clamp(2.75rem,6vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.01em]">
        Plotting your plan
      </h1>
      <div className="mt-12 max-w-[48rem] overflow-x-auto border border-border bg-card">
        <svg viewBox={`0 0 ${GEN_W} 170`} className="block h-auto w-full min-w-[520px]" role="img" aria-label={`Step ${current + 1} of ${STAGES.length}: ${STAGES[current].label}`}>
          <defs>
            <marker id="gen-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="9" markerHeight="9" orient="auto">
              <path d="M1.5,1.5 L8.5,5 L1.5,8.5" fill="none" style={{ stroke: 'hsl(var(--primary))' }} strokeWidth="1.6" />
            </marker>
          </defs>
          {STAGES.slice(0, -1).map((_, i) => {
            const done = i < current;
            return (
              <path
                key={`${i}-${done}`}
                d={`M${genX(i) + RING_RADIUS + 8},70 H${genX(i + 1) - RING_RADIUS - 11}`}
                fill="none"
                strokeWidth="1.75"
                strokeDasharray={done ? undefined : '5 5'}
                markerEnd={done ? 'url(#gen-arrow)' : undefined}
                className={done ? 'plot-line' : undefined}
                style={{ stroke: done ? 'hsl(var(--primary))' : 'hsl(var(--input))', ['--len' as string]: 120 }}
              />
            );
          })}
          {STAGES.map((s, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <g key={s.id} transform={`translate(${genX(i)},70)`} className={cn(done || active ? 'text-foreground' : 'text-muted-foreground/70')}>
                <NavSymbol type={STAGE_SYMBOLS[i]} priority={done ? 'high' : active ? 'medium' : 'low'} />
                <text
                  textAnchor="middle"
                  y={RING_RADIUS + 28}
                  className="font-label"
                  style={{ fill: 'currentColor', fontSize: 15, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                >
                  {s.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed" role="status" aria-live="polite">
        <span className="font-semibold">{`Step ${current + 1} of ${STAGES.length}. `}</span>
        {STAGES[current].detail}
      </p>
    </div>
  );
};

const WorkflowVisualization: React.FC<WorkflowVisualizationProps> = ({ projectData, onBack, onRestart }) => {
  const [stage, setStage] = React.useState<Stage>('workflow');
  const [nodes, setNodes] = React.useState<PlanNode[]>([]);
  const [layout, setLayout] = React.useState<Pick<Layout, 'width' | 'height' | 'zones'> | null>(null);
  const [techStack, setTechStack] = React.useState<TechItem[]>([]);
  const [explanation, setExplanation] = React.useState('');
  const [descriptions, setDescriptions] = React.useState<Record<string, string>>({});
  const [failure, setFailure] = React.useState<{ count: number; message: string | null } | null>(null);

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [flagged, setFlagged] = React.useState<ReadonlySet<string>>(new Set());
  const [struck, setStruck] = React.useState<ReadonlySet<string>>(new Set());

  const run = React.useCallback(async () => {
    const { idea, requirements } = projectData;
    resetApiFailures();
    setStage('workflow');
    setSelectedId(null);
    setFlagged(new Set());
    setStruck(new Set());
    try {
      const raw = await generateWorkflowNodes(idea, requirements);
      const planned = layoutPlan(raw);
      setNodes(planned.nodes);
      setLayout(planned);

      setStage('techStack');
      setTechStack(await generateTechStackWithReasons(idea, requirements));

      setStage('explanation');
      setExplanation(await generateWorkflowExplanation(idea, requirements, raw));

      setStage('descriptions');
      const written = await generateBatchNodeDescriptions(
        idea,
        raw.map((n: PlanNode) => ({ id: n.id, label: n.label, type: n.type })),
      );
      // Templated filler is not the model's remarks, so it is left out rather than shown as if it were.
      setDescriptions(Object.fromEntries(Object.entries(written).filter(([, text]) => !isTemplateDescription(text))));
    } finally {
      setFailure(getApiFailures());
      setStage('done');
    }
  }, [projectData]);

  const started = React.useRef(false);
  React.useEffect(() => {
    if (started.current) return;
    started.current = true;
    run();
  }, [run]);

  const move = React.useCallback((id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => (n.id === id ? { ...n, x, y } : n)));
  }, []);

  if (stage !== 'done' || !layout) return <Generating stage={stage} />;

  const ids = new Set(nodes.map(n => n.id));
  const linkCount = nodes.reduce((sum, n) => sum + new Set(n.connections.filter(c => ids.has(c) && c !== n.id)).size, 0);
  const categories = [...new Set(techStack.map(t => t.category))];

  return (
    <div className="mx-auto max-w-[84rem] px-5 py-8 sm:px-8 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <div className="min-w-0 max-w-[52rem]">
          <h1 className="line-clamp-2 font-display text-[clamp(2.25rem,4.6vw,3.75rem)] font-semibold leading-[1.02]" title={projectData.idea}>
            {projectData.idea}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft />
            Edit answers
          </Button>
          <Button variant="outline" onClick={onRestart}>
            <RotateCcw />
            New plan
          </Button>
        </div>
      </div>

      {failure && failure.count > 0 && (
        <div role="status" className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-destructive bg-card px-4 py-3">
          <p className="max-w-[70ch] text-[1rem] leading-snug">
            <strong className="font-semibold text-destructive">Part of this plan is a generic template.</strong>{' '}
            {failure.count === 1 ? 'One model request' : `${failure.count} model requests`} failed
            {failure.message ? `: ${failure.message}` : '.'} Check your key and balance, then try again.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              started.current = true;
              run();
            }}
          >
            Try again
          </Button>
        </div>
      )}

      <div className="mt-8 grid gap-x-10 gap-y-12 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <div className="min-w-0 space-y-12">
          <section aria-label="Architecture chart">
            <div className="border border-border bg-card">
              <div className="overflow-x-auto">
              <div className="min-w-[760px] p-3">
                <ArchitectureChart
                  nodes={nodes}
                  layout={layout}
                  selectedId={selectedId}
                  hoveredId={hoveredId}
                  flagged={flagged}
                  struck={struck}
                  animate
                  label={`Architecture chart with ${nodes.length} parts. Select a part to read about it; drag it, or use arrow keys, to move it.`}
                  onSelect={setSelectedId}
                  onHover={setHoveredId}
                  onMove={move}
                />
              </div>
              </div>
              <dl className="grid grid-cols-3 border-t border-border">
                {[
                  ['Parts', String(nodes.length)],
                  ['Links', String(linkCount)],
                  [
                    'Your marks',
                    flagged.size || struck.size
                      ? [flagged.size ? `${flagged.size} flagged` : null, struck.size ? `${struck.size} struck` : null].filter(Boolean).join(', ')
                      : '—',
                  ],
                ].map(([k, v], i) => (
                  <div key={k} className={cn('min-w-0 px-3 py-2', i > 0 && 'border-l border-border')}>
                    <dt className="font-label text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{k}</dt>
                    <dd className="font-label text-[0.9375rem] font-semibold tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-2 text-[0.9375rem] text-muted-foreground">
              Drag a part to rearrange the chart, or focus it and use the arrow keys.
            </p>
          </section>

          <section aria-labelledby="how-heading">
            <h2 id="how-heading" className="font-display text-[1.75rem] font-bold uppercase leading-none tracking-[0.01em]">
              How it fits together
            </h2>
            <RichText text={explanation} className="mt-3 max-w-[65ch] text-[1.0625rem] leading-relaxed" />
          </section>

          <section aria-labelledby="legend-heading">
            <h2 id="legend-heading" className="mb-4 font-display text-[1.75rem] font-bold uppercase leading-none tracking-[0.01em]">
              Reading the chart
            </h2>
            <Legend types={nodes.map(n => n.type)} />
          </section>
        </div>

        <aside aria-labelledby="rack-heading" className="min-w-0 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:self-start xl:overflow-y-auto xl:pr-1">
          <h2 id="rack-heading" className="mb-4 font-display text-[1.75rem] font-bold uppercase leading-none tracking-[0.01em]">
            Parts
          </h2>
          <StripRack
            nodes={nodes}
            selectedId={selectedId}
            hoveredId={hoveredId}
            flagged={flagged}
            struck={struck}
            descriptions={descriptions}
            describing={false}
            onSelect={id => setSelectedId(cur => (cur === id ? null : id))}
            onHover={setHoveredId}
            onToggleFlag={id => setFlagged(s => toggle(s, id))}
            onToggleStrike={id => setStruck(s => toggle(s, id))}
          />
        </aside>
      </div>

      <section aria-labelledby="stack-heading" className="mt-16">
        <h2 id="stack-heading" className="font-display text-[1.75rem] font-bold uppercase leading-none tracking-[0.01em]">
          Technology
        </h2>
        <div className="mt-4 border-b border-border">
          {categories.map(category => (
            <div key={category} className="grid gap-x-8 gap-y-1 border-t border-border py-4 md:grid-cols-[11rem_minmax(0,1fr)]">
              <h3 className="label-caps pt-0.5 text-muted-foreground">{category}</h3>
              <ul className="space-y-3">
                {techStack
                  .filter(t => t.category === category)
                  .map(t => (
                    <li key={t.id} className="max-w-[70ch]">
                      <span className="font-label text-[1.1875rem] font-semibold">{t.name}</span>
                      <span className="mt-0.5 block text-[1rem] leading-relaxed text-muted-foreground">{t.reason}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WorkflowVisualization;
