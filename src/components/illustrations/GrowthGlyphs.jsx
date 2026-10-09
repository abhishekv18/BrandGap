import { C } from './parts'

/**
 * Quiet line drawings for the growth-system cards: thin near-black lines,
 * one terracotta accent, lots of air. The card's own text stays primary.
 * Drawn in a 120 × 60 box; strokes stay hairline at any size.
 */
const line = { fill: 'none', stroke: C.ink, strokeWidth: 1, vectorEffect: 'non-scaling-stroke', strokeLinecap: 'round' }

const GLYPHS = {
  // A positioning map: two axes, a few rivals, and the open space marked.
  strategy: (
    <>
      <path d="M14 30 H106 M60 6 V54" {...line} opacity={0.55} />
      {[
        [34, 18],
        [44, 42],
        [76, 40],
        [28, 40],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={1.6} fill={C.ink} opacity={0.7} />
      ))}
      <path d="M84 12 L94 22 M94 12 L84 22" stroke={C.terra} strokeWidth={1.4} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
    </>
  ),
  // Three storyboard frames; the first one holds the hook.
  creative: (
    <>
      {[22, 50, 78].map((x) => (
        <rect key={x} x={x} y={14} width={20} height={30} rx={1.5} {...line} />
      ))}
      <circle cx={32} cy={26} r={3.2} fill={C.terra} />
      <path d="M53 38 H67 M81 38 H95" {...line} opacity={0.5} />
    </>
  ),
  // Reach: rings around one point, a few people on them.
  media: (
    <>
      {[8, 16, 24].map((r, i) => (
        <circle key={r} cx={60} cy={30} r={r} {...line} opacity={1 - i * 0.25} strokeDasharray={i ? '2 3' : undefined} />
      ))}
      <circle cx={60} cy={30} r={2.6} fill={C.terra} />
      {[
        [76, 22],
        [44, 40],
        [70, 50],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={1.6} fill={C.ink} opacity={0.7} />
      ))}
    </>
  ),
  // Two variants side by side; one is kept.
  optimization: (
    <>
      <rect x={34} y={12} width={22} height={30} rx={1.5} {...line} opacity={0.5} />
      <rect x={64} y={12} width={22} height={30} rx={1.5} {...line} />
      <path d="M69 50 l4 4 l9 -9" stroke={C.terra} strokeWidth={1.4} fill="none" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
}

export const GLYPH_LABELS = { strategy: 'Position', creative: 'Frames', media: 'Reach', optimization: 'A / B' }

export function GrowthGlyph({ id, className = '', ...rest }) {
  const glyph = GLYPHS[id]
  if (!glyph) return null
  return (
    <svg viewBox="0 0 120 60" aria-hidden className={className} {...rest}>
      {glyph}
    </svg>
  )
}

/** The Growth card's rising line — extremely faint, cream on terracotta. */
export function GrowthLine({ className = '' }) {
  return (
    <svg viewBox="0 0 120 60" aria-hidden preserveAspectRatio="none" className={className}>
      <path d="M4 56 H116" stroke={C.cream} strokeWidth={1} opacity={0.25} vectorEffect="non-scaling-stroke" />
      <path
        data-rise
        d="M4 50 C 30 48, 44 40, 60 32 S 92 12, 116 6"
        pathLength={1}
        stroke={C.cream}
        strokeWidth={1}
        opacity={0.4}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
