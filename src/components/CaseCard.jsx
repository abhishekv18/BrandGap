import { ArrowRight, Plus } from 'lucide-react'
import { cardMetrics, flowSteps, siteAddress } from '../data/projects'
import { useHrefClick } from '../hooks/useHrefClick'
import { Copy } from './Copy'
import { m } from 'framer-motion'
import { CountUp } from './CountUp'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { ProjectPlate } from './ProjectPlate'

/**
 * One case study (brief §5.2), set as a paper sheet so it reads like a page from the
 * report: the site in its browser frame, the client and what we did, the one-line
 * story, then the three headline results in a ruled grid. Hovering (or focusing) the image previews the
 * Problem → Strategy → Creative → Campaign → Result flow; "Expand" opens the
 * full flow in a drawer; the image and title lead to /portfolio/[slug].
 */
export function CaseCard({ project, onExpand, ratio = '4 / 3', letter = 'b', crop = 'right', heading: H = 'h3', className = '', frame = false }) {
  const href = `/portfolio/${project.slug}`
  const hrefClick = useHrefClick()
  const titleId = `case-${project.slug}`
  const reduced = useReducedMotion()

  return (
    <article
      aria-labelledby={titleId}
      className={`group/card flex flex-col rounded-[1rem] border border-ink/10 bg-[#FBF7F3] p-2.5 text-center shadow-[0_40px_70px_-50px_rgba(28,18,22,0.5)] transition-[box-shadow,transform] duration-700 ease-(--ease-out-expo) hover:-translate-y-1 hover:shadow-[0_50px_80px_-50px_rgba(28,18,22,0.6)] md:p-3 md:text-left ${className}`}
    >
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
          <span className="block overflow-hidden rounded-[0.75rem] border border-line bg-cream">
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

      <div className="flex flex-1 flex-col px-2 pt-5 pb-1 md:px-3">
        <div className="flex flex-col items-center gap-2 md:flex-row md:items-baseline md:justify-between md:gap-4">
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-baseline md:gap-3">
            <span aria-hidden className="font-display text-2xl leading-none text-terracotta">
              {project.index}
            </span>
            <H id={titleId} className="font-display text-h3 leading-tight">
              <a href={href} onClick={(e) => hrefClick(e, href)} className="transition-colors hover:text-terracotta">
                <Copy value={project.client} />
              </a>
            </H>
          </div>
        </div>
        <p className="label mt-2.5 flex items-baseline justify-center gap-2 text-[0.625rem] leading-[1.5] text-ink-muted md:justify-start">
          <span aria-hidden className="size-1 shrink-0 -translate-y-px rounded-full bg-terracotta" />
          <Copy value={project.category} tone="inherit" />
        </p>
        {project.statement && (
          <p className="mt-3 font-display text-lg leading-snug text-ink-soft italic md:min-h-[2.75em] [@media(max-height:700px)_and_(min-width:1024px)]:hidden">
            <Copy value={project.statement} tone="inherit" />
          </p>
        )}

        {/* Results: a ruled three-column grid, each figure on its own baseline with its label beneath.
            As the card arrives the frame draws in and each figure counts up. Sizes follow the
            card's own width (container units), so values never run into each other. */}
        <m.div
          className="@container mt-5"
          initial={reduced ? false : 'off'}
          whileInView="on"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        >
          <p className="label flex items-center justify-center gap-2 pb-2.5 text-[0.625rem] text-ink-muted md:justify-start">
            <span aria-hidden className="h-px w-4 bg-terracotta" />
            Results
          </p>
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-[0.625rem] border border-line bg-line">
            {cardMetrics(project).map((metric, i) => (
              <m.div
                key={i}
                className="flex min-w-0 flex-col-reverse justify-end gap-2 bg-white/70 px-[5cqw] py-4 text-center md:text-left"
                variants={{ off: { opacity: 0, y: 10 }, on: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] } } }}
              >
                <dt className="label min-h-[2.4em] text-[clamp(0.5625rem,2.2cqw,0.6875rem)] leading-[1.25] tracking-[0.14em] text-ink-muted">
                  <Copy value={metric.label} tone="inherit" />
                </dt>
                <dd className="font-display text-[clamp(1.125rem,5.6cqw,1.875rem)] leading-none whitespace-nowrap text-ink">
                  <Figure value={metric.value} delay={0.2 + i * 0.12} />
                </dd>
              </m.div>
            ))}
          </dl>
        </m.div>

        <div className="mt-auto flex items-center justify-center gap-6 pt-3 md:justify-between">
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
