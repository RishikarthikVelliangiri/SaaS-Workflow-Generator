import React from 'react';
import { NavSymbol, PlanNode, RING_RADIUS, typeInfo } from './symbols';
import type { Layout } from './layout';

interface ArchitectureChartProps {
  nodes: PlanNode[];
  layout: Pick<Layout, 'width' | 'height' | 'zones'>;
  selectedId?: string | null;
  hoveredId?: string | null;
  flagged?: ReadonlySet<string>;
  struck?: ReadonlySet<string>;
  readOnly?: boolean;
  animate?: boolean;
  label: string;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
  onMove?: (id: string, x: number, y: number) => void;
}

const R = RING_RADIUS + 5;
const EDGE_INK = 'hsl(var(--primary))';
const EDGE_QUIET = 'hsl(var(--input))';

const wrap = (text: string, max = 18): string[] => {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  for (const w of words) {
    const last = lines[lines.length - 1];
    if (last !== undefined && (last + ' ' + w).length <= max) lines[lines.length - 1] = last + ' ' + w;
    else lines.push(w);
  }
  if (lines.length > 2) {
    const kept = lines.slice(0, 2);
    kept[1] = kept[1].slice(0, max - 1) + '…';
    return kept;
  }
  return lines;
};

/**
 * Schematic routing: leave the source horizontally, run vertically in the gutter at the edge of the
 * source's zone, enter the target horizontally. Keeps lines out of the label columns.
 * Components in the same column (or nearly) are joined by a straight vertical line.
 */
const route = (s: PlanNode, t: PlanNode, zones: Layout['zones']): { d: string; len: number } => {
  if (Math.abs(t.x - s.x) < 72) {
    const dir = t.y >= s.y ? 1 : -1;
    const y1 = s.y + dir * R;
    const y2 = t.y - dir * (R + 3);
    return { d: `M${s.x},${y1} L${t.x},${y2}`, len: Math.abs(y2 - y1) };
  }
  const dir = t.x > s.x ? 1 : -1;
  const zone = zones.find(z => s.x >= z.left && s.x < z.right) ?? zones[zones.length - 1];
  const gutter = dir > 0 ? zone.right : zone.left;
  const xm = Math.abs(gutter - s.x) < 56 || Math.abs(t.x - gutter) < 56 ? (s.x + t.x) / 2 : gutter;
  const x1 = s.x + dir * R;
  const x2 = t.x - dir * (R + 3);
  const y1 = s.y;
  const y2 = t.y;
  if (Math.abs(y2 - y1) < 2) return { d: `M${x1},${y1} L${x2},${y2}`, len: Math.abs(x2 - x1) };
  const vy = y2 > y1 ? 1 : -1;
  const r = Math.min(10, Math.abs(y2 - y1) / 2, Math.abs(xm - x1), Math.abs(x2 - xm));
  return {
    d: `M${x1},${y1} L${xm - dir * r},${y1} Q${xm},${y1} ${xm},${y1 + vy * r} L${xm},${y2 - vy * r} Q${xm},${y2} ${xm + dir * r},${y2} L${x2},${y2}`,
    len: Math.abs(xm - x1) + Math.abs(y2 - y1) + Math.abs(x2 - xm),
  };
};

const halo: React.CSSProperties = {
  paintOrder: 'stroke',
  stroke: 'hsl(var(--card))',
  strokeWidth: 5,
  strokeLinejoin: 'round',
};

const ArchitectureChart: React.FC<ArchitectureChartProps> = ({
  nodes,
  layout,
  selectedId,
  hoveredId,
  flagged,
  struck,
  readOnly,
  animate,
  label,
  onSelect,
  onHover,
  onMove,
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const drag = React.useRef<{ id: string; dx: number; dy: number } | null>(null);
  const { width, height, zones } = layout;
  const byId = React.useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);
  const active = hoveredId ?? selectedId ?? null;

  const clamp = (x: number, y: number) => ({
    x: Math.max(48, Math.min(width - 48, x)),
    y: Math.max(60, Math.min(height - 76, y)),
  });

  const toSvg = (e: React.PointerEvent) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  };

  const edges: { key: string; s: PlanNode; t: PlanNode }[] = [];
  const seen = new Set<string>();
  for (const s of nodes) {
    for (const id of s.connections) {
      const t = byId.get(id);
      const key = `${s.id}>${id}`;
      if (!t || t.id === s.id || seen.has(key)) continue;
      seen.add(key);
      edges.push({ key, s, t });
    }
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="group"
      aria-label={label}
      className="block h-auto w-full select-none"
      style={{ touchAction: readOnly ? undefined : 'pan-y' }}
    >
      <defs>
        <marker id="arrow-ink" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="9" markerHeight="9" orient="auto">
          <path d="M1.5,1.5 L8.5,5 L1.5,8.5" fill="none" style={{ stroke: EDGE_INK }} strokeWidth="1.6" />
        </marker>
        <marker id="arrow-quiet" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="9" markerHeight="9" orient="auto">
          <path d="M1.5,1.5 L8.5,5 L1.5,8.5" fill="none" style={{ stroke: EDGE_QUIET }} strokeWidth="1.6" />
        </marker>
      </defs>

      {/* Neatline, zone rules and zone names */}
      <rect x="0.5" y="0.5" width={width - 1} height={height - 1} fill="none" style={{ stroke: 'hsl(var(--border))' }} />
      {zones.map((z, i) => (
        <g key={z.name}>
          {i > 0 && <line x1={z.left} x2={z.left} y1="1" y2={height - 1} style={{ stroke: 'hsl(var(--border))' }} strokeDasharray="2 5" />}
          <text
            x={z.x}
            y="34"
            textAnchor="middle"
            className="font-label"
            style={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}
          >
            {z.name}
          </text>
        </g>
      ))}
      {Array.from({ length: Math.floor(width / 25) + 1 }, (_, i) => i * 25).map(x => (
        <line
          key={x}
          x1={x}
          x2={x}
          y1={height}
          y2={height - (x % 100 === 0 ? 9 : 4)}
          style={{ stroke: 'hsl(var(--input))' }}
        />
      ))}

      {/* Airways */}
      {edges.map(({ key, s, t }, i) => {
        const { d, len } = route(s, t, zones);
        const isStruck = struck?.has(s.id) || struck?.has(t.id);
        const lit = active !== null && (s.id === active || t.id === active);
        const dim = active !== null && !lit;
        const quiet = isStruck || dim;
        return (
          <path
            key={key}
            d={d}
            fill="none"
            className={animate ? 'plot-line' : undefined}
            markerEnd={quiet ? 'url(#arrow-quiet)' : 'url(#arrow-ink)'}
            strokeDasharray={isStruck ? '5 5' : undefined}
            strokeWidth={lit ? 2.75 : 1.75}
            style={{
              stroke: quiet ? EDGE_QUIET : EDGE_INK,
              ['--len' as string]: Math.round(len),
              ['--delay' as string]: `${i * 70}ms`,
            }}
          />
        );
      })}

      {/* Components */}
      {nodes.map(n => {
        const info = typeInfo(n.type);
        const isSel = selectedId === n.id;
        const isStruck = struck?.has(n.id);
        const isFlag = flagged?.has(n.id);
        const lines = wrap(n.label);
        return (
          <g
            key={n.id}
            transform={`translate(${n.x},${n.y})`}
            tabIndex={readOnly ? -1 : 0}
            role={readOnly ? undefined : 'button'}
            aria-pressed={readOnly ? undefined : isSel}
            aria-label={readOnly ? undefined : `${n.label}, ${info.name}, ${n.priority ?? 'medium'} priority. Arrow keys move it.`}
            style={{ cursor: readOnly ? 'default' : drag.current?.id === n.id ? 'grabbing' : 'grab', touchAction: 'none', outline: 'none' }}
            className="group/node text-foreground focus-visible:[&_.focus-ring]:opacity-100"
            opacity={isStruck ? 0.6 : 1}
            onPointerEnter={() => onHover?.(n.id)}
            onPointerLeave={() => onHover?.(null)}
            onFocus={() => onHover?.(n.id)}
            onBlur={() => onHover?.(null)}
            onPointerDown={e => {
              if (readOnly) return;
              e.currentTarget.setPointerCapture(e.pointerId);
              const p = toSvg(e);
              drag.current = { id: n.id, dx: n.x - p.x, dy: n.y - p.y };
              onSelect?.(n.id);
            }}
            onPointerMove={e => {
              const d = drag.current;
              if (!d || d.id !== n.id) return;
              const p = toSvg(e);
              const c = clamp(p.x + d.dx, p.y + d.dy);
              onMove?.(n.id, c.x, c.y);
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
            onKeyDown={e => {
              if (readOnly) return;
              const step = e.shiftKey ? 40 : 10;
              const move = (dx: number, dy: number) => {
                e.preventDefault();
                const c = clamp(n.x + dx, n.y + dy);
                onMove?.(n.id, c.x, c.y);
              };
              if (e.key === 'ArrowLeft') move(-step, 0);
              else if (e.key === 'ArrowRight') move(step, 0);
              else if (e.key === 'ArrowUp') move(0, -step);
              else if (e.key === 'ArrowDown') move(0, step);
              else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.(n.id);
              }
            }}
          >
            {/* hit area */}
            <circle r="40" fill="transparent" />
            {/* selection brackets */}
            {isSel && (
              <path
                d="M-34,-24 V-34 H-24 M24,-34 H34 V-24 M34,24 V34 H24 M-24,34 H-34 V24"
                fill="none"
                strokeWidth="2.25"
                style={{ stroke: EDGE_INK }}
              />
            )}
            <rect
              className="focus-ring opacity-0"
              x="-38"
              y="-38"
              width="76"
              height="76"
              fill="none"
              strokeWidth="2"
              strokeDasharray="4 3"
              style={{ stroke: EDGE_INK }}
            />
            <NavSymbol type={n.type} priority={n.priority} struck={isStruck} />
            {isFlag && (
              <g transform="translate(20,-30)">
                <path d="M0,0 V20" strokeWidth="1.75" fill="none" style={{ stroke: 'hsl(var(--destructive))' }} />
                <path d="M0,0 L14,5.5 L0,11 Z" style={{ fill: 'hsl(var(--destructive))' }} />
              </g>
            )}
            <text textAnchor="middle" className="font-label" style={{ ...halo, fill: 'hsl(var(--foreground))', fontSize: 16, fontWeight: 600, textDecoration: isStruck ? 'line-through' : undefined }}>
              {lines.map((l, i) => (
                <tspan key={i} x="0" y={RING_RADIUS + 22 + i * 18}>
                  {l}
                </tspan>
              ))}
            </text>
            <text
              textAnchor="middle"
              x="0"
              y={RING_RADIUS + 22 + lines.length * 18 + 1}
              className="font-label"
              style={{ ...halo, fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              {info.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default ArchitectureChart;
