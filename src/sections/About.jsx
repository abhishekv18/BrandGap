import { Fragment, useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { Audience } from '../components/Audience'
import { MagneticButton } from '../components/MagneticButton'
import { Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { ABOUT_STATEMENT, ABOUT_STORY, VALUES } from '../data/about'
import { useCapabilities } from '../hooks/useCapabilities'
import { numeralOf } from '../data/navigation'

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
 * Chapter XII — About BrandGap & values (Content Brief §11–12): what we
 * believe, who we are, the values we work by and who we build for. The
 * brand speaks as "we" — no personal bios.
 */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="container-page section-y text-center md:text-left">
      <SectionLabel numeral={numeralOf('about')} name="About BrandGap" />
      <AboutStatement className="mt-5 md:mt-7" />

      <div className="space-heading-content grid gap-columns md:grid-cols-12">
        <Reveal className="md:col-span-6">
          <p className="text-lead text-ink-soft">{ABOUT_STORY.between}</p>
          <p className="mt-5 font-display text-h3 tracking-[-0.02em]">{ABOUT_STORY.exists}</p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-4 text-ink-soft md:col-span-5 md:col-start-8 md:pt-1">
          {ABOUT_STORY.body.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </Reveal>
      </div>

      <Reveal as="p" className="space-subblock border-t border-line pt-8 font-display text-quote tracking-[-0.02em] md:pt-10">
        {ABOUT_STORY.closing.lead} <span className="italic text-terracotta">{ABOUT_STORY.closing.emphasis}</span>
      </Reveal>

      <div className="space-subblock">
        <h3 className="label font-sans text-terracotta">Our values</h3>
        <ol className="mt-4 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-5">
          {VALUES.map((value, i) => (
            <Reveal as="li" key={value.id} delay={i * 0.06} className="border-t border-line py-6">
              <span className="label tabular-nums text-ink-muted">0{i + 1}</span>
              <p className="mt-3 font-display text-xl tracking-[-0.02em] md:text-2xl">{value.name}</p>
              <p className="mt-2 text-sm text-ink-soft">{value.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>

      <Audience className="space-subblock" />

      <div className="mt-8 flex justify-center md:justify-start">
        <MagneticButton href="/about" variant="text" trackAs="home_more_about">
          More about BrandGap
        </MagneticButton>
      </div>
    </section>
  )
}
