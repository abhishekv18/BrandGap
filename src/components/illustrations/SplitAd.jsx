import { Bottle, C, CropMarks, Label, NumLabel, Note } from './parts'

const ALT =
  'Illustration: one ad split down the middle. The creative half, in colour, is annotated hook, story and design; the performance half, drawn as a wireframe, is annotated audience, test and data. Where the halves meet, a stamp reads growth.'

/* The card is drawn in local units: 400 × 500, seam at x = 200. */

/** The bottle as a line drawing — the performance view of the same product. */
function BottleOutline({ x, y, h }) {
  const w = h * 0.44
  const s = { fill: 'none', stroke: C.ink, strokeWidth: 1.2, vectorEffect: 'non-scaling-stroke' }
  return (
    <g>
      <rect x={x - w / 2} y={y - h * 0.7} width={w} height={h * 0.7} rx={w * 0.2} {...s} />
      <rect x={x - w * 0.22} y={y - h * 0.86} width={w * 0.44} height={h * 0.18} rx={w * 0.06} {...s} />
      <ellipse cx={x} cy={y - h * 0.9} rx={w * 0.17} ry={h * 0.07} {...s} />
      <rect x={x - w * 0.32} y={y - h * 0.44} width={w * 0.64} height={h * 0.16} rx={w * 0.05} {...s} strokeDasharray="3 3" />
    </g>
  )
}

/** The creative half: the ad as people see it. */
function CreativeSide() {
  return (
    <g>
      <rect x={0} y={0} width={400} height={500} rx={14} fill={C.terra} />
      <circle cx={30} cy={34} r={12} fill={C.paper} />
      <rect x={50} y={27} width={70} height={6} rx={3} fill={C.paper} opacity={0.85} />
      <rect x={50} y={38} width={44} height={5} rx={2.5} fill={C.paper} opacity={0.45} />
      {['Slow', 'mornings,', 'bottled.'].map((word, i) => (
        <text key={word} x={30} y={100 + i * 32} fontSize={30} fill={C.paper} style={{ fontFamily: 'var(--font-display)' }}>
          {word}
        </text>
      ))}
      <ellipse cx={200} cy={318} rx={92} ry={108} fill={C.terraD} opacity={0.55} />
      <Bottle x={200} y={410} h={210} body={'#c9895a'} band={C.paper} />
      <rect x={40} y={444} width={320} height={34} rx={17} fill={C.paper} />
      <text x={122} y={466} fontSize={12} fill={C.ink} textAnchor="middle" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.2em' }}>
        SHOP NOW
      </text>
    </g>
  )
}

/** The performance half: the same ad as a working drawing — audience, test, data. */
function PerformanceSide() {
  const line = { fill: 'none', stroke: C.ink, strokeWidth: 1.2, vectorEffect: 'non-scaling-stroke' }
  return (
    <g>
      <rect x={0} y={0} width={400} height={500} rx={14} fill={C.paper} />
      <rect x={0.5} y={0.5} width={399} height={499} rx={14} {...line} />
      <circle cx={30} cy={34} r={12} {...line} />
      <rect x={50} y={27} width={70} height={6} rx={3} fill={C.line} />
      <rect x={50} y={38} width={44} height={5} rx={2.5} fill={C.beige} />
      {/* headline as a measured block */}
      {/* the headline, measured: one block per line */}
      <rect x={212} y={78} width={68} height={24} rx={3} fill={C.cream} />
      <rect x={212} y={110} width={140} height={24} rx={3} fill={C.cream} />
      <rect x={212} y={142} width={112} height={24} rx={3} fill={C.cream} />
      <path d="M212 174 L352 174" stroke={C.ink} strokeWidth={0.75} opacity={0.4} vectorEffect="non-scaling-stroke" />
      {/* audience rings */}
      {[56, 96, 136].map((r, i) => (
        <circle key={r} cx={200} cy={318} r={r} {...line} strokeDasharray={i === 2 ? '2 5' : '4 4'} opacity={1 - i * 0.22} />
      ))}
      {[
        [324, 290],
        [262, 214],
        [290, 392],
        [236, 260],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={4} fill={C.ink} />
      ))}
      <circle cx={300} cy={222} r={4.5} fill={C.terra} />
      <BottleOutline x={200} y={410} h={210} />
      {/* A / B */}
      {/* A / B — clear of the rings */}
      <rect x={340} y={292} width={24} height={34} rx={3} {...line} />
      <rect x={368} y={292} width={24} height={34} rx={3} {...line} />
      <text x={352} y={314} fontSize={12} fill={C.muted} textAnchor="middle" style={{ fontFamily: 'var(--font-sans)' }}>A</text>
      <text x={380} y={314} fontSize={12} fill={C.ink} textAnchor="middle" style={{ fontFamily: 'var(--font-sans)' }}>B</text>
      <path d="M373 334 l4 4 l8 -9" stroke={C.terra} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* data: a quiet rising strip, no numbers */}
      {[10, 16, 13, 22, 28].map((h, i) => (
        <rect key={i} x={318 + i * 15} y={428 - h} width={8} height={h} fill={i === 4 ? C.terra : C.ink} opacity={i === 4 ? 1 : 0.75} />
      ))}
      <rect x={40} y={444} width={320} height={34} rx={17} {...line} strokeDasharray="5 4" />
    </g>
  )
}

/** The GROWTH stamp, echoing the section's existing Growth circle. */
function Stamp({ cx, cy, r, size }) {
  return (
    <g data-stamp style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: 'view-box' }}>
      <circle cx={cx} cy={cy} r={r} fill={C.cream} stroke={C.ink} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
      <circle cx={cx} cy={cy} r={r - 7} fill="none" stroke={C.ink} strokeWidth={0.6} opacity={0.4} vectorEffect="non-scaling-stroke" />
      <circle cx={cx - r * 0.1} cy={cy - r * 0.28} r={r * 0.055} fill={C.terra} />
      <circle cx={cx + r * 0.1} cy={cy - r * 0.28} r={r * 0.055} fill={C.ink} />
      <Label x={cx} y={cy + size * 0.6} anchor="middle" size={size} fill={C.ink}>
        Growth
      </Label>
    </g>
  )
}

/** One card, both halves, each clipped to its side. `half` picks one ('b' left, 'g' right) or both. */
function Halves({ id, x, y, scale, half }) {
  const t = `translate(${x} ${y}) scale(${scale})`
  return (
    <>
      <defs>
        <clipPath id={`${id}-l`}>
          <rect x={0} y={-2} width={200} height={504} />
        </clipPath>
        <clipPath id={`${id}-r`}>
          <rect x={200} y={-2} width={202} height={504} />
        </clipPath>
      </defs>
      {half !== 'g' && (
        <g transform={t}>
          <g clipPath={`url(#${id}-l)`}>
            <CreativeSide />
          </g>
        </g>
      )}
      {half !== 'b' && (
        <g transform={t}>
          <g clipPath={`url(#${id}-r)`}>
            <PerformanceSide />
          </g>
        </g>
      )}
    </>
  )
}

function Callout({ from, to, num, name, side, size, light = false }) {
  return (
    <g data-callout>
      <path data-draw d={`M${from[0]} ${from[1]} L${to[0]} ${to[1]}`} pathLength={1} stroke={C.ink} strokeWidth={1} vectorEffect="non-scaling-stroke" fill="none" />
      <circle cx={from[0]} cy={from[1]} r={5} fill={light ? C.paper : C.terra} stroke={light ? C.ink : 'none'} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <NumLabel x={to[0] + (side === 'l' ? -14 : 14)} y={to[1] + size * 0.36} num={num} name={name} size={size} anchor={side === 'l' ? 'end' : 'start'} />
    </g>
  )
}

/**
 * Creative × Performance, desktop and tablet: one ad, split. The halves sit
 * apart and close on scroll with the section's existing equation. 16:9.
 */
export function SplitAd({ className = '', labelSize = 20, uid = 'splitad' }) {
  // card at (600,130), 400 × 500
  const X = 600
  const Y = 130
  const p = (lx, ly) => [X + lx, Y + ly]
  return (
    <svg viewBox="0 0 1600 900" role="img" aria-label={ALT} className={`overflow-visible ${className}`}>
      <CropMarks w={1600} h={900} m={18} l={30} />
      <g data-half="b">
        <Halves id={`${uid}-b`} x={X} y={Y} scale={1} half="b" />
        <Note x={540} y={92} size={46} anchor="end" italic fill={C.terra}>
          Creative
        </Note>
        <Callout from={p(20, 124)} to={[470, 210]} num="01" name="Hook" side="l" size={labelSize} light />
        <Callout from={p(178, 300)} to={[470, 420]} num="02" name="Story" side="l" size={labelSize} />
        <Callout from={p(50, 461)} to={[470, 600]} num="03" name="Design" side="l" size={labelSize} />
      </g>
      <g data-half="g">
        <Halves id={`${uid}-g`} x={X} y={Y} scale={1} half="g" />
        <Note x={1060} y={92} size={46}>
          Performance
        </Note>
        <Callout from={p(300, 222)} to={[1130, 250]} num="04" name="Audience" side="r" size={labelSize} />
        <Callout from={p(392, 309)} to={[1130, 420]} num="05" name="Test" side="r" size={labelSize} />
        <Callout from={p(380, 402)} to={[1130, 600]} num="06" name="Data" side="r" size={labelSize} />
      </g>
      <Stamp cx={800} cy={Y + 540 + labelSize * 1.1} r={70 * (labelSize / 20)} size={18 * (labelSize / 20)} />
    </svg>
  )
}

/** Mobile: the joined ad, labels either side, no movement. */
export function SplitAdMobile({ className = '' }) {
  const X = 190
  const Y = 64
  const s = 0.55
  const p = (lx, ly) => [X + lx * s, Y + ly * s]
  const left = [
    ['Hook', p(20, 124), 128],
    ['Story', p(178, 300), 220],
    ['Design', p(50, 461), 312],
  ]
  const right = [
    ['Audience', p(300, 222), 128],
    ['Test', p(392, 309), 220],
    ['Data', p(380, 402), 312],
  ]
  return (
    <svg viewBox="0 0 600 470" role="img" aria-label={ALT} className={className}>
      <Halves id="splitad-m" x={X} y={Y} scale={s} />
      <Note x={172} y={40} size={26} anchor="end" italic fill={C.terra}>
        Creative
      </Note>
      <Note x={428} y={40} size={26}>
        Performance
      </Note>
      {left.map(([name, from, y], i) => (
        <g key={name}>
          <path d={`M${from[0]} ${from[1]} L172 ${y}`} stroke={C.ink} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          <circle cx={from[0]} cy={from[1]} r={4} fill={i ? C.terra : C.paper} stroke={i ? 'none' : C.ink} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          <Label x={164} y={y + 6} size={18} anchor="end" fill={C.ink}>
            {name}
          </Label>
        </g>
      ))}
      {right.map(([name, from, y]) => (
        <g key={name}>
          <path d={`M${from[0]} ${from[1]} L428 ${y}`} stroke={C.ink} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          <circle cx={from[0]} cy={from[1]} r={4} fill={C.terra} />
          <Label x={436} y={y + 6} size={18} fill={C.ink}>
            {name}
          </Label>
        </g>
      ))}
      <Stamp cx={300} cy={Y + 322} r={56} size={17} />
    </svg>
  )
}
