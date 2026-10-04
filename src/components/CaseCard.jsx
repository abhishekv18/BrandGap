import { ArrowRight, Plus } from 'lucide-react'
import { CASE_FLOW } from '../data/projects'
import { useHrefClick } from '../hooks/useHrefClick'
import { Copy } from './Copy'
import { ProjectPlate } from './ProjectPlate'

/**
 * One case study (brief §5.2): client name, category tag, three headline
 * metrics. Hovering (or focusing) the image previews the
 * Problem → Strategy → Creative → Campaign → Result flow; "Expand" opens the
 * full flow in a drawer; the image and title lead to /work/[slug].
 */
export function CaseCard({ project, onExpand, ratio = '4 / 3', letter = 'b', crop = 'right', heading: H = 'h3', className = '', frame = false }) {
  const href = `/work/${project.slug}`
  const hrefClick = useHrefClick()
  const titleId = `case-${project.slug}`

  return (
    <article aria-labelledby={titleId} className={`group/card flex flex-col text-center md:text-left ${className}`}>
      <a
        href={href}
        onClick={(e) => hrefClick(e, href)}
        data-cursor="view"
        aria-label={`View case study ${project.index}`}
        className="relative block"
        {...(frame ? { 'data-frame': '' } : {})}
      >
        <ProjectPlate project={project} ratio={ratio} letter={letter} crop={crop} cursor={undefined} />

        {/* Hover-to-preview: the flow, one step at a time */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden flex-col justify-end bg-ink/85 p-5 text-cream opacity-0 transition-opacity duration-500 ease-(--ease-out-expo) group-hover/card:opacity-100 group-focus-within/card:opacity-100 md:flex lg:p-7"
        >
          <span className="label mb-3 text-[0.6875rem] text-blush">Problem → Result</span>
          <span className="flex flex-col">
            {CASE_FLOW.map((step, i) => (
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
        <span className="label rounded-full border border-line px-3 py-1 text-[0.6875rem] text-ink-soft md:ml-auto">
          <Copy value={project.category} tone="inherit" />
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4">
        {project.metrics.map((metric, i) => (
          <div key={i} className="flex flex-col-reverse justify-end gap-1">
            <dt className="label text-[0.6875rem] text-ink-muted">
              <Copy value={metric.label} tone="inherit" />
            </dt>
            <dd className="font-display text-lg leading-tight md:text-xl">
              <Copy value={metric.value} />
            </dd>
          </div>
        ))}
      </dl>

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
