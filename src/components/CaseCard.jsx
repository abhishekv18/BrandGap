import { ArrowRight, Plus } from 'lucide-react'
import { cardMetrics, flowSteps, siteAddress } from '../data/projects'
import { useHrefClick } from '../hooks/useHrefClick'
import { Copy } from './Copy'
import { m } from 'framer-motion'
import { CountUp } from './CountUp'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { ProjectPlate } from './ProjectPlate'

/**
 * One case study (brief §5.2): client name, category tag, three headline
 * metrics. Hovering (or focusing) the image previews the
 * Problem → Strategy → Creative → Campaign → Result flow; "Expand" opens the
 * full flow in a drawer; the image and title lead to /portfolio/[slug].
 */
export function CaseCard({ project, onExpand, ratio = '4 / 3', letter = 'b', crop = 'right', heading: H = 'h3', className = '', frame = false }) {
  const href = `/portfolio/${project.slug}`
  const hrefClick = useHrefClick()
  const titleId = `case-${project.slug}`
  const reduced = useReducedMotion()

  return (
    <article aria-labelledby={titleId} className={`group/card flex flex-col text-center md:text-left ${className}`}>
      <a
        href={href}
        onClick={(e) => hrefClick(e, href)}
        data-cursor="view"
        aria-label={`View case study ${project.index}`}
        data-ground="paper"
        className="relative block"
        {...(frame ? { 'data-frame': '' } : {})}
      >
        {project.image ? (
          /* A real website: shown whole, in the same quiet browser window as the portfolio page */
          <span className="block overflow-hidden rounded-[0.625rem] border border-line bg-cream shadow-[0_30px_60px_-40px_rgba(28,18,22,0.45)]">
            <span aria-hidden className="flex items-center gap-3 border-b border-line bg-[#F7EFE9] px-3 py-2">
              <span className="flex gap-1.5">
                <span className="size-2 rounded-full bg-terracotta/70" />
                <span className="size-2 rounded-full bg-ink/20" />
                <span className="size-2 rounded-full bg-ink/20" />
              </span>
              <span className="mx-auto max-w-[60%] truncate rounded-full bg-cream px-4 py-0.5 text-center text-[0.625rem] tracking-wide text-ink-muted">
                {siteAddress(project)}
              </span>
              <span className="w-[2.625rem]" />
            </span>
            <ProjectPlate project={project} ratio="16 / 9" letter={letter} crop={crop} cursor={undefined} full />
          </span>
        ) : (
          <ProjectPlate project={project} ratio={ratio} letter={letter} crop={crop} cursor={undefined} />
        )}

        {/* Hover-to-preview: the flow, one step at a time */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 hidden flex-col justify-end bg-ink/85 p-5 text-cream ${project.image ? 'rounded-[0.625rem]' : ''} opacity-0 transition-opacity duration-500 ease-(--ease-out-expo) group-hover/card:opacity-100 group-focus-within/card:opacity-100 md:flex lg:p-7`}
        >
          <span className="label mb-3 text-[0.6875rem] text-blush">Strategy → Result</span>
          <span className="flex flex-col">
            {flowSteps(project).map((step, i) => (
              <span
                key={step.id}
                className="flex translate-y-2 items-baseline gap-4 border-t border-line-light py-2 text-left opacity-0 transition-[opacity,translate] duration-500 ease-(--ease-out-expo) group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100"
                style={{ transitionDelay: `${60 + i * 55}ms` }}
              >
                <span className="label w-20 shrink-0 text-[0.6875rem] text-blush">{step.label}</span>
                <span className="truncate text-sm">
                  <Copy value={project.flow[step.id]} tone="light" />
                </span>
              </span>
            ))}
          </span>
        </span>
      </a>

      <div className="mt-5 flex flex-col items-center gap-2 md:flex-row md:items-baseline md:gap-4">
        <span aria-hidden className="font-display text-2xl leading-none text-terracotta">
          {project.index}
        </span>
        <H id={titleId} className="font-display text-h3 leading-tight">
          <a href={href} onClick={(e) => hrefClick(e, href)} className="transition-colors hover:text-terracotta">
            <Copy value={project.client} />
          </a>
        </H>
      </div>
      <p className="label mt-3 flex items-baseline justify-center gap-2 text-[0.625rem] leading-[1.5] text-ink-soft md:justify-start">
        <span aria-hidden className="size-1 shrink-0 -translate-y-px rounded-full bg-terracotta" />
        <Copy value={project.category} tone="inherit" />
      </p>

      {/* Results: three equal columns ruled apart, every value on one baseline with its label beneath.
          As the card arrives the rule draws across, the dividers rise and each figure counts up.
          Sizes follow the card's own width (container units), so values never run into each other. */}
      <m.div
        className="@container relative mt-5"
        initial={reduced ? false : 'off'}
        whileInView="on"
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      >
        <m.span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px origin-left bg-line"
          variants={{ off: { scaleX: 0 }, on: { scaleX: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } }}
        />
        <p className="label flex items-center justify-center gap-2 py-2.5 text-[0.625rem] text-ink-muted md:justify-start">
          <span aria-hidden className="size-1 rounded-full bg-terracotta" />
          Results
        </p>
        <dl className="relative grid grid-cols-3 border-t border-line">
          {cardMetrics(project).map((metric, i) => (
            <div key={i} className="relative flex min-w-0 flex-col-reverse justify-end gap-1.5 py-4 pr-2 pl-[6cqw] first:pl-0">
              {i > 0 && (
                <m.span
                  aria-hidden
                  className="absolute top-3 bottom-3 left-0 w-px origin-top bg-line"
                  variants={{ off: { scaleY: 0 }, on: { scaleY: 1, transition: { duration: 0.6, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] } } }}
                />
              )}
              <dt className="label min-h-[2.4em] text-[clamp(0.5625rem,2.3cqw,0.6875rem)] leading-[1.25] tracking-[0.14em] text-ink-muted">
                <Copy value={metric.label} tone="inherit" />
              </dt>
              <dd className="font-display text-[clamp(1.0625rem,5.2cqw,1.75rem)] leading-none whitespace-nowrap">
                <Figure value={metric.value} delay={0.2 + i * 0.12} />
              </dd>
            </div>
          ))}
        </dl>
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-line" />
      </m.div>

      <div className="mt-3 flex items-center justify-center gap-6 md:justify-between">
        {onExpand && (
          <button
            type="button"
            onClick={() => onExpand(project)}
            aria-haspopup="dialog"
            className="label inline-flex min-h-11 items-center gap-2 text-ink transition-colors hover:text-terracotta"
          >
            <Plus aria-hidden strokeWidth={1.5} className="size-4" />
            Expand
          </button>
        )}
        <a
          href={href}
          onClick={(e) => hrefClick(e, href)}
          className="label group/link inline-flex min-h-11 items-center gap-2 text-ink transition-colors hover:text-terracotta"
        >
          Case study
          <ArrowRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-500 group-hover/link:translate-x-1" />
        </a>
      </div>
    </article>
  )
}

/** A headline figure ("₹37.64L+", "10,945+", "3.41X") that counts up; anything else is shown as written. */
function Figure({ value, delay }) {
  const match = typeof value === 'string' && value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/)
  if (!match) return <Copy value={value} />
  const [, prefix, num, suffix] = match
  const decimals = num.includes('.') ? num.split('.')[1].length : 0
  return <CountUp value={Number(num.replace(/,/g, ''))} decimals={decimals} prefix={prefix} suffix={suffix} duration={1.4} delay={delay} />
}
