import { Audience } from '../components/Audience'
import { Copy, isPlaceholder } from '../components/Copy'
import { EditorialBlocks } from '../components/EditorialBlocks'
import { Founder } from '../components/Founder'
import { Ground } from '../components/Ground'
import { Breadcrumb } from '../components/PageHero'
import { ProjectPlate } from '../components/ProjectPlate'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { StudioStrip } from '../components/StudioStrip'
import {
  ABOUT_IMAGES,
  ABOUT_ORIGIN,
  ABOUT_PERSONALITY,
  ABOUT_STORY,
  ABOUT_SUMMARY,
  AUDIENCE,
  FOUNDER,
  TEAM,
  VALUES,
} from '../data/about'
import { servicePageFor } from '../data/servicePages'
import { SERVICES, SERVICES_HEADING, SERVICES_INTRO } from '../data/services'
import { SITE } from '../data/site'
import { breadcrumbLd, useSeo } from '../hooks/useSeo'
import { AboutStatement } from '../sections/About'
import { FinalCta } from '../sections/FinalCta'

// Sections that wait for real material: they appear on their own once it is added in data/about.js.
const HAS_STUDIO = ABOUT_IMAGES.some((img) => img.image)
const HAS_FOUNDER = !isPlaceholder(FOUNDER.name)
const HAS_TEAM = TEAM.some((m) => !isPlaceholder(m.name))

/** The page's story, in the same editorial blocks as the case-study and service pages. */
const STORY = [
  {
    type: 'intro',
    label: 'Who we are',
    headline: ABOUT_STORY.exists.replace(/ to close that gap\.$/, ''),
    emphasis: 'to close that gap.',
    body: ABOUT_STORY.body,
    line: `${ABOUT_STORY.closing.lead} ${ABOUT_STORY.closing.emphasis}`,
  },
  {
    type: 'traits',
    label: 'Our voice',
    ground: 'blush',
    headline: 'Premium, but human.',
    emphasis: 'Partners, not vendors.',
    body: ['We have a point of view and the proof to back it.', ABOUT_SUMMARY],
    words: ABOUT_PERSONALITY,
    origin: ABOUT_ORIGIN,
  },
  {
    type: 'pillars',
    label: 'What we believe',
    headline: 'Five principles',
    emphasis: 'behind every engagement.',
    items: VALUES.map((v) => ({ title: v.name, body: v.text })),
  },
  {
    type: 'links',
    label: 'What we do',
    headline: SERVICES_HEADING.lead,
    emphasis: SERVICES_HEADING.emphasis,
    intro: SERVICES_INTRO,
    items: SERVICES.map((s) => {
      const page = servicePageFor(s.id)
      return { title: s.name, body: s.description, href: page ? `/services/${page.slug}` : `/services#${s.id}` }
    }),
  },
  {
    type: 'cases',
    label: 'The work',
    ground: 'ink',
    headline: 'Real campaigns.',
    emphasis: 'Real growth.',
    items: [
      { slug: 'the-decorshed', title: 'From product ads to a scalable acquisition engine', tags: 'Performance · Social' },
      { slug: 'vibha-designs', title: 'Turning mindful products into measurable ecommerce growth', tags: 'Performance · Social' },
      { slug: 'healer-priya-agrawal', title: 'Building a digital brand from zero', tags: 'Social · Brand' },
      { slug: 'ambaji-marble-house', title: 'Turning local visibility into customer conversations', tags: 'Lead generation' },
    ],
  },
]

/** /about — the story, the voice, what we believe, what we do, the work and who we work with. */
export default function AboutPage() {
  useSeo({
    title: 'About',
    description: `${SITE.positioning} Our story, what we believe, what we do and who we work with.`,
    path: '/about',
    jsonLd: breadcrumbLd([{ name: 'About', path: '/about' }]),
  })

  let n = STORY.length
  return (
    <>
      {/* The statement is the page's headline — lit word by word as it's read */}
      <header className="container-page pt-24 pb-8 text-center md:pt-36 md:pb-12 md:text-left">
        <Breadcrumb items={[{ name: 'About', path: '/about' }]} />
        <div className="mt-5 grid gap-6 md:mt-7 md:grid-cols-12">
          <AboutStatement as="h1" id="about-page-title" size="text-h2 max-w-[22ch]" className="md:col-span-8" />
          <Reveal as="p" delay={0.2} className="mx-auto max-w-md self-end text-lead text-ink-soft md:col-span-4 md:mx-0">
            {ABOUT_STORY.between}
          </Reveal>
        </div>
        <div aria-hidden className="relative mt-8 h-2.5 md:mt-10">
          <span className="absolute top-1/2 right-1.5 left-1.5 h-px bg-line" />
          <span className="absolute top-0 left-0 size-2.5 rounded-full bg-terracotta" />
          <span className="absolute top-0 right-0 size-2.5 rounded-full bg-ink" />
        </div>
      </header>

      {HAS_STUDIO && <StudioStrip />}

      <div className="pt-4 md:pt-6">
        <EditorialBlocks blocks={STORY} />
      </div>

      {/* Who we work with */}
      {/* Follows the work's ink ground, so space rather than a hairline marks the change */}
      <section aria-labelledby="audience-title" className="container-page pt-12 pb-12 text-center md:pt-16 md:pb-16 md:text-left">
        <div>
          <SectionLabel numeral={String(++n).padStart(2, '0')} name="Who we work with" />
          <h2 id="audience-title" className="mt-5 text-h2 md:mt-7">
            <MaskReveal>{AUDIENCE.title.lead}</MaskReveal>
            <MaskReveal delay={0.08} className="italic text-terracotta">
              {AUDIENCE.title.emphasis}
            </MaskReveal>
          </h2>
          <Audience showTitle={false} className="mt-8 md:mt-10" />
        </div>
      </section>

      {/* The founder — shown once their details are added in data/about.js */}
      {HAS_FOUNDER && (
        <section aria-labelledby="strategist-title" className="relative isolate">
          <Ground tone="blush" />
          <div className="container-page section-y">
            <SectionLabel numeral={String(++n).padStart(2, '0')} name="Founder · Fractional CMO" className="[&>span:first-child]:text-terracotta-deep" />
            <h2 id="strategist-title" className="sr-only">
              Meet the strategist
            </h2>
            <Founder className="mt-8 md:mt-10" />
          </div>
        </section>
      )}

      {/* The team — shown once names and photos are added in data/about.js */}
      {HAS_TEAM && (
        <section aria-labelledby="team-title" className="container-page section-y text-center md:text-left">
          <SectionLabel numeral={String(++n).padStart(2, '0')} name="Team" />
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
      )}

      <FinalCta numeral={null} />
    </>
  )
}
