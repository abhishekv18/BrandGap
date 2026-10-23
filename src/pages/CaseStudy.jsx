import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { gsap } from '../animations/gsap'
import { BrowserFrame } from '../components/BrowserFrame'
import { EditorialBlocks } from '../components/EditorialBlocks'
import { CASE_REVIEWS } from '../data/testimonials'
import { Copy, isPlaceholder } from '../components/Copy'
import { MetricsPanel, toKpi } from '../components/MetricsPanel'
import { PageHero } from '../components/PageHero'
import { Ground } from '../components/Ground'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { findProject, PUBLISHED_PROJECTS, siteAddress } from '../data/projects'
import { useCapabilities } from '../hooks/useCapabilities'
import { useHrefClick } from '../hooks/useHrefClick'
import { absoluteUrl, breadcrumbLd, useSeo } from '../hooks/useSeo'
import { FinalCta } from '../sections/FinalCta'
import { track } from '../utils/analytics'
import NotFound from './NotFound'

/** /portfolio/[slug] — one case study, independently shareable (brief §3). */
export default function CaseStudy() {
  const { slug } = useParams()
  const project = findProject(slug)
  return project ? <Case key={project.slug} project={project} /> : <NotFound />
}

/** "Visit website" — a real link once the URL is set, a marked placeholder until then. */
// eslint-disable-next-line no-unused-vars -- kept for later: no longer shown in the case header
function VisitWebsite({ project }) {
  if (project.website === null) return null
  const live = project.website && !isPlaceholder(project.website)
  const classes =
    'label inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-[0.6875rem] transition-colors duration-300'
  if (!live) {
    return (
      <span
        className={`${classes} cursor-not-allowed border-dashed border-ink/30 text-ink-muted`}
        title="Placeholder — add the website URL in src/data/projects.js"
      >
        Visit website <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-3.5" />
      </span>
    )
  }
  return (
    <a
      href={project.website}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('case_visit_website', { case_study: project.slug })}
      className={`${classes} group border-ink bg-ink text-cream hover:border-terracotta hover:bg-terracotta`}
    >
      Visit website
      <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

function Case({ project }) {
  const { reducedMotion } = useCapabilities()
  const root = useRef(null)
  const hrefClick = useHrefClick()
  const path = `/portfolio/${project.slug}`
  const name = isPlaceholder(project.client) ? `Case study ${project.index}` : project.client
  const address = siteAddress(project)
  const gallery = (project.gallery ?? []).filter(Boolean)

  useSeo({
    title: project.seo?.title ?? (isPlaceholder(project.client) ? name : `${name} — Case study`),
    description: project.seo?.description ?? project.summary,
    path,
    image: project.image?.src,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name,
        about: project.category,
        url: absoluteUrl(path),
        creator: { '@type': 'Organization', name: 'BrandGap' },
      },
      breadcrumbLd([
        { name: 'Portfolio', path: '/portfolio' },
        { name, path },
      ]),
    ],
  })

  useEffect(() => {
    track('case_study_view', { case_study: project.slug })
  }, [project.slug])

  // Frames open from a mask as they scroll in; the flow's numerals light as each step is reached.
  useLayoutEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-frame]').forEach((frame) => {
        gsap.fromTo(
          frame,
          { clipPath: 'inset(8% 5% 8% 5% round 0.625rem)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0.625rem)',
            ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top 95%', end: 'top 45%', scrub: 0.6 },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [reducedMotion])

  const review = CASE_REVIEWS[project.slug]
  // The review sits after the fifth numbered chapter of the story.
  const story = project.story ?? []
  let seen = 0
  const at = story.findIndex((b) => b.label && ++seen === 5)
  const cut = at === -1 ? story.length : at + 1
  const i = PUBLISHED_PROJECTS.indexOf(project)
  const next = PUBLISHED_PROJECTS[(i + 1) % PUBLISHED_PROJECTS.length]

  return (
    <div ref={root}>
      {/* 1 — The brief */}
      <PageHero
        crumbs={[
          { name: 'Portfolio', path: '/portfolio' },
          { name: `Case ${project.index}`, path },
        ]}
        lead={<Copy value={project.client} tone="inherit" />}
        line={project.statement}
        rule={false}
        className="pb-6! md:pb-8!"
      >
        {/* The tags, set to the right under the statement */}
        <div className="mt-6 flex flex-col items-center gap-5 md:flex-row md:items-center md:justify-end">
          <div className="flex flex-wrap justify-center gap-2 md:justify-end">
            <span className="label rounded-full border border-line px-3 py-1 text-[0.6875rem] text-ink-soft">
              <Copy value={project.category} tone="inherit" />
            </span>
            {project.industries.map((ind) => (
              <span key={ind} className="label rounded-full bg-blush px-3 py-1 text-[0.6875rem] text-ink-soft">
                {ind}
              </span>
            ))}
          </div>
        </div>
      </PageHero>

      {/* 2 — The main visual: the real website. Cases without approved imagery go straight to the figures. */}
      {project.image && (
        <div className="container-page">
          {/* The banner opens the client's live website */}
          {project.website && !isPlaceholder(project.website) ? (
            <a
              href={project.website}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              aria-label={`Visit ${project.client}'s website (opens in a new tab)`}
              className="group block transition-transform duration-700 ease-(--ease-out-expo) hover:-translate-y-1"
            >
              <BrowserFrame image={project.image} address={address} sizes="(min-width: 1440px) 1344px, 100vw" priority />
            </a>
          ) : (
            <BrowserFrame image={project.image} address={address} sizes="(min-width: 1440px) 1344px, 100vw" priority />
          )}
        </div>
      )}

      {/* 3 — The numbers: headline figures and, where the data allows, spend against the result */}
      <section aria-labelledby="case-numbers-title" className={`container-page pb-12 text-center md:pb-16 md:text-left ${project.image ? 'pt-12 md:pt-16' : 'pt-2'}`}>
        <div className="grid gap-heading-row lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <SectionLabel numeral={null} name="The numbers" />
            <h2 id="case-numbers-title" className="mt-5 text-h2 md:mt-7">
              <MaskReveal>Results,</MaskReveal>
              <MaskReveal delay={0.08} className="italic text-terracotta">
                measured.
              </MaskReveal>
            </h2>
          </div>
          {project.flow?.result && (
            <Reveal as="p" delay={0.1} className="mx-auto max-w-md self-end text-ink-soft md:mx-0 lg:col-span-5">
              {project.flow.result}
            </Reveal>
          )}
        </div>
        <MetricsPanel
          className="space-heading-content mx-auto max-w-5xl"
          title={`${project.client} / ${project.graph ? 'Meta Ads data' : 'Brand proof points'}`}
          kpis={(project.panelMetrics ?? project.metrics).map(toKpi)}
          graph={project.graph}
          roasDigits={2}
          compact
          caption={project.panelCaption}
          summary={project.flow?.result}
        />
      </section>

      {/* 4 — The story, from the case-study handoff */}
      {/* The story, with the client's word after its fifth chapter */}
      <EditorialBlocks blocks={story.slice(0, cut)} />
      {review && <CaseReview review={review} />}
      <EditorialBlocks blocks={story.slice(cut)} start={5} />

      {/* 5 — The website, when real screenshots exist: the page's ink showcase, a gallery wall */}
      {gallery.length > 0 && (
        <section aria-label="The website" data-ground="ink" className="relative isolate section-y">
          <Ground tone="ink" />
          <div className="container-page">
            <SectionLabel numeral={null} name="The website" />
            <div className={`mt-6 grid gap-6 md:mt-8 md:gap-8 ${gallery.length > 1 ? 'md:grid-cols-2' : ''}`}>
              {gallery.map((image, k) => (
                <BrowserFrame key={image.src ?? k} image={image} address={address} sizes="(min-width: 768px) 50vw, 100vw" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7 — Next case */}
      {next && next !== project && (
        <section aria-label="Next case study" className={`container-page pb-12 md:pb-16 ${gallery.length > 0 ? 'pt-12 md:pt-16' : ''}`}>
          <a
            href={`/portfolio/${next.slug}`}
            onClick={(e) => hrefClick(e, `/portfolio/${next.slug}`)}
            data-cursor="view"
            className="group flex flex-col items-center gap-4 border-y border-line py-8 text-center md:flex-row md:items-center md:justify-between md:text-left"
          >
            <span>
              <span className="label text-ink-muted">Next case — {next.index}</span>
              <span className="mt-3 block font-display text-h2 tracking-[-0.02em] transition-colors group-hover:text-terracotta">
                <Copy value={next.client} />
              </span>
            </span>
            <ArrowRight aria-hidden strokeWidth={1.25} className="size-10 transition-transform duration-700 ease-(--ease-out-expo) group-hover:translate-x-2" />
          </a>
        </section>
      )}

      <FinalCta numeral={null} headline={project.closing?.headline} body={project.closing?.body} />
    </div>
  )
}

/** The client's word: a small quote card on a white ground, between the story's chapters. */
function CaseReview({ review }) {
  return (
    <section aria-label="Client review" className="container-page pb-12 md:pb-16">
      <Reveal as="figure" className="relative mx-auto max-w-3xl rounded-[0.625rem] border border-line bg-white px-6 py-7 text-center shadow-[0_30px_60px_-45px_rgba(28,18,22,0.35)] md:px-12 md:py-10">
        <span aria-hidden className="block font-display text-[3.5rem] leading-[0.6] text-terracotta">
          &ldquo;
        </span>
        <blockquote className="mx-auto mt-4 max-w-[46ch] font-display text-h3 leading-[1.3] tracking-[-0.015em] text-ink">
          {review.quote}
        </blockquote>
        <figcaption className="mt-6 flex flex-col items-center gap-1">
          <span aria-hidden className="mb-3 h-px w-10 bg-terracotta" />
          <span className="font-display text-lg">{review.name}</span>
          <span className="label text-[0.625rem] text-ink-muted">
            {review.role} · {review.company}
          </span>
          {review.demo && (
            <span className="label mt-3 flex items-center gap-2 text-[0.5625rem] text-ink-muted/80">
              <span aria-hidden className="size-1 rounded-full bg-terracotta" />
              Draft — awaiting client approval
            </span>
          )}
        </figcaption>
      </Reveal>
    </section>
  )
}
