import { ArrowRight } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { gsap } from '../animations/gsap'
import { Copy, isPlaceholder } from '../components/Copy'
import { PageHero } from '../components/PageHero'
import { ProjectPlate } from '../components/ProjectPlate'
import { Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { CASE_FLOW, findProject, PUBLISHED_PROJECTS } from '../data/projects'
import { useCapabilities } from '../hooks/useCapabilities'
import { useHrefClick } from '../hooks/useHrefClick'
import { absoluteUrl, breadcrumbLd, useSeo } from '../hooks/useSeo'
import { FinalCta } from '../sections/FinalCta'
import { track } from '../utils/analytics'
import NotFound from './NotFound'

/** /work/[slug] — one case study, independently shareable (brief §3). */
export default function CaseStudy() {
  const { slug } = useParams()
  const project = findProject(slug)
  return project ? <Case project={project} /> : <NotFound />
}

function Case({ project }) {
  const { reducedMotion } = useCapabilities()
  const root = useRef(null)
  const hrefClick = useHrefClick()
  const path = `/work/${project.slug}`
  const name = isPlaceholder(project.client) ? `Case study ${project.index}` : project.client

  useSeo({
    title: isPlaceholder(project.client) ? name : `${name} — Case study`,
    description: isPlaceholder(project.summary)
      ? `${name}: problem, strategy, creative, campaign and result — a BrandGap case study.`
      : project.summary,
    path,
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
        { name: 'Work', path: '/work' },
        { name, path },
      ]),
    ],
  })

  useEffect(() => {
    track('case_study_view', { case_study: project.slug })
  }, [project.slug])

  // The flow: a terracotta line fills down the rail as the chapters pass,
  // and each chapter's numeral lights as it is reached.
  useLayoutEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-flow-fill]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-flow]', start: 'top 60%', end: 'bottom 60%', scrub: 0.6 },
        },
      )
      gsap.utils.toArray('[data-chapter]').forEach((el) => {
        gsap.fromTo(
          el.querySelector('[data-chapter-num]'),
          { color: 'rgb(26 26 26 / 0.25)' },
          { color: '#A8483A', duration: 0.4, scrollTrigger: { trigger: el, start: 'top 60%', toggleActions: 'play none none reverse' } },
        )
      })
      gsap.utils.toArray('[data-frame]').forEach((frame) => {
        gsap.fromTo(
          frame,
          { clipPath: 'inset(10% 6% 10% 6%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: frame, start: 'top 92%', end: 'top 40%', scrub: 0.6 } },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [reducedMotion])

  const i = PUBLISHED_PROJECTS.indexOf(project)
  const next = PUBLISHED_PROJECTS[(i + 1) % PUBLISHED_PROJECTS.length]

  return (
    <div ref={root}>
      <PageHero
        crumbs={[
          { name: 'Work', path: '/work' },
          { name: `Case ${project.index}`, path },
        ]}
        lead={<Copy value={project.client} tone="inherit" />}
        emphasis={<Copy value={project.title} tone="inherit" />}
        intro={<Copy value={project.summary} />}
      >
        <div className="mt-8 flex flex-wrap justify-center gap-2 md:justify-start">
          <span className="label rounded-full border border-line px-3 py-1 text-[0.6875rem] text-ink-soft">
            <Copy value={project.category} tone="inherit" />
          </span>
          {project.industries.map((ind) => (
            <span key={ind} className="label rounded-full bg-blush px-3 py-1 text-[0.6875rem] text-ink-soft">
              {ind}
            </span>
          ))}
        </div>
      </PageHero>

      {/* Headline numbers */}
      <section aria-label="Headline results" className="container-page">
        <dl className="grid grid-cols-1 gap-px bg-line sm:grid-cols-3">
          {project.metrics.map((metric, k) => (
            <Reveal key={k} delay={k * 0.08} className="flex flex-col-reverse justify-end gap-2 bg-cream py-5 text-center sm:px-6 sm:py-6 md:text-left">
              <dt className="label text-ink-muted">
                <Copy value={metric.label} tone="inherit" />
              </dt>
              <dd className="font-display text-numeral">
                <Copy value={metric.value} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <div data-frame className="container-page mt-8 md:mt-12">
        <ProjectPlate project={project} ratio="16 / 9" letter="b" crop="right" />
      </div>

      {/* Problem → Strategy → Creative → Campaign → Result */}
      <section aria-labelledby="flow-title" className="container-page section-y">
        <SectionLabel numeral={null} name="The flow" />
        <h2 id="flow-title" className="mt-5 text-center text-h2 md:mt-7 md:text-left">
          Problem <span className="italic text-terracotta">to result.</span>
        </h2>
        <div data-flow className="relative mt-8 md:mt-10 md:grid md:grid-cols-12 md:gap-6">
          <span aria-hidden className="absolute top-0 bottom-0 left-[calc(8.333%-0.5px)] hidden w-px bg-line md:block">
            <span data-flow-fill className="absolute inset-0 origin-top bg-terracotta" />
          </span>
          <ol className="md:col-span-10 md:col-start-3">
            {CASE_FLOW.map((step, k) => (
              <li key={step.id} data-chapter className="border-t border-line py-8 text-center md:grid md:grid-cols-10 md:gap-6 md:py-10 md:text-left">
                <p className="label md:col-span-3">
                  <span data-chapter-num className="font-display text-h3 text-terracotta">
                    0{k + 1}
                  </span>
                  <span className="mt-2 block text-ink-muted">{step.label}</span>
                </p>
                <p className="mx-auto mt-4 max-w-xl font-display text-h3 md:col-span-7 md:mx-0 md:mt-0">
                  <Copy value={project.flow[step.id]} />
                </p>
                {k === 1 && project.gallery?.[0] !== undefined && (
                  <div data-frame className="mt-10 md:col-span-7 md:col-start-4">
                    <ProjectPlate project={{ ...project, image: project.gallery[0] }} tone="blush" ratio="4 / 3" letter="g" crop="left" />
                  </div>
                )}
                {k === 3 && project.gallery?.[1] !== undefined && (
                  <div data-frame className="mt-10 md:col-span-5 md:col-start-6">
                    <ProjectPlate project={{ ...project, image: project.gallery[1] }} tone="terracotta" ratio="4 / 5" letter="b" crop="left" />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Next case */}
      {next && next !== project && (
        <section aria-label="Next case study" className="container-page pb-12 md:pb-16">
          <a
            href={`/work/${next.slug}`}
            onClick={(e) => hrefClick(e, `/work/${next.slug}`)}
            data-cursor="view"
            className="group flex flex-col items-center gap-4 border-t border-line pt-8 text-center md:flex-row md:items-end md:justify-between md:text-left"
          >
            <span>
              <span className="label text-ink-muted">Next case — {next.index}</span>
              <span className="mt-3 block font-display text-h2 transition-colors group-hover:text-terracotta">
                <Copy value={next.client} />
              </span>
            </span>
            <ArrowRight aria-hidden strokeWidth={1.25} className="size-10 transition-transform duration-700 ease-(--ease-out-expo) group-hover:translate-x-2" />
          </a>
        </section>
      )}

      <FinalCta numeral={null} />
    </div>
  )
}
