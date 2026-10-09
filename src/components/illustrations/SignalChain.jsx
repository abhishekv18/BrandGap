import { Bottle, C, CropMarks, Label, NumLabel, Note, Shadow } from './parts'

const ALT =
  'Illustration: inside a single ad, five linked steps for a fictional cold-brew bottle — 01 hook, stop the scroll; 02 offer, why now; 03 creative, show then tell; 04 landing page, keep the promise; 05 conversion, measured not guessed. An editorial note marks the hand-off from creative to landing page: in our experience, most leaks happen here.'

const ALT_MOBILE =
  'Illustration: inside a single ad, five linked steps — 01 hook, stop the scroll; 02 offer, why now; 03 creative, show then tell; 04 landing page, keep the promise; 05 conversion, measured not guessed.'

export const STEPS = [
  { name: 'Hook', note: 'Stop the scroll.' },
  { name: 'Offer', note: 'Why now?' },
  { name: 'Creative', note: 'Show, then tell.' },
  { name: 'Landing page', note: 'Keep the promise.' },
  { name: 'Conversion', note: 'Measured, not guessed.' },
]

/* ---- The five objects. Each is drawn around its own base centre (0, 0). ---- */

/** 01 — the phone, mid-scroll, with the ad's opening frame and a 0–3s marker. */
function HookPhone({ id }) {
  const w = 210
  const h = 420
  const x = -w / 2
  const y = -h
  return (
    <g>
      <circle cx={0} cy={-h * 0.52} r={190} fill={C.blush} opacity={0.6} />
      <Shadow id={`${id}-phone`} cx={8} cy={0} rx={120} ry={10} opacity={0.22} />
      <rect x={x} y={y} width={w} height={h} rx={34} fill={C.ink} />
      <rect x={x + 9} y={y + 9} width={w - 18} height={h - 18} rx={26} fill={C.paper} />
      <rect x={-30} y={y + 20} width={60} height={13} rx={6.5} fill={C.ink} />
      {/* post header */}
      <circle cx={x + 34} cy={y + 64} r={13} fill={C.terra} />
      <rect x={x + 54} y={y + 56} width={70} height={7} rx={3.5} fill={C.ink} />
      <rect x={x + 54} y={y + 68} width={44} height={5} rx={2.5} fill={C.line} />
      {/* the opening frame */}
      <rect x={x + 9} y={y + 90} width={w - 18} height={212} fill={C.terra} />
      <ellipse cx={22} cy={y + 236} rx={58} ry={66} fill={C.terraD} opacity={0.55} />
      <Bottle x={26} y={y + 286} h={118} body={'#c9895a'} cap={C.ink} band={C.paper} />
      <text x={x + 26} y={y + 128} fontSize={22} fill={C.paper} style={{ fontFamily: 'var(--font-display)' }}>
        Slow mornings,
      </text>
      <text x={x + 26} y={y + 153} fontSize={22} fill={C.paper} style={{ fontFamily: 'var(--font-display)' }}>
        bottled.
      </text>
      {/* the hook, circled */}
      <ellipse cx={x + 86} cy={y + 134} rx={74} ry={33} fill="none" stroke={C.paper} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
      {/* 0–3s marker */}
      <rect x={x + 22} y={y + 270} width={50} height={22} rx={11} fill={C.ink} />
      <text x={x + 47} y={y + 285.5} fontSize={11} fill={C.paper} textAnchor="middle" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.08em' }}>
        0–3s
      </text>
      {/* caption + button */}
      <rect x={x + 24} y={y + 320} width={150} height={7} rx={3.5} fill={C.ink} />
      <rect x={x + 24} y={y + 334} width={118} height={5} rx={2.5} fill={C.line} />
      <rect x={x + 24} y={y + 360} width={w - 48} height={30} rx={15} fill={C.ink} />
      <circle cx={x + w - 40} cy={y + 375} r={4} fill={C.terra} />
    </g>
  )
}

/** 02 — a hanging swing tag: the offer. */
function OfferTag({ id }) {
  return (
    <g>
      <circle cx={0} cy={-150} r={118} fill={C.blush} opacity={0.45} />
      <path d="M0 -330 C 6 -300, -4 -280, 0 -262" stroke={C.ink} strokeWidth={1} fill="none" vectorEffect="non-scaling-stroke" />
      <g transform="rotate(-9 0 -262)">
        <Shadow id={`${id}-tag`} cx={10} cy={-60} rx={70} ry={8} opacity={0.12} />
        <path d="M-68 -230 L-38 -262 L38 -262 L68 -230 L68 -40 Q68 -30 58 -30 L-58 -30 Q-68 -30 -68 -40 Z" fill={C.paper} />
        <path d="M-68 -230 L-38 -262 L38 -262 L68 -230 L68 -40 Q68 -30 58 -30 L-58 -30 Q-68 -30 -68 -40 Z" fill="none" stroke={C.beige} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        <circle cx={0} cy={-240} r={7} fill={C.cream} stroke={C.ink} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        <rect x={-68} y={-196} width={136} height={58} fill={C.terra} />
        <text x={0} y={-160} fontSize={24} fill={C.paper} textAnchor="middle" fontStyle="italic" style={{ fontFamily: 'var(--font-display)' }}>
          Try the trio
        </text>
        <rect x={-44} y={-112} width={88} height={6} rx={3} fill={C.ink} />
        <rect x={-30} y={-96} width={60} height={5} rx={2.5} fill={C.line} />
        <rect x={-48} y={-70} width={96} height={1} fill={C.beige} />
        <rect x={-20} y={-58} width={40} height={5} rx={2.5} fill={C.line} />
      </g>
    </g>
  )
}

/** 03 — three storyboard frames, fanned: show, then tell. */
function Storyboard({ id }) {
  const frame = (dx, rot, fill, children) => (
    <g transform={`translate(${dx} 0) rotate(${rot} 0 -120)`}>
      <rect x={-62} y={-262} width={124} height={170} rx={6} fill={fill} />
      <rect x={-62} y={-262} width={124} height={170} rx={6} fill="none" stroke={C.beige} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      {children}
    </g>
  )
  return (
    <g>
      <circle cx={0} cy={-170} r={150} fill={C.blush} opacity={0.4} />
      <Shadow id={`${id}-frames`} cx={0} cy={-70} rx={150} ry={9} opacity={0.14} />
      {frame(-104, -6, C.terra, (
        <>
          <ellipse cx={0} cy={-178} rx={30} ry={38} fill={C.terraD} opacity={0.6} />
          <Bottle x={2} y={-140} h={74} body={'#c9895a'} band={C.paper} highlight={false} />
          <rect x={-46} y={-250} width={60} height={6} rx={3} fill={C.paper} opacity={0.85} />
        </>
      ))}
      {frame(0, 0, C.paper, (
        <>
          <Bottle x={-18} y={-128} h={92} body={'#c9895a'} band={C.paper} />
          <path d="M18 -214 L48 -214 M18 -196 L42 -196 M18 -178 L46 -178" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
          <circle cx={13} cy={-214} r={2.5} fill={C.terra} />
          <circle cx={13} cy={-196} r={2.5} fill={C.terra} />
          <circle cx={13} cy={-178} r={2.5} fill={C.terra} />
        </>
      ))}
      {frame(104, 6, C.ink, (
        <>
          <rect x={-40} y={-226} width={80} height={6} rx={3} fill={C.paper} opacity={0.85} />
          <rect x={-28} y={-210} width={56} height={5} rx={2.5} fill={C.paper} opacity={0.4} />
          <rect x={-40} y={-140} width={80} height={24} rx={12} fill={C.paper} />
          <circle cx={26} cy={-128} r={3.5} fill={C.terra} />
        </>
      ))}
      {[-104, 0, 104].map((dx, i) => (
        <Label key={dx} x={dx} y={-62} anchor="middle" size={13} fill={C.muted}>
          {`${i + 1} / 3`}
        </Label>
      ))}
    </g>
  )
}

/** 04 — the landing page in a browser, its button echoing the ad's. */
function Landing({ id }) {
  const w = 280
  const h = 230
  const x = -w / 2
  const y = -h - 40
  return (
    <g>
      <circle cx={0} cy={y + h * 0.5} r={150} fill={C.blush} opacity={0.4} />
      <Shadow id={`${id}-page`} cx={6} cy={-38} rx={150} ry={9} opacity={0.18} />
      <rect x={x} y={y} width={w} height={h} rx={10} fill={C.paper} />
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={C.beige} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <path d={`M${x} ${y + 26} L${x + w} ${y + 26}`} stroke={C.beige} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + 16 + i * 13} cy={y + 13} r={4} fill={i ? C.line : C.terra} />
      ))}
      <rect x={x + 70} y={y + 8} width={150} height={10} rx={5} fill={C.cream} />
      {/* hero: product left, promise right */}
      <rect x={x + 16} y={y + 40} width={112} height={128} rx={4} fill={C.blush} />
      <Bottle x={x + 72} y={y + 156} h={96} body={'#c9895a'} band={C.paper} />
      <text x={x + 144} y={y + 72} fontSize={17} fill={C.ink} style={{ fontFamily: 'var(--font-display)' }}>
        Slow mornings,
      </text>
      <text x={x + 144} y={y + 93} fontSize={17} fill={C.ink} style={{ fontFamily: 'var(--font-display)' }}>
        bottled.
      </text>
      <rect x={x + 144} y={y + 108} width={110} height={5} rx={2.5} fill={C.line} />
      <rect x={x + 144} y={y + 119} width={86} height={5} rx={2.5} fill={C.line} />
      <rect x={x + 144} y={y + 140} width={104} height={26} rx={13} fill={C.ink} />
      <circle cx={x + 236} cy={y + 153} r={3.5} fill={C.terra} />
      {/* the promise kept: the button ringed */}
      <rect x={x + 136} y={y + 133} width={120} height={40} rx={20} fill="none" stroke={C.terra} strokeWidth={1.25} strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
      <rect x={x + 16} y={y + 184} width={w - 32} height={1} fill={C.beige} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x + 16 + i * 86} y={y + 196} width={76} height={20} rx={3} fill={C.cream} />
      ))}
    </g>
  )
}

/** 05 — the order receipt: measured, not guessed. */
function Receipt({ id }) {
  const w = 150
  const h = 236
  const x = -w / 2
  const y = -h - 40
  const teeth = Array.from({ length: 10 }, (_, i) => `L${x + w - (i * w) / 10 - w / 20} ${y + h + 8} L${x + w - ((i + 1) * w) / 10} ${y + h}`).join(' ')
  return (
    <g>
      <circle cx={0} cy={y + h * 0.5} r={128} fill={C.blush} opacity={0.4} />
      <Shadow id={`${id}-receipt`} cx={6} cy={-26} rx={86} ry={8} opacity={0.16} />
      <path d={`M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} ${teeth} Z`} fill={C.paper} />
      <path d={`M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} ${teeth} Z`} fill="none" stroke={C.beige} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <Label x={0} y={y + 32} anchor="middle" size={12} fill={C.ink}>
        Order
      </Label>
      <rect x={x + 30} y={y + 44} width={w - 60} height={1} fill={C.beige} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={x + 20} y={y + 62 + i * 22} width={i % 2 ? 54 : 70} height={5} rx={2.5} fill={C.line} />
          <rect x={x + w - 46} y={y + 62 + i * 22} width={26} height={5} rx={2.5} fill={C.line} />
        </g>
      ))}
      <rect x={x + 20} y={y + 158} width={w - 40} height={1} fill={C.ink} opacity={0.5} />
      <rect x={x + 20} y={y + 170} width={46} height={7} rx={3.5} fill={C.ink} />
      <rect x={x + w - 56} y={y + 170} width={36} height={7} rx={3.5} fill={C.ink} />
      {/* the stamp */}
      <g transform={`rotate(-12 ${x + w - 40} ${y + 208})`}>
        <circle cx={x + w - 40} cy={y + 208} r={22} fill="none" stroke={C.terra} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        <path d={`M${x + w - 50} ${y + 208} l7 7 l13 -14`} stroke={C.terra} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  )
}

const OBJECTS = [HookPhone, OfferTag, Storyboard, Landing, Receipt]

/** The leak: a break in the thread, a few drops, and an editorial (not statistical) note. */
function Leak({ x, y, noteX, noteY, size, labelSize = size * 0.7, anchor = 'middle' }) {
  return (
    <g data-callout>
      <circle cx={x - 4} cy={y + 16} r={2.2} fill={C.terra} />
      <circle cx={x + 3} cy={y + 30} r={1.8} fill={C.terra} opacity={0.7} />
      <circle cx={x - 2} cy={y + 42} r={1.4} fill={C.terra} opacity={0.45} />
      <path d={`M${x} ${y - 12} L${noteX} ${noteY + 14}`} stroke={C.ink} strokeWidth={0.75} strokeDasharray="3 4" vectorEffect="non-scaling-stroke" fill="none" />
      <Label x={noteX} y={noteY - size * 1.55} anchor={anchor} size={labelSize} fill={C.terra}>
        Observation
      </Label>
      <Note x={noteX} y={noteY} anchor={anchor} size={size} italic>
        In our experience, most leaks happen here.
      </Note>
    </g>
  )
}

/**
 * Performance marketing, desktop: one ad's journey from scroll to sale,
 * five objects strung on a single terracotta thread. 21:9.
 */
export function SignalChain({ className = '' }) {
  const thread = 560
  const xs = [250, 560, 875, 1195, 1500]
  const bases = [520, 520, 520, 520, 520]
  const breakAt = (xs[2] + xs[3]) / 2 + 6
  return (
    <svg viewBox="0 0 1680 720" role="img" aria-label={ALT} className={className}>
      <CropMarks w={1680} h={720} m={18} l={30} />
      {OBJECTS.map((Obj, i) => (
        <g key={i} data-obj transform={`translate(${xs[i]} ${bases[i]})`}>
          <Obj id={`chain-${i}`} />
        </g>
      ))}
      {/* the thread, broken once where the creative hands over to the page */}
      <path data-draw d={`M${xs[0]} ${thread} L${breakAt - 16} ${thread}`} pathLength={1} stroke={C.terra} strokeWidth={2} vectorEffect="non-scaling-stroke" fill="none" />
      <path data-draw-late d={`M${breakAt + 16} ${thread} L${xs[4]} ${thread}`} pathLength={1} stroke={C.terra} strokeWidth={2} vectorEffect="non-scaling-stroke" fill="none" />
      {xs.map((x, i) => (
        <g key={x} data-callout>
          <path d={`M${x} ${bases[i] + 4} L${x} ${thread}`} stroke={C.ink} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          <circle cx={x} cy={thread} r={6} fill={i === 4 ? C.terra : C.ink} />
          <NumLabel x={x} y={thread + 52} num={`0${i + 1}`} name={STEPS[i].name} size={22} anchor="middle" />
          <Note x={x} y={thread + 92} size={30} anchor="middle" italic>
            {STEPS[i].note}
          </Note>
        </g>
      ))}
      <Leak x={breakAt} y={thread} noteX={breakAt} noteY={84} size={28} />
    </svg>
  )
}

/**
 * Tablet: the same five objects in two rows — three, then two. The thread
 * breaks at the row change, which is exactly where the leak sits. 16:9.
 */
export function SignalChainTablet({ className = '' }) {
  const s = 0.55
  const r1 = { base: 252, thread: 276, xs: [170, 565, 960] }
  const r2 = { base: 566, thread: 590, xs: [540, 910] }
  const pos = [...r1.xs.map((x) => [x, r1.base, r1.thread]), ...r2.xs.map((x) => [x, r2.base, r2.thread])]
  return (
    <svg viewBox="0 0 1200 720" role="img" aria-label={ALT} className={className}>
      {OBJECTS.map((Obj, i) => (
        <g key={i} data-obj transform={`translate(${pos[i][0]} ${pos[i][1]}) scale(${s})`}>
          <Obj id={`chain-t-${i}`} />
        </g>
      ))}
      <path data-draw d={`M${r1.xs[0]} ${r1.thread} L${r1.xs[2] + 120} ${r1.thread}`} pathLength={1} stroke={C.terra} strokeWidth={2} vectorEffect="non-scaling-stroke" fill="none" />
      <path data-draw-late d={`M150 ${r2.thread} L${r2.xs[1]} ${r2.thread}`} pathLength={1} stroke={C.terra} strokeWidth={2} vectorEffect="non-scaling-stroke" fill="none" />
      {pos.map(([x, base, thread], i) => (
        <g key={i} data-callout>
          <path d={`M${x} ${base + 3} L${x} ${thread}`} stroke={C.ink} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          <circle cx={x} cy={thread} r={6} fill={i === 4 ? C.terra : C.ink} />
          <NumLabel x={x + 16} y={thread + 34} num={`0${i + 1}`} name={STEPS[i].name} size={19} />
          <Note x={x + 16} y={thread + 64} size={24} italic>
            {STEPS[i].note}
          </Note>
        </g>
      ))}
      <Leak x={128} y={r2.thread} noteX={70} noteY={430} size={21} labelSize={17} anchor="start" />
    </svg>
  )
}

/** Mobile: the five steps as a compact vertical list on one thread. */
export function SignalChainMobile({ className = '' }) {
  const rowH = 60
  const top = 30
  const icons = [
    // tiny versions of each object, drawn at 44px
    <g key="h"><rect x={-13} y={-24} width={26} height={48} rx={5} fill={C.ink} /><rect x={-10} y={-21} width={20} height={42} rx={3} fill={C.paper} /><rect x={-10} y={-11} width={20} height={16} fill={C.terra} /></g>,
    <g key="o"><path d="M-14 -12 L-7 -20 L7 -20 L14 -12 L14 18 L-14 18 Z" fill={C.paper} stroke={C.beige} /><rect x={-14} y={-4} width={28} height={9} fill={C.terra} /><circle cx={0} cy={-14} r={2} fill={C.ink} /></g>,
    <g key="c"><rect x={-22} y={-14} width={14} height={22} rx={2} fill={C.terra} /><rect x={-6} y={-16} width={14} height={22} rx={2} fill={C.paper} stroke={C.beige} /><rect x={10} y={-14} width={14} height={22} rx={2} fill={C.ink} /></g>,
    <g key="l"><rect x={-22} y={-16} width={44} height={32} rx={3} fill={C.paper} stroke={C.beige} /><circle cx={-17} cy={-11} r={1.6} fill={C.terra} /><rect x={-18} y={-4} width={16} height={16} fill={C.blush} /><rect x={2} y={4} width={16} height={6} rx={3} fill={C.ink} /></g>,
    <g key="r"><path d="M-12 -20 L12 -20 L12 16 L8 20 L4 16 L0 20 L-4 16 L-8 20 L-12 16 Z" fill={C.paper} stroke={C.beige} /><circle cx={4} cy={6} r={5} fill="none" stroke={C.terra} strokeWidth={1.4} /></g>,
  ]
  const h = top * 2 + rowH * 4
  return (
    <svg viewBox={`11 0 238 ${h}`} role="img" aria-label={ALT_MOBILE} className={className}>
      <path data-draw d={`M40 ${top} L40 ${top + rowH * 4}`} pathLength={1} stroke={C.terra} strokeWidth={2} vectorEffect="non-scaling-stroke" fill="none" />
      {STEPS.map((step, i) => {
        const y = top + rowH * i
        return (
          <g key={step.name} data-callout>
            <circle cx={40} cy={y} r={25} fill={C.blush} />
            <g transform={`translate(40 ${y}) scale(0.88)`}>{icons[i]}</g>
            <NumLabel x={80} y={y - 4} num={`0${i + 1}`} name={step.name} size={11.5} />
            <Note x={80} y={y + 17} size={17} italic>
              {step.note}
            </Note>
          </g>
        )
      })}
    </svg>
  )
}
