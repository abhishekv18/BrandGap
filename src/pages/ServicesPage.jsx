import { ArrowRight } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../animations/gsap'
import { Copy } from '../components/Copy'
import { Ground } from '../components/Ground'
import { MagneticButton } from '../components/MagneticButton'
import { PageHero } from '../components/PageHero'
import { ProjectPlate } from '../components/ProjectPlate'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { servicePageFor } from '../data/servicePages'
import { ENGAGEMENT_MODELS, SERVICES, SERVICES_HEADING, SERVICES_INTRO } from '../data/services'
import { useCapabilities } from '../hooks/useCapabilities'
import { useHrefClick } from '../hooks/useHrefClick'
import { absoluteUrl, breadcrumbLd, useSeo } from '../hooks/useSeo'
import { Approach } from '../sections/Approach'
import { FinalCta } from '../sections/FinalCta'

const TONES = ['blush', 'terracotta', 'ink', 'blush', 'terracotta', 'ink']

/** /services — the six capability areas in detail (Content Brief §03), with engagement formats. */
export default function ServicesPage() {
  const { reducedMotion } = useCapabilities()
  const root = useRef(null)
  const [active, setActive] = useState(0)
  const hrefClick = useHrefClick()

  useSeo({
    title: 'Services',
    description:
      'Performance Marketing, Brand & Creative Strategy, Social Media & Content, E-commerce Growth, Website & Conversion and Growth & Analytics — one growth partner, multiple capabilities.',
    path: '/services',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'BrandGap services',
        itemListElement: SERVICES.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Service',
            name: s.name,
            description: s.description,
            provider: { '@type': 'Organization', name: 'BrandGap' },
            url: absoluteUrl(`/services#${s.id}`),
          },
        })),
      },
      breadcrumbLd([{ name: 'Services', path: '/services' }]),
    ],
  })

  useLayoutEffect(() => {
    const triggers = Array.from(root.current.querySelectorAll('[data-service]')).map((el, i) =>
      ScrollTrigger.create({ trigger: el, start: 'top 50%', end: 'bottom 50%', onToggle: (self) => self.isActive && setActive(i) }),
    )
    const ctx = reducedMotion
      ? null
      : gsap.context(() => {
          gsap.utils.toArray('[data-frame]').forEach((frame) => {
            gsap.fromTo(
              frame,
              { clipPath: 'inset(12% 8% 12% 8%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: frame, start: 'top 92%', end: 'top 40%', scrub: 0.6 } },
            )
          })
        }, root)
    return () => {
      triggers.forEach((t) => t.kill())
      ctx?.revert()
    }
  }, [reducedMotion])

  return (
    <div ref={root}>
      <PageHero crumbs={[{ name: 'Services', path: '/services' }]} lead={SERVICES_HEADING.lead} emphasis={SERVICES_HEADING.emphasis} intro={SERVICES_INTRO} />

      <section aria-label="Service areas" className="container-page pb-8 md:grid md:grid-cols-12 md:gap-6 md:pb-16">
        {/* Index — follows the reader on tablet and up */}
        <nav aria-label="Service areas" className="hidden md:sticky md:top-32 md:col-span-3 md:block md:self-start">
          <ol className="border-t border-line">
            {SERVICES.map((s, i) => (
              <li key={s.id} className="border-b border-line">
                <a
                  href={`#${s.id}`}
                  onClick={(e) => hrefClick(e, `#${s.id}`)}
                  aria-current={active === i ? 'true' : undefined}
                  className="group flex min-h-11 items-baseline gap-3 py-3 transition-colors hover:text-terracotta"
                >
                  <span className={`label tabular-nums ${active === i ? 'text-terracotta' : 'text-ink-muted'}`}>0{i + 1}</span>
                  <span className={`font-display text-lg transition-[color,font-style] ${active === i ? 'italic text-terracotta' : ''}`}>{s.name}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="md:col-span-9 md:col-start-4">
          {SERVICES.map((s, i) => (
            <article
              key={s.id}
              id={s.id}
              data-service
              aria-labelledby={`${s.id}-title`}
              className="grid scroll-mt-28 items-center gap-7 border-t border-line py-10 text-center md:grid-cols-9 md:gap-6 md:py-14 md:text-left"
            >
              <div className={`md:col-span-5 ${i % 2 ? 'md:order-2 md:col-start-5' : ''}`}>
                <p className="font-display text-numeral text-terracotta">0{i + 1}</p>
                <h2 id={`${s.id}-title`} className="mt-2 font-display text-h3 tracking-[-0.02em]">
                  <MaskReveal>{s.name}</MaskReveal>
                </h2>
                <Reveal as="p" delay={0.1} className="mx-auto mt-4 max-w-md text-lead text-ink-soft md:mx-0">
                  <Copy value={s.description} />
                </Reveal>
                <Reveal delay={0.15}>
                  <p className="label mt-6 text-ink-muted">Includes</p>
                  <ul className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                    {s.includes.map((item) => (
                      <li key={item} className="label rounded-full border border-line px-4 py-2 text-[0.6875rem]">
                        {item}
                      </li>
                    ))}
                  </ul>
                  {servicePageFor(s.id) && (
                    <a
                      href={`/services/${servicePageFor(s.id).slug}`}
                      onClick={(e) => hrefClick(e, `/services/${servicePageFor(s.id).slug}`)}
                      className="group label mt-6 inline-flex min-h-11 items-center gap-2 border-b border-ink/30 text-ink transition-colors hover:border-terracotta hover:text-terracotta"
                    >
                      Explore {s.name}
                      <ArrowRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                    </a>
                  )}
                </Reveal>
              </div>
              <figure data-frame className={`mx-auto w-full max-w-[17rem] md:col-span-4 md:max-w-none ${i % 2 ? 'md:order-1 md:col-start-1' : 'md:col-start-6'}`}>
                <div className="border border-line bg-cream p-2 shadow-[0_18px_36px_-22px_rgba(26,26,26,0.4)]">
                  <div className="relative overflow-hidden" style={{ filter: 'saturate(0.8) contrast(0.95) sepia(0.15)' }}>
                    <ProjectPlate
                      project={{ image: s.image ? { ...s.image, sizes: '(min-width: 768px) 56vw, 100vw' } : null, tone: TONES[i % TONES.length] }}
                      ratio="4 / 5"
                      letter={i % 2 ? 'g' : 'b'}
                      crop={i % 2 ? 'left' : 'right'}
                      label="[Service image]"
                      cursor={undefined}
                    />
                    <div aria-hidden className="pointer-events-none absolute inset-0 bg-blush/30 mix-blend-multiply" />
                  </div>
                </div>
              </figure>
            </article>
          ))}
        </div>
      </section>

      {/* Engagement models — format only, no prices (brief §7) */}
      <section aria-labelledby="models-title" className="relative isolate">
        <Ground tone="blush" />
        <div className="container-page section-y text-center md:text-left">
          <SectionLabel numeral={null} name="Engagement models" className="[&>span:first-child]:text-terracotta-deep" />
          <h2 id="models-title" className="mt-5 text-h2 md:mt-7">
            <MaskReveal>Three ways to work together.</MaskReveal>
          </h2>
          <ol className="mt-8 grid gap-px bg-ink/15 md:mt-10 md:grid-cols-3">
            {ENGAGEMENT_MODELS.map((model, i) => (
              <Reveal as="li" key={model.id} delay={i * 0.08} className="flex flex-col bg-blush py-6 md:px-7 md:py-7 md:first:pl-0">
                <span className="label text-terracotta-deep">0{i + 1}</span>
                <h3 className="mt-4 font-display text-h3">{model.name}</h3>
                <p className="mt-4 text-lead text-ink-soft">
                  <Copy value={model.note} />
                </p>
              </Reveal>
            ))}
          </ol>
          <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:gap-8 md:justify-start">
            <MagneticButton href="/contact" cursor="start" trackAs="services_start_project">
              Start a project
            </MagneticButton>
            <MagneticButton href="/faq" variant="text">
              Read the FAQ
            </MagneticButton>
          </div>
        </div>
      </section>

      <Approach numeral={null} />
      <FinalCta numeral={null} />
    </div>
  )
}
