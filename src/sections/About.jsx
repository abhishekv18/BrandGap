import { Fragment, useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { Audience } from '../components/Audience'
import { Founder } from '../components/Founder'
import { MagneticButton } from '../components/MagneticButton'
import { Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { ABOUT_BODY, ABOUT_STATEMENT, ABOUT_SUMMARY } from '../data/about'
import { useCapabilities } from '../hooks/useCapabilities'

/**
 * The positioning line, lit word by word as it is read (brief §8.2 —
 * text reveal on scroll). Shared by the homepage and /about.
 */
export function AboutStatement({ as: Tag = 'h2', id = 'about-title', size = 'text-h2 max-w-[22ch]', className = '' }) {
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
          scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'bottom 45%', scrub: 0.5 },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [reducedMotion])

  const leadWords = ABOUT_STATEMENT.lead.trim().split(' ')
  const emphasisWords = ABOUT_STATEMENT.emphasis.trim().split(' ')

  return (
    <Tag ref={root} id={id} className={`mx-auto ${size} md:mx-0 ${className}`}>
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
    </Tag>
  )
}

/**
 * Chapter VIII — About BrandGap (brief §4, section 08): who we are, the
 * founder / fractional CMO point of view, and who we work with.
 */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="container-page section-y text-center md:text-left">
      <SectionLabel numeral="VIII" name="About BrandGap" />
      <AboutStatement className="mt-5 md:mt-7" />

      <div className="space-heading-content grid gap-6 md:grid-cols-12">
        <Reveal as="p" className="font-display text-h3 md:col-span-6">
          {ABOUT_BODY}
        </Reveal>
        <Reveal as="p" delay={0.1} className="text-lead text-ink-soft md:col-span-4 md:col-start-9 md:pt-3">
          {ABOUT_SUMMARY}
        </Reveal>
      </div>

      <Founder gap="gap-columns" className="space-subblock" />
      <Audience className="space-subblock" />

      <div className="mt-8 flex justify-center md:justify-start">
        <MagneticButton href="/about" variant="text" trackAs="home_more_about">
          More about BrandGap
        </MagneticButton>
      </div>
    </section>
  )
}
