import React from 'react';

export type Priority = 'high' | 'medium' | 'low';

export interface PlanNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  connections: string[];
  priority?: Priority;
  description?: string;
}

interface TypeInfo {
  name: string;
  gloss: string;
  tier: number;
}

export const TIERS = ['Client', 'Access', 'Core', 'Data', 'Services'] as const;

// One entry per component type the model may emit. `gloss` is the plain-language reading
// shown in the legend, so a founder never has to know the jargon.
export const TYPE_INFO: Record<string, TypeInfo> = {
  frontend: { name: 'Frontend', gloss: 'What people see and click: the website or app screens.', tier: 0 },
  cdn: { name: 'CDN', gloss: 'Copies of your files placed near users so pages load fast.', tier: 0 },
  auth: { name: 'Auth', gloss: 'Checks who someone is and what they are allowed to do.', tier: 1 },
  api: { name: 'API', gloss: 'The doorway the frontend uses to ask the backend for things.', tier: 1 },
  backend: { name: 'Backend', gloss: 'The server logic that does the work: rules, workflows, calculations.', tier: 2 },
  database: { name: 'Database', gloss: 'Where your data lives permanently: accounts, orders, records.', tier: 3 },
  storage: { name: 'File storage', gloss: 'Keeps uploads and large files: images, documents, video.', tier: 3 },
  cache: { name: 'Cache', gloss: 'Fast short-term memory so common requests answer instantly.', tier: 3 },
  payment: { name: 'Payments', gloss: 'Takes money and manages subscriptions.', tier: 4 },
  notification: { name: 'Notifications', gloss: 'Sends emails, texts or in-app alerts.', tier: 4 },
  analytics: { name: 'Analytics', gloss: 'Records how people use the product.', tier: 4 },
  monitoring: { name: 'Monitoring', gloss: 'Watches the system and warns you when something breaks.', tier: 4 },
  component: { name: 'Other part', gloss: 'A part that does not fit the standard types.', tier: 4 },
};

export const typeInfo = (type: string): TypeInfo => TYPE_INFO[type] ?? TYPE_INFO.component;

// Glyphs are drawn inside a 36-unit box centred on (0,0): one fixed scale, one shape per type.
const GLYPHS: Record<string, React.ReactNode> = {
  frontend: (
    <>
      <path d="M0,-15 L13,-7.5 L13,7.5 L0,15 L-13,7.5 L-13,-7.5 Z" />
      <circle r="2.4" fill="currentColor" stroke="none" />
    </>
  ),
  backend: (
    <>
      <circle r="11" />
      <path d="M0,-17 V-11 M0,11 V17 M-17,0 H-11 M11,0 H17" />
      <circle r="2.4" fill="currentColor" stroke="none" />
    </>
  ),
  database: (
    <>
      <ellipse cx="0" cy="-9" rx="12" ry="4.2" />
      <path d="M-12,-9 V9 A12,4.2 0 0 0 12,9 V-9" />
      <path d="M-12,0 A12,4.2 0 0 0 12,0" />
    </>
  ),
  api: <path d="M0,-14 L14,11 L-14,11 Z" />,
  auth: (
    <>
      <path d="M0,-15 L14,0 L0,15 L-14,0 Z" />
      <circle r="2.4" fill="currentColor" stroke="none" />
    </>
  ),
  payment: (
    <>
      <circle r="13" />
      <path d="M-7,-3 H7 M-7,3 H7" />
    </>
  ),
  storage: (
    <>
      <rect x="-12" y="-12" width="24" height="24" />
      <path d="M-12,-4 H12" />
    </>
  ),
  cache: <path d="M3,-15 L-8,2 H0 L-3,15 L8,-3 H0 Z" />,
  cdn: (
    <>
      <circle r="13" />
      <ellipse rx="5.5" ry="13" />
      <path d="M-13,0 H13" />
    </>
  ),
  notification: <path d="M-14,-11 L14,-11 L0,14 Z" />,
  analytics: (
    <>
      <path d="M-13,12 H13" />
      <rect x="-10" y="1" width="5" height="11" />
      <rect x="-2.5" y="-5" width="5" height="17" />
      <rect x="5" y="-12" width="5" height="24" />
    </>
  ),
  monitoring: (
    <>
      <circle r="13" />
      <path d="M-9,0 H-4 L-2,-7 L2,7 L4,0 H9" />
    </>
  ),
  component: <circle r="13" strokeDasharray="3 3" />,
};

export const RING_RADIUS = 21;

interface SymbolProps {
  type: string;
  priority?: Priority;
  struck?: boolean;
  className?: string;
}

/** Drafted navaid-style symbol with its priority ring. Priority is carried by ring form, never hue. */
export const NavSymbol: React.FC<SymbolProps> = ({ type, priority = 'medium', struck, className }) => {
  const glyph = GLYPHS[type] ?? GLYPHS.component;
  return (
    <g className={className} style={{ fill: 'hsl(var(--card))' }} stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round">
      <circle r={RING_RADIUS} stroke="none" />
      {priority === 'high' && <circle r={RING_RADIUS + 3.5} fill="none" strokeWidth="1.25" />}
      <circle
        r={RING_RADIUS}
        fill="none"
        strokeWidth={priority === 'low' ? 1.25 : 1.75}
        strokeDasharray={priority === 'low' || struck ? '3 3' : undefined}
      />
      {glyph}
    </g>
  );
};

/** Standalone symbol for use in HTML (legend, strips). */
export const SymbolIcon: React.FC<{ type: string; priority?: Priority; size?: number; className?: string }> = ({
  type,
  priority = 'medium',
  size = 32,
  className,
}) => (
  <svg width={size} height={size} viewBox="-28 -28 56 56" aria-hidden="true" className={className}>
    <NavSymbol type={type} priority={priority} />
  </svg>
);
