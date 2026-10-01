import { Fragment, useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { ProjectPlate } from '../components/ProjectPlate'
import { Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import {
  ABOUT_BODY,
  ABOUT_IMAGES,
  ABOUT_ORIGIN,
  ABOUT_PERSONALITY,
  ABOUT_STATEMENT,
  ABOUT_SUMMARY,
} from '../data/about'
import { useCapabilities } from '../hooks/useCapabilities'

// Staggered heights give the strip an editorial rhythm rather than a grid.
const PLATE_LAYOUT = [
  'w-[68vw] md:w-[30vw] self-start',
  'w-[56vw] md:w-[22vw] self-end md:mb-16',
  'w-[78vw] md:w-[36vw] self-center',
  'w-[60vw] md:w-[24vw] self-start md:mt-20',
]

/**
 * Chapter V — Growth.
 * The positioning line lights up word by word as it is read; the studio
 * strip drifts sideways beneath it with each image settling in its frame.
 */
export function About() {
  const { reducedMotion } = useCapabilities()
  const root = useRef(null)

  useLayoutEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-about-word]',
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: '[data-about-statement]', start: 'top 80%', end: 'bottom 45%', scrub: 0.5 },
        },
      )
      gsap.fromTo(
        '[data-about-strip]',
        { xPercent: 4 },
        {
          xPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: '[data-about-strip]', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      gsap.utils.toArray('[data-about-strip] [data-inner]').forEach((inner) => {
        gsap.fromTo(
          inner,
          { yPercent: -6, scale: 1.1 },
          {
            yPercent: 6,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: inner.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [reducedMotion])

  const leadWords = ABOUT_STATEMENT.lead.trim().split(' ')
  const emphasisWords = ABOUT_STATEMENT.emphasis.trim().split(' ')

  return (
    <section id="about" ref={root} aria-labelledby="about-title" className="section-y text-center md:text-left">
      <div className="container-page">
        <SectionLabel numeral="V" name="Growth" />
        <h2
          id="about-title"
          data-about-statement
          className="mx-auto mt-8 max-w-[17ch] text-display md:mx-0 md:mt-10"
        >
          {leadWords.map((w, i) => (
            <Fragment key={`l${i}`}>
              <span data-about-word>{w}</span>{' '}
            </Fragment>
          ))}
          {emphasisWords.map((w, i) => (
            <Fragment key={`e${i}`}>
              <span data-about-word className="italic text-terracotta">
                {w}
              </span>
              {i < emphasisWords.length - 1 ? ' ' : ''}
            </Fragment>
          ))}
        </h2>
      </div>

      {/* Studio strip */}
      <div className="mt-12 md:mt-20">
        <div
          data-about-strip
          className={`flex gap-4 px-4 md:gap-8 md:px-12 ${
            reducedMotion ? 'flex-wrap justify-center' : 'w-max min-h-[70vw] items-stretch md:min-h-[46vw]'
          }`}
        >
          {ABOUT_IMAGES.map((img, i) => (
            <ProjectPlate
              key={img.id}
              project={img}
              tone={img.tone}
              ratio={img.ratio}
              letter={img.letter}
              crop={i % 2 ? 'left' : 'right'}
              label={img.label}
              cursor="explore"
              className={`shrink-0 ${reducedMotion ? 'w-[44vw] md:w-[22vw]' : PLATE_LAYOUT[i % PLATE_LAYOUT.length]}`}
            />
          ))}
        </div>
      </div>

      <div className="container-page mt-12 grid gap-8 md:mt-20 md:grid-cols-12 md:gap-6">
        <Reveal as="p" className="font-display text-h3 md:col-span-6">
          {ABOUT_BODY}
        </Reveal>
        <Reveal as="p" delay={0.1} className="text-lead text-ink-soft md:col-span-4 md:col-start-9 md:pt-3">
          {ABOUT_SUMMARY}
        </Reveal>
      </div>

      <div className="container-page mt-12 border-t border-line pt-8 md:mt-16">
        <Reveal className="flex flex-col items-center gap-6 md:flex-row md:items-baseline md:justify-between">
          <p className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-2 font-display text-h3 md:justify-start">
            {ABOUT_PERSONALITY.map((word, i) => (
              <Fragment key={word}>
                {i > 0 && <span aria-hidden className="size-1.5 -translate-y-[0.3em] rounded-full bg-terracotta" />}
                <span>{word}</span>
              </Fragment>
            ))}
          </p>
          <p className="label text-ink-muted">{ABOUT_ORIGIN}</p>
        </Reveal>
      </div>
    </section>
  )
}
