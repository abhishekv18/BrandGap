import { AnimatePresence, m } from 'framer-motion'
import { C } from './parts'

/**
 * The BrandGap Method, one small labelled diagram per step, each showing what
 * that step's copy describes (data/approach.js). Same family as the site's other
 * figures: hairline near-black lines, one terracotta accent, small tracked
 * labels. Drawn in a 240 × 150 box. When the step changes the plate crossfades
 * and its lines draw themselves in; reduced motion just swaps.
 */
const EASE = [0.16, 1, 0.3, 1]
const SANS = { fontFamily: 'var(--font-sans)', letterSpacing: '0.14em' }

function Line({ d, delay = 0, opacity = 1, dash, still, accent = false, width, fill = 'none' }) {
  return (
    <m.path
      d={d}
      fill={fill}
      stroke={accent ? C.terra : C.ink}
      strokeWidth={width ?? (accent ? 1.5 : 1)}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dash}
      // No non-scaling-stroke: it measures dashes in screen pixels, which cuts the pathLength
      // draw-in short. The plate always renders near its drawn size, so strokes stay hairline anyway.
      opacity={opacity}
      initial={still || dash ? false : { pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.55, delay: 0.05 + delay * 0.5, ease: EASE }}
    />
  )
}

function Dot({ x, y, r = 2, accent = false, delay = 0, still }) {
  return (
    <m.circle
      cx={x}
      cy={y}
      r={r}
      fill={accent ? C.terra : C.ink}
      opacity={accent ? 1 : 0.75}
      initial={still ? false : { scale: 0 }}
      animate={{ scale: 1 }}
      style={{ transformOrigin: `${x}px ${y}px`, transformBox: 'view-box' }}
      transition={{ duration: 0.35, delay: 0.15 + delay * 0.5, ease: EASE }}
    />
  )
}

/** A small tracked label that fades in after the lines. */
function Tag({ x, y, children, anchor = 'middle', accent = false, delay = 0, still, size = 7.5 }) {
  return (
    <m.text
      x={x}
      y={y}
      fontSize={size}
      textAnchor={anchor}
      fill={accent ? C.terra : C.muted}
      style={SANS}
      initial={still ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.25 + delay * 0.5 }}
    >
      {children.toUpperCase()}
    </m.text>
  )
}

const circle = (x, y, r) => `M${x} ${y} m-${r} 0 a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 -${r * 2} 0`

const PLATES = {
  // Discover — "Business, market, audience, competition, products… We start with the business":
  // the business at the centre, what surrounds it mapped, all under the lens.
  discover: (still) => (
    <>
      {[
        [48, 34],
        [192, 34],
        [48, 112],
        [192, 112],
      ].map(([x, y], i) => (
        <Line key={x + y} still={still} d={`M120 73 L${x} ${y}`} opacity={0.4} delay={i * 0.05} />
      ))}
      {[
        [48, 34, 'Market', 'start', -22, -9],
        [192, 34, 'Audience', 'end', 22, -9],
        [48, 112, 'Competition', 'start', -22, 16],
        [192, 112, 'Products', 'end', 22, 16],
      ].map(([x, y, t, a, dx, dy], i) => (
        <g key={t}>
          <Dot still={still} x={x} y={y} r={3} delay={0.1 + i * 0.05} />
          <Tag still={still} x={x + dx} y={y + dy} anchor={a} delay={i * 0.05}>
            {t}
          </Tag>
        </g>
      ))}
      <Line still={still} d={circle(120, 73, 22)} accent delay={0.2} />
      <Line still={still} d="M136 89 L150 103" accent width={2.2} delay={0.4} />
      <Dot still={still} x={120} y={73} r={5} accent delay={0.3} />
      <Tag still={still} x={120} y={143} accent delay={0.2}>
        The business first
      </Tag>
    </>
  ),
  // Define — "Positioning, audience, offers… channels, funnel structure":
  // the audience targeted, then the funnel the strategy builds for them.
  define: (still) => (
    <>
      {[26, 17, 8].map((r, i) => (
        <Line key={r} still={still} d={circle(54, 66, r)} opacity={0.35 + i * 0.3} accent={i === 2} delay={i * 0.08} />
      ))}
      <Dot still={still} x={54} y={66} r={3} accent delay={0.3} />
      <Tag still={still} x={54} y={112}>
        Audience
      </Tag>
      <Line d="M88 66 H108" dash="2 4" opacity={0.6} still />
      <Line still={still} d="M108 66 l-5 -4 M108 66 l-5 4" opacity={0.6} delay={0.3} />
      {[
        [118, 224, 22, 'Awareness'],
        [130, 212, 54, 'Consideration'],
        [144, 198, 86, 'Conversion'],
      ].map(([l, r, y, t], i) => (
        <g key={t}>
          <Line still={still} d={`M${l} ${y} H${r} L${r - 8} ${y + 24} H${l + 8} Z`} accent={i === 2} delay={0.1 + i * 0.1} />
          <Tag still={still} x={(l + r) / 2} y={y + 15} size={i === 2 ? 5.5 : 6} accent={i === 2} delay={0.1 + i * 0.1}>
            {t}
          </Tag>
        </g>
      ))}
      <Tag still={still} x={120} y={143}>
        Strategy → funnel structure
      </Tag>
    </>
  ),
  // Create — "Campaigns, creatives, content, landing pages, funnels":
  // the ad creative on a phone, and the landing page it leads to.
  create: (still) => (
    <>
      <Line still={still} d="M30 14 h44 a5 5 0 0 1 5 5 v92 a5 5 0 0 1 -5 5 h-44 a5 5 0 0 1 -5 -5 v-92 a5 5 0 0 1 5 -5 Z" />
      <Line still={still} d="M33 32 h38 v36 h-38 Z" fill={C.blush} delay={0.1} />
      <Dot still={still} x={52} y={50} r={8} accent delay={0.2} />
      <Line still={still} d="M33 77 h28 M33 84 h20" opacity={0.5} delay={0.25} />
      <Line still={still} d="M33 96 h38 v10 h-38 Z" accent delay={0.3} />
      <Tag still={still} x={52} y={133}>
        Ad creative
      </Tag>

      <Line d="M88 65 H116" dash="2 4" opacity={0.6} still />
      <Line still={still} d="M116 65 l-5 -4 M116 65 l-5 4" opacity={0.6} delay={0.35} />

      <Line still={still} d="M132 18 h80 a4 4 0 0 1 4 4 v86 a4 4 0 0 1 -4 4 h-80 a4 4 0 0 1 -4 -4 v-86 a4 4 0 0 1 4 -4 Z" delay={0.2} />
      <Line still={still} d="M128 30 H216" opacity={0.4} delay={0.25} />
      <Dot still={still} x={135} y={24} r={1.6} accent delay={0.3} />
      <Line still={still} d="M138 40 h56 M138 48 h40" opacity={0.6} delay={0.35} />
      <Line still={still} d="M138 58 h68 v26 h-68 Z" opacity={0.45} delay={0.4} />
      <Line still={still} d="M138 92 h34 v10 h-34 Z" accent delay={0.45} />
      <Tag still={still} x={172} y={133}>
        Landing page
      </Tag>
    </>
  ),
  // Scale — "Performance, conversion, CAC, ROAS": a results view — ROAS up, CAC down,
  // and the budget scaled on what is proven.
  scale: (still) => (
    <>
      <Line still={still} d="M24 14 h86 v46 h-86 Z" opacity={0.5} />
      <Tag still={still} x={32} y={28} anchor="start">
        ROAS ↑
      </Tag>
      <Line still={still} d="M34 50 L54 44 L72 46 L98 26" accent delay={0.2} />

      <Line still={still} d="M130 14 h86 v46 h-86 Z" opacity={0.5} />
      <Tag still={still} x={138} y={28} anchor="start">
        CAC ↓
      </Tag>
      <Line still={still} d="M140 32 L160 38 L178 36 L204 52" delay={0.2} />

      <Line still={still} d="M24 122 H216" opacity={0.4} />
      {[
        [44, 110],
        [80, 102],
        [116, 94],
        [152, 84],
        [188, 74],
      ].map(([x, top], i) => (
        <Line key={x} still={still} d={`M${x} 122 V${top}`} delay={0.1 + i * 0.06} opacity={0.3 + i * 0.12} width={9} accent={i === 4} />
      ))}
      <Tag still={still} x={120} y={143}>
        Scale what works
      </Tag>
    </>
  ),
}

/** The plate for the active step, framed like the site's print plates, with its caption. */
export function MethodPlate({ step, total, reducedMotion = false, className = '' }) {
  const draw = PLATES[step.id]
  if (!draw) return null
  return (
    <figure className={`relative border border-line bg-cream/60 p-4 ${className}`}>
      <span aria-hidden className="pointer-events-none absolute inset-1.5 border border-ink/[0.06]" />
      <div className="relative aspect-[240/150]">
        <AnimatePresence mode="wait" initial={false}>
          <m.svg
            key={step.id}
            viewBox="0 0 240 150"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -6, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {draw(reducedMotion)}
          </m.svg>
        </AnimatePresence>
      </div>
      <figcaption className="label relative mt-3 flex items-center justify-between border-t border-line pt-3 text-[0.625rem] text-ink-muted">
        <span>
          Fig. <span className="tabular-nums text-terracotta">{step.index}</span> — {step.name}
        </span>
        <span className="tabular-nums">
          {step.index} / {String(total).padStart(2, '0')}
        </span>
      </figcaption>
    </figure>
  )
}
