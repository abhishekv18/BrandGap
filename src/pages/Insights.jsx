import { AnimatePresence, m } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Copy } from '../components/Copy'
import { Ground } from '../components/Ground'
import { FilterChips } from '../components/FilterChips'
import { NewsletterForm } from '../components/NewsletterForm'
import { PageHero } from '../components/PageHero'
import { ProjectPlate } from '../components/ProjectPlate'
import { INSIGHT_CATEGORIES, INSIGHTS_INTRO, PUBLISHED_ARTICLES } from '../data/insights'
import { useHrefClick } from '../hooks/useHrefClick'
import { breadcrumbLd, useSeo } from '../hooks/useSeo'
import { FinalCta } from '../sections/FinalCta'

const EASE = [0.16, 1, 0.3, 1]

export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '[Publish date]'

/** /insights — ad teardowns, Meta Ads playbooks, creative breakdowns, and The Gap Weekly (brief §3, §7). */
export default function Insights() {
  const [category, setCategory] = useState('all')
  const hrefClick = useHrefClick()

  useSeo({
    title: 'Insights',
    description: 'Ad teardowns, Meta Ads playbooks and creative breakdowns from BrandGap — plus The Gap Weekly newsletter.',
    path: '/insights',
    jsonLd: breadcrumbLd([{ name: 'Insights', path: '/insights' }]),
  })

  const counts = useMemo(() => {
    const c = { all: PUBLISHED_ARTICLES.length }
    INSIGHT_CATEGORIES.forEach((cat) => (c[cat] = PUBLISHED_ARTICLES.filter((a) => a.category === cat).length))
    return c
  }, [])
  const shown = category === 'all' ? PUBLISHED_ARTICLES : PUBLISHED_ARTICLES.filter((a) => a.category === category)
  const [lead, ...rest] = shown

  return (
    <>
      <PageHero crumbs={[{ name: 'Insights', path: '/insights' }]} lead={INSIGHTS_INTRO.title} emphasis={INSIGHTS_INTRO.emphasis} intro={INSIGHTS_INTRO.intro} />

      <section aria-label="Articles" className="container-page pb-12 md:pb-16">
        <FilterChips label="Filter by topic" options={INSIGHT_CATEGORIES} value={category} onChange={setCategory} counts={counts} />

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={category}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-8 md:mt-10"
          >
            {lead ? (
              <>
                {/* The lead article, set as a spread */}
                <a
                  href={`/insights/${lead.slug}`}
                  onClick={(e) => hrefClick(e, `/insights/${lead.slug}`)}
                  data-cursor="view"
                  className="group grid items-end gap-8 text-center md:grid-cols-12 md:gap-6 md:text-left"
                >
                  <div className="md:col-span-7">
                    <ProjectPlate project={lead} ratio="16 / 10" letter="b" crop="right" label="[Article image]" cursor={undefined} />
                  </div>
                  <div className="md:col-span-5 md:pb-2">
                    <ArticleMeta article={lead} />
                    <h2 className="mt-4 font-display text-h3 tracking-[-0.02em] transition-colors group-hover:text-terracotta">
                      <Copy value={lead.title} />
                    </h2>
                    <p className="mt-4 text-lead text-ink-soft">
                      <Copy value={lead.excerpt} />
                    </p>
                    <ReadLink />
                  </div>
                </a>

                {rest.length > 0 && (
                  <ul className="mt-12 grid gap-10 border-t border-line pt-8 md:mt-16 md:grid-cols-2 md:gap-x-8">
                    {rest.map((a, i) => (
                      <li key={a.slug}>
                        <a
                          href={`/insights/${a.slug}`}
                          onClick={(e) => hrefClick(e, `/insights/${a.slug}`)}
                          data-cursor="view"
                          className="group grid gap-6 text-center sm:grid-cols-5 sm:text-left"
                        >
                          <div className="sm:col-span-2">
                            <ProjectPlate project={{ ...a, image: a.card ?? a.image }} ratio="4 / 5" letter={i % 2 ? 'b' : 'g'} crop="left" label="[Article image]" cursor={undefined} />
                          </div>
                          <div className="sm:col-span-3">
                            <ArticleMeta article={a} />
                            <h2 className="mt-3 font-display text-h3 transition-colors group-hover:text-terracotta">
                              <Copy value={a.title} />
                            </h2>
                            <p className="mt-3 text-lead text-ink-soft">
                              <Copy value={a.excerpt} />
                            </p>
                            <ReadLink />
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="py-16 text-center font-display text-h3 italic text-ink-soft">No {category.toLowerCase()} published yet.</p>
            )}
          </m.div>
        </AnimatePresence>
      </section>

      <section aria-label="Newsletter" className="relative isolate">
        <Ground tone="blush" />
        <div className="container-page section-y grid gap-8 md:grid-cols-12">
          <p className="text-center font-display text-h2 md:col-span-6 md:text-left">
            The gap, <span className="italic text-terracotta-deep">weekly.</span>
          </p>
          <NewsletterForm id="insights-newsletter" className="mx-auto w-full max-w-md md:col-span-5 md:col-start-8 md:mx-0" />
        </div>
      </section>

      <FinalCta numeral={null} />
    </>
  )
}

export function ArticleMeta({ article }) {
  return (
    <p className="label flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.6875rem] text-ink-muted md:justify-start">
      <span className="text-terracotta">{article.category}</span>
      <span aria-hidden>·</span>
      <span>{article.date ? <time dateTime={article.date}>{formatDate(article.date)}</time> : <Copy value={formatDate(null)} tone="inherit" />}</span>
      <span aria-hidden>·</span>
      <Copy value={article.readTime} tone="inherit" />
    </p>
  )
}

function ReadLink() {
  return (
    <span className="label mt-6 inline-flex min-h-11 items-center gap-2 text-ink transition-colors group-hover:text-terracotta">
      Read
      <ArrowRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
    </span>
  )
}
