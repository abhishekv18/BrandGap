import { useId, useLayoutEffect, useMemo, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { useCapabilities } from '../hooks/useCapabilities'
import { CountUp } from './CountUp'
import { Reveal } from './Reveal'

const W = 1000
const H = 300
// Values are in lakh: ₹1Cr = 100L; under ₹1L they read in thousands.
const tick = (v) => (v === 0 ? '₹0' : v >= 100 ? `₹${v / 100}Cr` : v < 1 ? `₹${Math.round(v * 100)}K` : `₹${v}L`)
const money = (v) => (v >= 100 ? `₹${(v / 100).toFixed(2)}Cr` : v < 1 ? `₹${(v * 100).toFixed(1)}K` : `₹${v.toFixed(2)}L`)
const countTick = (v) => (v >= 1000 ? `${v / 1000}K` : String(v))
const count = (v) => Math.round(v).toLocaleString('en-IN')
// Figure grid by count, so no row ever ends on an empty cell.
const KPI_COLS = { 3: 'grid-cols-1 sm:grid-cols-3', 4: 'grid-cols-2 lg:grid-cols-4', 5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' }

/** Scales, paths and line positions for one graph (values in lakh). */
function buildGraph(G) {
  const X = (x) => (x / G.xMax) * W
  const Y = (y) => H - (y / G.yMax) * H
  const pctX = (x) => `${(x / G.xMax) * 100}%`
  const pctY = (y) => `${(y / G.yMax) * 100}%`
  const line = G.points.map((p, i) => `${i ? 'L' : 'M'}${X(p.x).toFixed(1)} ${Y(p.y).toFixed(1)}`).join(' ')
  const end = G.points.at(-1)
  const area = `${line} L${X(end.x).toFixed(1)} ${H} L0 ${H} Z`
  // How far along the line each point sits (0–1), so its dot lands as the line reaches it.
  const segments = G.points.slice(1).map((p, i) => Math.hypot(X(p.x) - X(G.points[i].x), Y(p.y) - Y(G.points[i].y)))
  const total = segments.reduce((a, b) => a + b, 0)
  const at = G.points.map((_, i) => segments.slice(0, i).reduce((a, b) => a + b, 0) / total)
  /** The data point at a fraction (0–1) of the way along the line. */
  const along = (d) => {
    let rest = Math.min(1, Math.max(0, d)) * total
    for (let i = 0; i < segments.length; i++) {
      if (rest <= segments[i] || i === segments.length - 1) {
        const t = segments[i] ? Math.min(1, rest / segments[i]) : 0
        const a = G.points[i]
        const b = G.points[i + 1]
        return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
      }
      rest -= segments[i]
    }
    return end
  }
  return { X, Y, pctX, pctY, line, area, end, at, along }
}

/** The named points on the line, with their own value and ROAS — a column, or one row in the compact panel. */
function PointList({ points, compact = false }) {
  const named = points.map((p, i) => ({ ...p, n: i })).filter((p) => p.name)
  return (
    <ol
      className={
        compact
          ? `grid gap-x-5 gap-y-3 border-t border-line-light pt-4 sm:grid-cols-2 lg:col-span-12 ${named.length > 3 ? 'lg:grid-cols-5' : 'lg:grid-cols-3'}`
          : 'flex flex-col gap-3'
      }
    >
      {named.map((p) => (
        <li key={p.id} className={compact ? 'flex flex-col gap-1' : 'flex items-baseline gap-3'}>
          {compact ? (
            <>
              <span className="label flex gap-2 text-[0.5625rem] text-cream/65">
                <span className="text-blush">0{p.n}</span>
                {p.name}
              </span>
              <span className="flex items-baseline gap-2">
                <span className="font-display text-base leading-none text-cream">{p.value}</span>
                <span className="label text-[0.5625rem] text-blush">{p.roas}</span>
              </span>
            </>
          ) : (
            <>
              <span className="label shrink-0 text-[0.625rem] text-blush">0{p.n}</span>
              <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <span className="label text-[0.625rem] text-cream/65">{p.name}</span>
                <span className="flex items-baseline gap-2">
                  <span className="font-display text-lg leading-none text-cream">{p.value}</span>
                  <span className="label text-[0.5625rem] text-blush">{p.roas}</span>
                </span>
              </span>
            </>
          )}
        </li>
      ))}
    </ol>
  )
}

/** One live readout: a label and a number the scroll drives. */
function Readout({ label, value, name, accent = false, compact = false, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span className="label text-[0.625rem] text-cream/55">{label}</span>
      <span
        data-read={name}
        className={`font-display leading-none tabular-nums ${
          accent
            ? `${compact ? 'text-[clamp(1.25rem,1rem+0.9vw,1.625rem)]' : 'text-[clamp(1.375rem,1rem+1.3vw,2rem)]'} text-[#D9806F]`
            : `${compact ? 'text-[clamp(1rem,0.9rem+0.4vw,1.25rem)]' : 'text-[clamp(1.125rem,0.95rem+0.6vw,1.5rem)]'} text-cream`
        }`}
      >
        {value}
      </span>
    </div>
  )
}

/**
 * The dark numbers panel, shared by the homepage and every case study:
 * a title bar, headline figures that count up, and a graph of cumulative
 * ad spend against purchase value that draws itself upward as you scroll,
 * with a live readout riding the tip of the line. The caption is always
 * visible.
 *
 *   title       title-bar text
 *   kpis        [{ id, label, value: number, prefix, suffix, decimals }]
 *   graph       { title, xMax, yMax, xTicks, yTicks, points: [{ id, x, y, name?, value?, roas? }] }, or null for figures only.
 *               Options: valueLabel ('Purchase value'), yFormat 'money' | 'count',
 *               ratio 'roas' | 'cost' (₹ per unit of y), breakEven (true)
 *   caption     the disclaimer under the panel
 *   summary     a sentence describing the graph, for screen readers
 *   roasDigits  decimals for the live ROAS readout
 *   compact     a smaller panel, for pages where it supports rather than leads
 */
export function MetricsPanel({ title, kpis, graph, caption, summary, roasDigits = 1, compact = false, className = '' }) {
  // Sizes for the two variants: the full panel (homepage) and the compact one (case studies).
  const size = compact
    ? { bar: 'px-5 py-3 md:px-6', kpi: 'px-4 py-3.5 md:px-5 md:py-4', figure: 'text-[clamp(1.25rem,1rem+0.7vw,1.625rem)]', chart: 'px-5 py-4 md:px-7 md:py-5 lg:gap-8', plot: 'h-28 sm:h-32 xl:h-36', cap: 'px-5 py-3 md:px-7' }
    : { bar: 'px-5 py-4 md:px-8', kpi: 'px-5 py-6 md:px-7 md:py-8', figure: 'text-[clamp(1.625rem,1rem+1.7vw,2.75rem)]', chart: 'px-5 py-5 md:px-8 md:py-6 lg:gap-10', plot: 'h-36 sm:h-40 lg:h-44 xl:h-48', cap: 'px-5 py-4 md:px-8' }
  const { reducedMotion } = useCapabilities()
  const root = useRef(null)
  const g = useMemo(() => (graph ? buildGraph(graph) : null), [graph])
  const uid = useId().replace(/:/g, '')
  const fillId = `fill-${uid}`
  const clipId = `reveal-${uid}`
  const counts = graph?.yFormat === 'count'
  const valueLabel = graph?.valueLabel ?? 'Purchase value'
  const ratioLabel = graph?.ratio === 'cost' ? 'Cost / contact' : 'ROAS'
  const breakEven = graph ? graph.breakEven ?? !counts : false
  const fmtY = (v) => (counts ? count(v) : money(v))
  const yTick = (v) => (counts ? countTick(v) : tick(v))
  const roas = (x, y) => (graph?.ratio === 'cost' ? (y ? `₹${((x * 100000) / y).toFixed(2)}` : '—') : `${(y / x).toFixed(roasDigits)}X`)

  useLayoutEffect(() => {
    if (reducedMotion || !g) return
    const el = root.current
    const q = (s) => el.querySelector(s)
    const head = q('[data-head]')
    const guide = q('[data-guide]')
    const spend = q('[data-read="spend"]')
    const value = q('[data-read="value"]')
    const ratio = q('[data-read="roas"]')
    const reveal = q('[data-reveal]')

    // The tip of the line and the readouts follow the same scroll position.
    const follow = (d) => {
      const p = g.along(d)
      head.style.left = g.pctX(p.x)
      head.style.bottom = g.pctY(p.y)
      guide.style.left = g.pctX(p.x)
      guide.style.height = g.pctY(p.y)
      reveal.setAttribute('width', g.X(p.x).toFixed(1))
      spend.textContent = money(p.x)
      value.textContent = fmtY(p.y)
      ratio.textContent = p.x > g.end.x * 0.02 ? roas(p.x, p.y) : '—'
    }

    const ctx = gsap.context(() => {
      const chart = q('[data-chart]')
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: chart, start: 'top 80%', end: 'bottom 70%', scrub: 0.8 },
        onUpdate: () => follow(Math.min(1, tl.time())),
      })
      const even = q('[data-even]')
      if (even) tl.fromTo(even, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 0)
      tl.fromTo(q('[data-line]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1 }, 0)
      el.querySelectorAll('[data-point]').forEach((dot) => {
        const i = Number(dot.dataset.point)
        tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.06, ease: 'back.out(3)' }, Math.max(0, g.at[i] - 0.03))
        const label = q(`[data-point-label="${i}"]`)
        if (label) tl.fromTo(label, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.08 }, g.at[i])
      })
      // Hold the finished graph for a beat before the page scrolls on.
      tl.set({}, {}, 1.15)
      follow(0)
    }, root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, g])

  return (
    <Reveal
      as="figure"
      data-theme="dark"
      className={`relative overflow-hidden bg-ink text-left text-cream shadow-[0_40px_80px_-50px_rgba(26,26,26,0.6)] ${className}`}
    >
      <div ref={root}>
        {/* Title bar */}
        <div className={`flex flex-wrap items-center justify-center gap-3 border-b border-line-light md:justify-start ${size.bar}`}>
          <p className="label flex items-center gap-3 text-cream">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-terracotta opacity-60 motion-reduce:animate-none" />
              <span className="relative size-2 rounded-full bg-terracotta" />
            </span>
            {title}
          </p>
        </div>

        {/* Hairline grid: the 1px gaps show the line colour through */}
        <dl className={`grid gap-px bg-line-light ${KPI_COLS[kpis.length] ?? KPI_COLS[5]}`}>
          {kpis.map((k, i) => (
            <div
              key={k.id}
              className={`flex flex-col-reverse justify-end gap-2 bg-ink text-center md:text-left ${size.kpi} ${
                kpis.length === 5 && i === 4 ? 'col-span-2 lg:col-span-1' : ''
              }`}
            >
              <dt className="label text-[0.6875rem] text-cream/65">{k.label}</dt>
              <dd className={`font-display leading-none ${size.figure}`}>
                <CountUp value={k.value} decimals={k.decimals} prefix={k.prefix} suffix={k.suffix} delay={i * 0.08} />
              </dd>
            </div>
          ))}
        </dl>

        {/* Cumulative spend against the result, drawn upward with the scroll */}
        {g && (
        <div data-chart className={`grid gap-5 border-t border-line-light lg:grid-cols-12 ${size.chart}`}>
          {/* The live readout and the key */}
          <div className={`flex flex-col lg:col-span-4 lg:justify-between ${compact ? 'gap-4' : 'gap-5'}`}>
            <div>
              <p className="label text-[0.6875rem] text-cream/65">{graph.title}</p>
              <p aria-hidden className="label mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.625rem] text-cream/55">
                <span className="flex items-center gap-2">
                  <span className="h-0.5 w-5 bg-[#C46A5B]" /> {valueLabel}
                </span>
                {breakEven && (
                  <span className="flex items-center gap-2">
                    <span className="w-5 border-t border-dashed border-cream/50" /> Break-even 1X
                  </span>
                )}
              </p>
            </div>

            <div aria-hidden className="grid grid-cols-3 gap-4 border-y border-line-light py-4 lg:grid-cols-2 lg:gap-x-4 lg:gap-y-4">
              <Readout label={valueLabel} name="value" value={fmtY(g.end.y)} accent compact={compact} className="lg:col-span-2" />
              <Readout label="Ad spend" name="spend" value={money(g.end.x)} compact={compact} />
              <Readout label={ratioLabel} name="roas" value={roas(g.end.x, g.end.y)} compact={compact} />
            </div>

            {!compact && <PointList points={graph.points} />}
          </div>

          {/* The graph */}
          <div className="flex gap-3 lg:col-span-8">
            {/* Y axis */}
            <div aria-hidden className={`relative w-9 shrink-0 ${size.plot}`}>
              {graph.yTicks.map((t) => (
                <span
                  key={t}
                  className="absolute right-0 translate-y-1/2 text-[0.625rem] tabular-nums text-cream/45"
                  style={{ bottom: g.pctY(t) }}
                >
                  {yTick(t)}
                </span>
              ))}
            </div>

            <div className="min-w-0 flex-1">
              {/* Plot */}
              <div className={`relative ${size.plot}`}>
                <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
                  <defs>
                    <clipPath id={clipId}>
                      <rect data-reveal x="0" y="-20" width={g.X(g.end.x)} height={H + 40} />
                    </clipPath>
                    <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#A8483A" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#A8483A" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {graph.yTicks.map((t) => (
                    <line key={t} x1="0" x2={W} y1={g.Y(t)} y2={g.Y(t)} stroke="rgb(244 233 225 / 0.08)" vectorEffect="non-scaling-stroke" />
                  ))}
                  {breakEven && (
                    <line
                      data-even
                      x1="0"
                      y1={H}
                      x2={g.X(Math.min(graph.xMax, graph.yMax))}
                      y2={g.Y(Math.min(graph.xMax, graph.yMax))}
                      stroke="rgb(244 233 225 / 0.45)"
                      strokeDasharray="4 6"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                  <path d={g.area} fill={`url(#${fillId})`} clipPath={`url(#${clipId})`} />
                  <path
                    data-line
                    d={g.line}
                    pathLength="1"
                    strokeDasharray="1"
                    fill="none"
                    stroke="#C46A5B"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* A hairline from the tip of the line down to the spend axis */}
                <span
                  data-guide
                  aria-hidden
                  className="absolute bottom-0 block w-px -translate-x-1/2 border-l border-dashed border-cream/25"
                  style={{ left: g.pctX(g.end.x), height: g.pctY(g.end.y) }}
                />

                {/* Points, markers and the moving tip are HTML, so they never stretch with the plot */}
                {graph.points.map((p, i) => (
                  <span
                    key={p.id}
                    data-point={i}
                    aria-hidden
                    className="absolute block size-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-terracotta ring-4 ring-ink"
                    style={{ left: g.pctX(p.x), bottom: g.pctY(p.y) }}
                  />
                ))}
                {graph.points.map(
                  (p, i) =>
                    p.name && (
                      <span
                        key={p.id}
                        data-point-label={i}
                        aria-hidden
                        className="absolute label -translate-x-full text-[0.625rem] text-blush"
                        style={{ left: `calc(${g.pctX(p.x)} - 0.5rem)`, bottom: `calc(${g.pctY(p.y)} + 0.5rem)` }}
                      >
                        0{i}
                      </span>
                    ),
                )}
                <span
                  data-head
                  aria-hidden
                  className="absolute block size-3.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-cream shadow-[0_0_0_5px_rgb(168_72_58/0.35),0_0_18px_4px_rgb(217_128_111/0.45)]"
                  style={{ left: g.pctX(g.end.x), bottom: g.pctY(g.end.y) }}
                />
              </div>

              {/* X axis */}
              <div aria-hidden className="relative mt-2.5 h-4">
                {graph.xTicks.map((t, i) => (
                  <span
                    key={t}
                    className={`absolute text-[0.625rem] tabular-nums text-cream/45 ${i ? '-translate-x-1/2' : ''}`}
                    style={{ left: g.pctX(t) }}
                  >
                    {tick(t)}
                  </span>
                ))}
              </div>
              <p aria-hidden className="label mt-2 text-right text-[0.5625rem] text-cream/45">
                Meta ad spend →
              </p>
            </div>
          </div>

          {compact && <PointList points={graph.points} compact />}

          {summary && <p className="sr-only">{summary}</p>}
        </div>
        )}

        {caption && (
          <figcaption className={`border-t border-line-light text-center text-xs text-cream/75 md:text-left ${size.cap}`}>{caption}</figcaption>
        )}
      </div>
    </Reveal>
  )
}

/** Turns a display figure such as '₹37.79L+' or '10,895+' into a count-up spec. */
export function toKpi(metric, i) {
  const m = String(metric.value).match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/)
  if (!m) return { id: `k${i}`, label: metric.label, value: 0, prefix: metric.value, suffix: '', decimals: 0 }
  const [, prefix, num, suffix] = m
  const decimals = num.includes('.') ? num.split('.')[1].length : 0
  return { id: `k${i}`, label: metric.label, value: Number(num.replace(/,/g, '')), prefix, suffix, decimals }
}
