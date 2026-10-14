import { PlanNode, TIERS, typeInfo } from './symbols';

export const CANVAS_W = 1000;
const TOP = 78;
const BOTTOM = 62;
const ROW = 128;

export interface Layout {
  nodes: PlanNode[];
  width: number;
  height: number;
  /** x centre of each occupied tier, with its name */
  zones: { name: string; x: number; left: number; right: number }[];
}

/**
 * Deterministic left-to-right layout by tier (client, access, core, data, services).
 * Runs once per plan; after that the founder's drags are the source of truth.
 * The model's own x/y are ignored: they are unreliable and were being overwritten anyway.
 */
export const layoutPlan = (input: PlanNode[], width = CANVAS_W): Layout => {
  const byTier = new Map<number, PlanNode[]>();
  for (const n of input) {
    const t = typeInfo(n.type).tier;
    byTier.set(t, [...(byTier.get(t) ?? []), n]);
  }
  const tiers = [...byTier.keys()].sort((a, b) => a - b);
  const tallest = Math.max(1, ...tiers.map(t => byTier.get(t)!.length));
  const height = Math.max(440, tallest * ROW + TOP + BOTTOM);
  const colW = width / Math.max(tiers.length, 1);

  const pos = new Map<string, { x: number; y: number }>();
  const zones: Layout['zones'] = [];
  tiers.forEach((t, col) => {
    const list = byTier.get(t)!;
    const x = colW * col + colW / 2;
    zones.push({ name: TIERS[t], x, left: colW * col, right: colW * (col + 1) });
    const span = height - TOP - BOTTOM;
    list.forEach((n, i) => {
      pos.set(n.id, { x, y: TOP + (span * (i + 0.5)) / list.length });
    });
  });

  return {
    nodes: input.map(n => ({ ...n, ...pos.get(n.id)! })),
    width,
    height,
    zones,
  };
};
