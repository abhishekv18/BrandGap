import { AnimatePresence, m } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import { CaseCard } from '../components/CaseCard'
import { CaseDrawer } from '../components/CaseDrawer'
import { FilterChips } from '../components/FilterChips'
import { PageHero } from '../components/PageHero'
import { INDUSTRIES, PUBLISHED_PROJECTS, WORK_INTRO } from '../data/projects'
import { breadcrumbLd, useSeo } from '../hooks/useSeo'
import { FinalCta } from '../sections/FinalCta'

const EASE = [0.16, 1, 0.3, 1]
const PLATES = [
  { letter: 'b', crop: 'right', ratio: '4 / 3' },
  { letter: 'g', crop: 'left', ratio: '4 / 5' },
  { letter: 'g', crop: 'right', ratio: '4 / 5' },
  { letter: 'b', crop: 'left', ratio: '4 / 3' },
]

/** /work — the case study index, filtered by industry (brief §3, §7). */
export default function WorkIndex() {
  const [industry, setIndustry] = useState('all')
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])

  useSeo({
    title: 'Work',
    description:
      'Case studies from BrandGap — brand strategy, performance marketing and creative, measured from problem to result.',
    path: '/work',
    jsonLd: breadcrumbLd([{ name: 'Work', path: '/work' }]),
  })

  const counts = useMemo(() => {
    const c = { all: PUBLISHED_PROJECTS.length }
    INDUSTRIES.forEach((i) => (c[i] = PUBLISHED_PROJECTS.filter((p) => p.industries.includes(i)).length))
    return c
  }, [])

  const shown = industry === 'all' ? PUBLISHED_PROJECTS : PUBLISHED_PROJECTS.filter((p) => p.industries.includes(industry))

  return (
    <>
      <PageHero crumbs={[{ name: 'Work', path: '/work' }]} lead={WORK_INTRO.title.replace('.', '')} emphasis={WORK_INTRO.line} />

      <section aria-label="Case studies" className="container-page pb-12 md:pb-16">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
          <FilterChips label="Filter by industry" options={INDUSTRIES} value={industry} onChange={setIndustry} counts={counts} />
          <p className="label text-ink-muted" aria-live="polite">
            <span className="text-terracotta tabular-nums">{String(shown.length).padStart(2, '0')}</span>{' '}
            {shown.length === 1 ? 'case' : 'cases'}
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={industry}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-8 grid gap-12 md:mt-10 md:grid-cols-2 md:gap-x-8 md:gap-y-14"
          >
            {shown.map((project, i) => (
              <CaseCard
                key={project.slug}
                project={project}
                onExpand={setOpen}
                heading="h2"
                className={i % 2 ? 'md:mt-16' : ''}
                {...PLATES[i % PLATES.length]}
              />
            ))}
            {!shown.length && (
              <p className="py-16 text-center font-display text-h3 italic text-ink-soft md:col-span-2">
                No {industry} case studies published yet.
              </p>
            )}
          </m.div>
        </AnimatePresence>
      </section>

      <AnimatePresence>{open && <CaseDrawer key={open.slug} project={open} onClose={close} />}</AnimatePresence>
      <FinalCta numeral={null} />
    </>
  )
}
