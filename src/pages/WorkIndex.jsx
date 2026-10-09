import { AnimatePresence, m } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { BrowserFrame } from '../components/BrowserFrame'
import { CaseDrawer } from '../components/CaseDrawer'
import { Copy } from '../components/Copy'
import { CountUp } from '../components/CountUp'
import { FilterChips } from '../components/FilterChips'
import { LogoStrip } from '../components/LogoStrip'
import { MagneticButton } from '../components/MagneticButton'
import { PageHero } from '../components/PageHero'
import { Ground } from '../components/Ground'
import { Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { NUMBERS } from '../data/growth'
import { cardMetrics, INDUSTRIES, PUBLISHED_PROJECTS, siteAddress, WORK_INTRO } from '../data/projects'
import { useHrefClick } from '../hooks/useHrefClick'
import { breadcrumbLd, useSeo } from '../hooks/useSeo'
import { FinalCta } from '../sections/FinalCta'
import { MoreWork } from '../sections/Work'

const EASE = [0.16, 1, 0.3, 1]
// How many strategy tags a row shows before "+n more".
const TAGS = 4

/** The combined results across the featured cases, set as an ink figures band under the title. */
function ResultsBar() {
  return (
    <section aria-label="Results across featured projects" data-ground="ink" className="relative isolate py-14 md:py-16">
      <Ground tone="ink" />
      <div className="container-page">
      <Reveal className="border-y border-line">
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {NUMBERS.kpis.map((k, i) => (
            <div
              key={k.id}
              className={`flex flex-col-reverse justify-end gap-1.5 border-line py-5 text-center md:py-6 lg:px-6 lg:text-left lg:first:pl-0 lg:[&:not(:first-child)]:border-l ${
                i === NUMBERS.kpis.length - 1 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <dt className="label text-[0.625rem] text-ink-muted">{k.label}</dt>
              <dd className="font-display text-[clamp(1.5rem,1rem+1.2vw,2.25rem)] leading-none">
                <CountUp value={k.value} decimals={k.decimals} prefix={k.prefix} suffix={k.suffix} delay={i * 0.08} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <p className="mt-3 text-center text-xs text-ink-muted lg:text-left">{NUMBERS.disclaimer}</p>
      </div>
    </section>
  )
}

/**
 * One case study as an editorial row: the site in a browser frame on one
 * side (alternating), the story on the other — category, client, statement,
 * summary, three headline figures, the strategy, and the ways in.
 */
function CaseRow({ project, flip, onQuickView }) {
  const href = `/portfolio/${project.slug}`
  const hrefClick = useHrefClick()
  const tags = project.strategy ?? []

  return (
    <article aria-labelledby={`row-${project.slug}`} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
      {project.image ? (
        <a
          href={href}
          onClick={(e) => hrefClick(e, href)}
          data-cursor="view"
          aria-label={`View the ${project.client} case study`}
          className={`group block transition-transform duration-700 ease-(--ease-out-expo) hover:-translate-y-1 lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}
        >
          <BrowserFrame image={project.image} address={siteAddress(project)} sizes="(min-width: 1024px) 58vw, 100vw" />
        </a>
      ) : (
        /* No imagery: the case's figures take the visual's place, set as a ruled ledger */
        <dl className={`grid grid-cols-2 border-t border-line lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
          {project.metrics.map((m) => (
            <div key={m.label} className="flex flex-col-reverse justify-end gap-2 border-b border-line px-1 py-6 text-center odd:border-r sm:px-6 md:py-8 lg:text-left lg:odd:pl-0">
              {m.note && <span className="text-[0.6875rem] leading-snug text-ink-muted">{m.note}</span>}
              <dt className="label text-[0.625rem] text-ink-soft">{m.label}</dt>
              <dd className="font-display text-[clamp(2.25rem,1.4rem+2.6vw,4rem)] leading-none tracking-[-0.03em]">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className={`mx-auto max-w-2xl text-center md:text-left lg:col-span-5 lg:mx-0 lg:max-w-none ${flip ? 'lg:order-1' : ''}`}>
        <p className="label flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.6875rem] text-ink-muted md:justify-start">
          <span className="text-terracotta">{project.index}</span>
          <span aria-hidden className="h-px w-6 bg-current opacity-40" />
          <Copy value={project.category} tone="inherit" />
        </p>
        <h2 id={`row-${project.slug}`} className="mt-4 text-h2">
          <a href={href} onClick={(e) => hrefClick(e, href)} className="transition-colors hover:text-terracotta">
            <Copy value={project.client} />
          </a>
        </h2>
        {project.statement && <p className="mt-3 font-display text-xl italic text-ink-soft">{project.statement}</p>}
        <p className="mx-auto mt-4 max-w-md text-ink-soft md:mx-0">
          <Copy value={project.summary} />
        </p>

        <dl className={`mt-6 grid grid-cols-3 gap-4 border-y border-line py-4 ${project.image ? '' : 'hidden'}`}>
          {cardMetrics(project).map((metric) => (
            <div key={metric.label} className="flex flex-col-reverse justify-end gap-1">
              <dt className="label text-[0.625rem] text-ink-muted">{metric.label}</dt>
              <dd className="font-display text-xl leading-none md:text-2xl">{metric.value}</dd>
            </div>
          ))}
        </dl>

        {tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start" aria-label="Strategy">
            {tags.slice(0, TAGS).map((tag) => (
              <li key={tag} className="label rounded-full border border-line px-3 py-1.5 text-[0.625rem] text-ink-soft">
                {tag}
              </li>
            ))}
            {tags.length > TAGS && (
              <li className="label rounded-full bg-blush px-3 py-1.5 text-[0.625rem] text-ink-soft">+{tags.length - TAGS} more</li>
            )}
          </ul>
        )}

        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6 md:justify-start">
          <MagneticButton href={href} cursor="view" trackAs="portfolio_case_study">
            View case study
          </MagneticButton>
          <button
            type="button"
            onClick={() => onQuickView(project)}
            aria-haspopup="dialog"
            className="label inline-flex min-h-11 items-center gap-2 text-ink transition-colors hover:text-terracotta"
          >
            <Plus aria-hidden strokeWidth={1.5} className="size-4" />
            Quick view
          </button>
        </div>
      </div>
    </article>
  )
}

/** /portfolio — the portfolio: results, the case studies, the brands, and more work (brief §3, §7). */
export default function WorkIndex() {
  const [industry, setIndustry] = useState('all')
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])

  useSeo({
    title: 'Portfolio',
    description:
      'Real campaigns, real growth, real numbers — BrandGap case studies in performance marketing and e-commerce growth.',
    path: '/portfolio',
    jsonLd: breadcrumbLd([{ name: 'Portfolio', path: '/portfolio' }]),
  })

  const counts = useMemo(() => {
    const c = { all: PUBLISHED_PROJECTS.length }
    INDUSTRIES.forEach((i) => (c[i] = PUBLISHED_PROJECTS.filter((p) => p.industries.includes(i)).length))
    return c
  }, [])

  const shown = industry === 'all' ? PUBLISHED_PROJECTS : PUBLISHED_PROJECTS.filter((p) => p.industries.includes(industry))

  return (
    <>
      <PageHero crumbs={[{ name: 'Portfolio', path: '/portfolio' }]} lead={WORK_INTRO.title} emphasis={WORK_INTRO.emphasis} intro={WORK_INTRO.intro} />

      <ResultsBar />

      {/* The case studies */}
      <section aria-labelledby="cases-title" className="container-page section-y">
        <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="text-center lg:text-left">
            <SectionLabel numeral={null} name="Case studies" className="whitespace-nowrap" />
            <h2 id="cases-title" className="sr-only">
              Case studies
            </h2>
          </div>
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <FilterChips label="Filter by industry" options={INDUSTRIES} value={industry} onChange={setIndustry} counts={counts} />
            <p className="label shrink-0 text-ink-muted" aria-live="polite">
              <span className="text-terracotta tabular-nums">{String(shown.length).padStart(2, '0')}</span>{' '}
              {shown.length === 1 ? 'case' : 'cases'}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={industry}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-8 flex flex-col md:mt-10"
          >
            {shown.map((project, i) => (
              <div key={project.slug} className="border-t border-line py-10 first:border-t-0 first:pt-0 md:py-14 md:first:pt-2">
                <CaseRow project={project} flip={i % 2 === 1} onQuickView={setOpen} />
              </div>
            ))}
            {!shown.length && (
              <p className="py-16 text-center font-display text-h3 italic text-ink-soft">No {industry} case studies published yet.</p>
            )}
          </m.div>
        </AnimatePresence>
      </section>

      {/* The brands behind the work */}
      <LogoStrip />

      {/* The rest of the work: brands we have worked with, without published numbers */}
      <section aria-label="More work" className="relative isolate section-y">
        <Ground tone="blush" />
        <MoreWork start={PUBLISHED_PROJECTS.length} className="" />
      </section>

      <AnimatePresence>{open && <CaseDrawer key={open.slug} project={open} onClose={close} />}</AnimatePresence>
      <FinalCta numeral={null} />
    </>
  )
}
