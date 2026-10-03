import { m } from 'framer-motion'
import { CountUp } from '../components/CountUp'
import { Reveal } from '../components/Reveal'
import { DASHBOARD } from '../data/growth'
import { useReducedMotion } from '../hooks/useMediaQuery'

const EASE = [0.16, 1, 0.3, 1]
const W = 600
const H = 160

/** The illustrative trend as an SVG path in a W×H box. */
function trendPath(points, close = false) {
  const step = W / (points.length - 1)
  const line = points.map((v, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)} ${(H - v * H * 0.9 - 6).toFixed(1)}`).join(' ')
  return close ? `${line} L${W} ${H} L0 ${H} Z` : line
}

/**
 * The growth dashboard (brief §5.3), titled BRANDGAP / GROWTH SYSTEM.
 * Numbers count up once on entering the viewport and the trend draws in.
 * While DASHBOARD.sample is true the panel is labelled an illustration in
 * three places — badge, chart caption, footnote — so it can never be read
 * as a client result.
 */
export function Dashboard() {
  const reduced = useReducedMotion()
  const { kpis, sample } = DASHBOARD

  return (
    <section id="dashboard" aria-labelledby="dashboard-title" data-grain className="container-page pb-12 md:pb-16 xl:pb-20">
      <Reveal
        data-theme="dark"
        className="relative overflow-hidden bg-ink text-cream shadow-[0_40px_80px_-50px_rgba(26,26,26,0.6)]"
      >
        {/* Title bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-light px-5 py-4 md:px-8">
          <h3 id="dashboard-title" className="label flex items-center gap-3 font-sans text-cream">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-terracotta opacity-60 motion-reduce:animate-none" />
              <span className="relative size-2 rounded-full bg-terracotta" />
            </span>
            {DASHBOARD.title}
          </h3>
          {sample && (
            <span className="label rounded-full border border-blush/50 px-3 py-1 text-[0.625rem] text-blush">
              {DASHBOARD.sampleLabel}
            </span>
          )}
        </div>

        {/* KPIs */}
        {/* Hairline grid: the 1px gaps show the line colour through */}
        <dl className="grid grid-cols-2 gap-px border-b border-line-light bg-line-light sm:grid-cols-3 lg:grid-cols-5">
          {kpis.map((k, i) => (
            <div
              key={k.id}
              className={`flex flex-col-reverse justify-end gap-2 bg-ink px-5 py-5 text-center md:px-7 md:py-6 md:text-left ${
                i === kpis.length - 1 ? 'col-span-2 lg:col-span-1' : ''
              }`}
            >
              <dt className="label text-[0.6875rem] text-cream/65">{k.label}</dt>
              <dd className="font-display text-[clamp(1.625rem,1rem+1.7vw,2.75rem)] leading-none">
                <CountUp value={k.value} decimals={k.decimals} prefix={k.prefix} suffix={k.suffix} delay={i * 0.08} />
              </dd>
            </div>
          ))}
        </dl>

        {/* Trend */}
        <figure className="px-5 pt-6 pb-5 md:px-8 md:pt-8">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-24 w-full md:h-32" aria-hidden>
            {[0.25, 0.5, 0.75].map((y) => (
              <line key={y} x1="0" x2={W} y1={H * y} y2={H * y} stroke="rgb(244 233 225 / 0.08)" vectorEffect="non-scaling-stroke" />
            ))}
            <m.path
              d={trendPath(DASHBOARD.trend, true)}
              fill="rgb(168 72 58 / 0.18)"
              initial={reduced ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
            />
            <m.path
              d={trendPath(DASHBOARD.trend)}
              fill="none"
              stroke="#C46A5B"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              initial={reduced ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
            />
          </svg>
          <figcaption className="mt-4 flex flex-col gap-2 text-xs text-cream/65 sm:flex-row sm:items-center sm:justify-between">
            <span className="label text-[0.625rem]">{sample ? 'Illustrative trend' : 'Trend'}</span>
            {sample && <span>{DASHBOARD.sampleNote}</span>}
          </figcaption>
        </figure>
      </Reveal>
    </section>
  )
}
