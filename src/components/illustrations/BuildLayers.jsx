import { m } from 'framer-motion'
import { C } from './parts'

/**
 * What a development partner does, drawn: one website pulled apart into its three
 * layers. Design (the wireframe), Build (the code) and Launch (the live store, on
 * paper), stacked in isometric on the ink panel. The layers start closed together
 * and open out as the figure arrives; reduced motion shows them open.
 */
const EASE = [0.16, 1, 0.3, 1]
const W = 300
const H = 210
const X0 = 200
const TOPS = [20, 185, 350] // each layer's back corner
const LAYERS = ['Design', 'Build', 'Launch']
const NOTES = ['Layouts and user flows', 'Code and integrations', 'Store, checkout, payments']

const cream = 'rgb(244 233 225 / 0.72)'
const creamSoft = 'rgb(244 233 225 / 0.32)'
const hair = { fill: 'none', stroke: cream, strokeWidth: 0.9, vectorEffect: 'non-scaling-stroke' }
const soft = { ...hair, stroke: creamSoft }

/** Plane coordinates onto the isometric layer whose back corner is at (X0, y). */
const iso = (y) => `matrix(0.866 0.5 -0.866 0.5 ${X0} ${y})`
const pt = (u, v, y) => [X0 + 0.866 * (u - v), y + 0.5 * (u + v)]

function Plate({ fill, stroke = creamSoft }) {
  return <rect width={W} height={H} rx={7} fill={fill} stroke={stroke} strokeWidth={1} vectorEffect="non-scaling-stroke" />
}

function DesignLayer() {
  return (
    <>
      <Plate fill="#1C1317" />
      <path d="M16 26 H284" {...soft} />
      <rect x={16} y={12} width={26} height={7} rx={2} fill={C.terraL} />
      <path d="M210 16 H232 M242 16 H262 M272 16 H284" {...soft} />
      {/* the hero, with its image placeholder crossed as on a wireframe */}
      <rect x={16} y={38} width={150} height={92} rx={3} {...hair} />
      <path d="M16 38 L166 130 M166 38 L16 130" {...soft} />
      <path d="M180 48 H284 M180 62 H262 M180 76 H272" {...hair} />
      <rect x={180} y={96} width={56} height={18} rx={9} fill="none" stroke={C.terraL} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
      {[16, 112, 208].map((x) => (
        <rect key={x} x={x} y={146} width={76} height={50} rx={3} {...soft} />
      ))}
      {/* a measured edge: the drawing's dimension line */}
      <path d="M16 203 H284 M16 200 V206 M284 200 V206" fill="none" stroke={C.terraL} strokeWidth={0.9} vectorEffect="non-scaling-stroke" />
    </>
  )
}

const CODE = [
  [0, 70, 1],
  [14, 112, 0],
  [14, 84, 0],
  [28, 138, 1],
  [28, 96, 0],
  [42, 150, 0],
  [42, 76, 1],
  [28, 120, 0],
  [14, 62, 0],
  [0, 48, 1],
]

function BuildLayer() {
  return (
    <>
      <Plate fill="#2A1D21" />
      <path d="M0 24 H300" {...soft} />
      {[14, 26, 38].map((x, i) => (
        <circle key={x} cx={x} cy={12} r={3} fill={i ? creamSoft : C.terraL} />
      ))}
      <path d="M40 24 V210" {...soft} />
      {CODE.map(([x, w, accent], i) => (
        <g key={i}>
          <rect x={18} y={37 + i * 16.5} width={12} height={5} rx={2.5} fill="rgb(244 233 225 / 0.18)" />
          <rect x={54 + x} y={37 + i * 16.5} width={w} height={5} rx={2.5} fill={accent ? C.terraL : cream} opacity={accent ? 1 : 0.55} />
        </g>
      ))}
    </>
  )
}

function LaunchLayer() {
  return (
    <>
      <Plate fill={C.paper} stroke="transparent" />
      <path d="M7 0 H293 a7 7 0 0 1 7 7 V16 H0 V7 a7 7 0 0 1 7 -7 Z" fill={C.terra} />
      <rect x={16} y={24} width={32} height={8} rx={2} fill={C.ink} />
      <path d="M212 28 H232 M242 28 H262" stroke={C.muted} strokeWidth={1.4} />
      <circle cx={278} cy={28} r={5} fill="none" stroke={C.ink} strokeWidth={1.2} />
      {/* the hero: a product on a blush ground */}
      <rect x={16} y={42} width={268} height={84} rx={4} fill={C.blush} />
      <circle cx={222} cy={84} r={32} fill={C.terra} />
      <circle cx={222} cy={84} r={18} fill={C.blush2} />
      <rect x={32} y={58} width={110} height={11} rx={2} fill={C.ink} />
      <rect x={32} y={76} width={78} height={6} rx={2} fill={C.muted} opacity={0.6} />
      <rect x={32} y={94} width={54} height={18} rx={9} fill={C.terra} />
      {/* the shelf */}
      {[16, 112, 208].map((x, i) => (
        <g key={x}>
          <rect x={x} y={136} width={76} height={40} rx={3} fill={i === 1 ? C.blush2 : C.beige} />
          <rect x={x} y={182} width={48} height={5} rx={2} fill={C.ink} opacity={0.8} />
          <rect x={x} y={192} width={28} height={5} rx={2} fill={C.terra} />
        </g>
      ))}
    </>
  )
}

const CONTENT = [DesignLayer, BuildLayer, LaunchLayer]

/** The layers, opening out from the middle one. */
function Stack({ uid }) {
  const corners = [
    [0, 0],
    [W, 0],
    [0, H],
    [W, H],
  ]
  return (
    <>
      <defs>
        <radialGradient id={uid}>
          <stop offset="0%" stopColor={C.terra} stopOpacity={0.34} />
          <stop offset="100%" stopColor={C.terra} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={X0 + 39} cy={370} rx={235} ry={170} fill={`url(#${uid})`} />

      {/* Dashed verticals tie the same corner through all three layers */}
      <m.g variants={{ off: { opacity: 0 }, on: { opacity: 1, transition: { duration: 0.7, delay: 0.55 } } }}>
        {corners.map(([u, v]) => {
          const [x, y1] = pt(u, v, TOPS[0])
          const [, y2] = pt(u, v, TOPS[2])
          return <path key={`${u}${v}`} d={`M${x} ${y1} V${y2}`} {...soft} strokeDasharray="2 5" />
        })}
      </m.g>

      {/* Painted back to front: Launch at the bottom, Design on top */}
      {[2, 1, 0].map((i) => {
        const Content = CONTENT[i]
        return (
          <m.g
            key={i}
            variants={{
              off: { y: (1 - i) * 165, opacity: i === 1 ? 1 : 0 },
              on: { y: 0, opacity: 1, transition: { duration: 1.1, ease: EASE, delay: 0.1 } },
            }}
          >
            <g transform={iso(TOPS[i])}>
              <Content />
            </g>
          </m.g>
        )
      })}
    </>
  )
}

/** Leader lines from each layer's right corner to its name. Wide layout only. */
function Labels() {
  return TOPS.map((top, i) => {
    const [x, y] = pt(W, 0, top)
    return (
      <m.g key={i} variants={{ off: { opacity: 0, x: -8 }, on: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.7 + i * 0.12, ease: EASE } } }}>
        <path d={`M${x + 8} ${y} H${x + 34}`} fill="none" stroke={C.terraL} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        <circle cx={x + 8} cy={y} r={2.5} fill={C.terraL} />
        <text x={x + 44} y={y - 4} fontSize={12} fill={C.terraL} style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.18em' }}>
          {`0${i + 1}`}
        </text>
        <text x={x + 72} y={y - 3} fontSize={23} fill="#f4e9e1" style={{ fontFamily: 'var(--font-display)' }}>
          {LAYERS[i]}
        </text>
        <text x={x + 44} y={y + 21} fontSize={15} fill="rgb(244 233 225 / 0.72)" style={{ fontFamily: 'var(--font-sans)' }}>
          {NOTES[i]}
        </text>
      </m.g>
    )
  })
}

const ALT = 'One website pulled apart into three layers: a design wireframe, the code beneath it, and the live store at the bottom.'

export function BuildLayers({ reduced = false, className = '' }) {
  const motionProps = {
    initial: reduced ? false : 'off',
    whileInView: 'on',
    viewport: { once: true, margin: '0px 0px -15% 0px' },
    animate: reduced ? 'on' : undefined,
  }
  return (
    <div className={className}>
      {/* Wide: the stack with its labels beside it */}
      <m.svg viewBox="0 0 716 625" role="img" aria-label={ALT} className="hidden h-auto w-full overflow-visible xl:block" {...motionProps}>
        <Stack uid="build-haze-wide" />
        <Labels />
      </m.svg>
      {/* Narrower: the stack alone, with the same labels set as text beneath */}
      <div className="xl:hidden">
        <m.svg viewBox="0 0 480 625" role="img" aria-label={ALT} className="mx-auto h-auto w-full max-w-md overflow-visible" {...motionProps}>
          <Stack uid="build-haze" />
        </m.svg>
        <ol className="mt-5 border-t border-line">
          {LAYERS.map((name, i) => (
            <li key={name} className="flex flex-wrap items-baseline justify-center gap-x-3 border-b border-line py-3 md:justify-start">
              <span className="label text-[0.625rem] tabular-nums text-terracotta">0{i + 1}</span>
              <span className="font-display text-xl">{name}</span>
              <span className="w-full text-sm text-ink-soft sm:ml-auto sm:w-auto">{NOTES[i]}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
