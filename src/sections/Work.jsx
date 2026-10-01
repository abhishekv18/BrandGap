import { ArrowRight } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { Copy } from '../components/Copy'
import { MagneticButton } from '../components/MagneticButton'
import { ProjectPlate } from '../components/ProjectPlate'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { PROJECTS, WORK_INTRO } from '../data/projects'
import { useCapabilities } from '../hooks/useCapabilities'

/**
 * Chapter IV — Proof.
 * Each project is its own spread: a full-bleed reveal, an asymmetric split,
 * and a horizontal strip. Content lives in data/projects.js.
 */
export function Work() {
  const { reducedMotion, tier } = useCapabilities()
  const root = useRef(null)
  const horizontal = tier === 'desktop' && !reducedMotion

  useLayoutEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      // Frames open from a mask while the image inside settles.
      gsap.utils.toArray('[data-frame]').forEach((frame) => {
        const inner = frame.querySelector('[data-inner]')
        gsap.fromTo(
          frame,
          { clipPath: 'inset(12% 8% 12% 8%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top 92%', end: 'top 35%', scrub: 0.6 },
          },
        )
        if (inner) {
          gsap.fromTo(
            inner,
            { yPercent: -5, scale: 1.12 },
            {
              yPercent: 5,
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        }
      })

      // Titles drift into place — typography that moves with the reader.
      gsap.utils.toArray('[data-drift]').forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: Number(el.dataset.drift) },
          { xPercent: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 45%', scrub: 0.6 } },
        )
      })

      // The strip: vertical scroll becomes horizontal travel.
      if (horizontal) {
        const strip = root.current.querySelector('[data-strip]')
        const track = strip?.querySelector('[data-track]')
        if (strip && track) {
          const distance = () => track.scrollWidth - window.innerWidth
          gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: strip,
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
        }
      }
    }, root)
    return () => ctx.revert()
  }, [reducedMotion, horizontal])

  return (
    <section id="work" ref={root} aria-labelledby="work-title" className="section-y">
      <header className="container-page grid gap-6 text-center md:grid-cols-12 md:gap-8 md:text-left">
        <div className="md:col-span-8">
          <SectionLabel numeral="IV" name="Proof" />
          <h2 id="work-title" className="mt-8 text-h2 md:mt-10">
            <MaskReveal>{WORK_INTRO.title}</MaskReveal>
          </h2>
        </div>
        <Reveal as="p" delay={0.1} className="self-end font-display text-h3 italic text-ink-soft md:col-span-4">
          {WORK_INTRO.line}
        </Reveal>
      </header>

      {PROJECTS.map((project) => {
        if (project.layout === 'full') return <FullSpread key={project.id} project={project} />
        if (project.layout === 'split') return <SplitSpread key={project.id} project={project} />
        return <StripSpread key={project.id} project={project} horizontal={horizontal} />
      })}
    </section>
  )
}

/* ---------- Shared pieces ---------- */

function Numeral({ value, className = '' }) {
  return (
    <span aria-hidden className={`font-display leading-none text-terracotta ${className}`}>
      {value}
    </span>
  )
}

function Meta({ project, className = '' }) {
  return (
    <dl className={`grid grid-cols-2 gap-x-6 gap-y-5 text-center text-sm md:text-left ${className}`}>
      <div>
        <dt className="label mb-1 text-[0.6875rem] text-ink-muted">Client</dt>
        <dd>
          <Copy value={project.client} />
        </dd>
      </div>
      <div>
        <dt className="label mb-1 text-[0.6875rem] text-ink-muted">Category</dt>
        <dd>
          <Copy value={project.category} />
        </dd>
      </div>
      <div>
        <dt className="label mb-1 text-[0.6875rem] text-ink-muted">Disciplines</dt>
        <dd className="flex flex-col items-center md:items-start">
          {project.disciplines.map((d, i) => (
            <Copy key={i} value={d} />
          ))}
        </dd>
      </div>
      <div>
        <dt className="label mb-1 text-[0.6875rem] text-ink-muted">Result</dt>
        <dd className="font-display text-xl">
          <Copy value={project.result} />
        </dd>
      </div>
    </dl>
  )
}

function CaseLink({ project }) {
  if (project.href) {
    return (
      <MagneticButton href={project.href} variant="text" cursor="view">
        View case study
      </MagneticButton>
    )
  }
  return (
    <span
      className="label inline-flex min-h-11 items-center gap-3 whitespace-nowrap text-ink-muted"
      title="Placeholder — case study link to be added"
    >
      <span className="underline decoration-dotted underline-offset-4">View case study</span>
      <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
    </span>
  )
}

function Title({ project, drift = 6, className = '' }) {
  return (
    <h3 className={className}>
      <span className="label mb-4 block text-ink-muted">
        <Copy value={project.client} />
      </span>
      <span data-drift={drift} className="block font-display text-h2">
        <Copy value={project.title} />
      </span>
    </h3>
  )
}

/* ---------- 01 · Full-bleed spread ---------- */

function FullSpread({ project }) {
  return (
    <article aria-label={`Project ${project.index}`} className="container-page mt-14 text-center md:mt-24 md:text-left">
      <div className="mb-8 grid items-end gap-6 md:mb-10 md:grid-cols-12">
        <Numeral value={project.index} className="text-numeral md:col-span-3" />
        <Title project={project} drift={8} className="md:col-span-9" />
      </div>
      <div data-frame className="will-change-[clip-path]">
        <ProjectPlate project={project} ratio="16 / 9" letter="b" crop="right" />
      </div>
      <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-12">
        <p className="mx-auto max-w-md text-lead text-ink-soft md:col-span-4 md:mx-0">
          <Copy value={project.summary} />
        </p>
        <Meta project={project} className="mx-auto w-full max-w-md md:col-span-5 md:col-start-6 md:mx-0 md:max-w-none" />
        <div className="md:col-span-2 md:col-start-11 md:justify-self-end">
          <CaseLink project={project} />
        </div>
      </div>
    </article>
  )
}

/* ---------- 02 · Asymmetric split ---------- */

function SplitSpread({ project }) {
  return (
    <article aria-label={`Project ${project.index}`} className="container-page mt-20 grid gap-10 text-center md:mt-36 md:grid-cols-12 md:gap-6 md:text-left">
      <div className="order-1 md:sticky md:top-[18vh] md:col-span-5 md:self-start">
        <Numeral value={project.index} className="text-numeral" />
        <Title project={project} drift={-6} className="mt-6" />
        <p className="mx-auto mt-8 max-w-sm text-lead text-ink-soft md:mx-0">
          <Copy value={project.summary} />
        </p>
        <Meta project={project} className="mx-auto mt-10 max-w-md md:mx-0" />
        <div className="mt-8">
          <CaseLink project={project} />
        </div>
      </div>
      <div className="order-2 md:col-span-6 md:col-start-7">
        <div data-frame>
          <ProjectPlate project={project} ratio="4 / 5" letter="g" crop="left" />
        </div>
        <div className="mt-6 grid grid-cols-5 gap-6 md:mt-10">
          <div data-frame className="col-span-3 col-start-2 md:col-start-3">
            <ProjectPlate project={project} tone="terracotta" ratio="1 / 1" letter="b" crop="left" />
          </div>
        </div>
      </div>
    </article>
  )
}

/* ---------- 03 · Horizontal strip ---------- */

function StripSpread({ project, horizontal }) {
  const intro = (
    <div className="flex w-full shrink-0 flex-col justify-center text-center md:w-[34vw] md:pr-12 md:text-left">
      <Numeral value={project.index} className="text-numeral" />
      <Title project={project} drift={0} className="mt-6" />
      <p className="mx-auto mt-8 max-w-sm text-lead text-ink-soft md:mx-0">
        <Copy value={project.summary} />
      </p>
      <Meta project={project} className="mx-auto mt-10 max-w-md md:mx-0" />
      <div className="mt-8">
        <CaseLink project={project} />
      </div>
    </div>
  )

  if (!horizontal) {
    return (
      <article aria-label={`Project ${project.index}`} className="container-page mt-20 flex flex-col gap-10 md:mt-36">
        {intro}
        <div data-frame>
          <ProjectPlate project={project} ratio="4 / 5" letter="g" crop="right" />
        </div>
        <div data-frame className="w-3/4 self-center md:self-end">
          <ProjectPlate project={project} tone="blush" ratio="16 / 10" letter="b" crop="left" />
        </div>
        <div data-frame className="w-2/3 self-center md:self-start">
          <ProjectPlate project={project} tone="terracotta" ratio="3 / 4" letter="g" crop="left" />
        </div>
      </article>
    )
  }

  return (
    <article data-strip aria-label={`Project ${project.index}`} className="mt-24 h-svh overflow-hidden">
      <div data-track className="flex h-full w-max items-center gap-[4vw] pr-[8vw] pl-[max(3rem,calc((100vw_-_1600px)/2_+_3rem))]">
        {intro}
        <ProjectPlate project={project} ratio="4 / 5" letter="g" crop="right" className="h-[68svh] shrink-0" />
        <ProjectPlate project={project} tone="blush" ratio="16 / 10" letter="b" crop="left" className="h-[46svh] shrink-0 self-end mb-[10svh]" />
        <ProjectPlate project={project} tone="terracotta" ratio="3 / 4" letter="g" crop="left" className="h-[58svh] shrink-0 self-start mt-[12svh]" />
      </div>
    </article>
  )
}
