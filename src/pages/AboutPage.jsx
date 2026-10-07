import { Fragment } from 'react'
import { Audience } from '../components/Audience'
import { Copy } from '../components/Copy'
import { Founder } from '../components/Founder'
import { Breadcrumb } from '../components/PageHero'
import { ProjectPlate } from '../components/ProjectPlate'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { StudioStrip } from '../components/StudioStrip'
import { ABOUT_BODY, ABOUT_COPY, ABOUT_ORIGIN, ABOUT_PERSONALITY, ABOUT_SUMMARY, TEAM } from '../data/about'
import { SITE } from '../data/site'
import { breadcrumbLd, useSeo } from '../hooks/useSeo'
import { AboutStatement } from '../sections/About'
import { FinalCta } from '../sections/FinalCta'

/** /about — who we are, the founder / fractional CMO point of view, who we work with (brief §3). */
export default function AboutPage() {
  useSeo({
    title: 'About',
    description: `${SITE.positioning} Meet the strategist, and see who we work with.`,
    path: '/about',
    jsonLd: breadcrumbLd([{ name: 'About', path: '/about' }]),
  })

  return (
    <>
      {/* The statement is the page's headline — lit word by word as it's read */}
      <header className="container-page pt-24 pb-8 text-center md:pt-36 md:pb-12 md:text-left">
        <Breadcrumb items={[{ name: 'About', path: '/about' }]} />
        <AboutStatement as="h1" id="about-page-title" size="text-h2 max-w-[22ch]" className="mt-5 md:mt-7" />
      </header>

      <StudioStrip />

      <section aria-labelledby="who-title" className="container-page section-y text-center md:text-left">
        <SectionLabel numeral="01" name="Who we are" />
        <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-12 md:gap-6">
          <h2 id="who-title" className="font-display text-h2 tracking-[-0.02em] md:col-span-6">
            <Reveal as="span" className="block">
              {ABOUT_BODY}
            </Reveal>
          </h2>
          <div className="md:col-span-5 md:col-start-8 md:pt-2">
            <Reveal as="p" delay={0.1} className="text-lead text-ink-soft">
              {ABOUT_SUMMARY}
            </Reveal>
            <Reveal as="p" delay={0.15} className="mt-6 text-lead">
              <Copy value={ABOUT_COPY} />
            </Reveal>
          </div>
        </div>
        <Reveal className="mt-10 flex flex-col items-center gap-5 border-t border-line pt-6 md:mt-12 md:flex-row md:items-baseline md:justify-between">
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
      </section>

      <section aria-labelledby="strategist-title" className="bg-blush">
        <div className="container-page section-y">
          <SectionLabel numeral="02" name="Founder · Fractional CMO" className="[&>span:first-child]:text-terracotta-deep" />
          <h2 id="strategist-title" className="sr-only">
            Meet the strategist
          </h2>
          <Founder className="mt-8 md:mt-10" />
        </div>
      </section>

      <section aria-labelledby="team-title" className="container-page section-y text-center md:text-left">
        <SectionLabel numeral="03" name="Team" />
        <h2 id="team-title" className="mt-5 text-h2 md:mt-7">
          <MaskReveal>The people closing the gap.</MaskReveal>
        </h2>
        <ul className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-6 md:mt-10">
          {TEAM.map((member, i) => (
            <Reveal as="li" key={member.id} delay={i * 0.08} className={i === 1 ? 'sm:mt-10' : ''}>
              <ProjectPlate
                project={{ image: member.photo, tone: member.tone }}
                ratio="4 / 5"
                letter={member.letter}
                crop={i % 2 ? 'left' : 'right'}
                label="[Team Photo]"
                cursor={undefined}
              />
              <p className="mt-4 font-display text-h3 tracking-[-0.02em]">
                <Copy value={member.name} />
              </p>
              <p className="label mt-1 text-ink-muted">
                <Copy value={member.role} tone="inherit" />
              </p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section aria-labelledby="audience-title" className="container-page pb-16 text-center md:pb-28 md:text-left">
        <SectionLabel numeral="04" name="Who we work with" />
        <h2 id="audience-title" className="mt-5 text-h2 md:mt-7">
          <MaskReveal>Partners, not vendors.</MaskReveal>
        </h2>
        <Audience className="mt-8 md:mt-10" />
      </section>

      <FinalCta numeral={null} />
    </>
  )
}
