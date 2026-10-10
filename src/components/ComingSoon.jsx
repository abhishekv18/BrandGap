import { EditorialBlocks } from './EditorialBlocks'
import { MagneticButton } from './MagneticButton'
import { PageHero } from './PageHero'
import { breadcrumbLd, useSeo } from '../hooks/useSeo'
import { FinalCta } from '../sections/FinalCta'

/**
 * A tool page that is built but not launched yet, shown while its LAUNCHED switch
 * is false (see the page file). It follows every inner page: the page header with
 * a "Coming soon" status, what the tool will do, where to go until then (on blush),
 * and the closing CTA. Kept out of search results until it goes live.
 * Content: COMING_SOON in data/tools.js.
 */
export function ComingSoon({ page }) {
  const { name, path, lead, emphasis, intro, features, links } = page
  useSeo({
    title: `${name} — Coming soon`,
    description: intro,
    path,
    noindex: true,
    jsonLd: breadcrumbLd([{ name, path }]),
  })

  const blocks = [
    { type: 'pillars', label: features.label, headline: features.headline, emphasis: features.emphasis, items: features.items },
    {
      type: 'links',
      label: 'Until then',
      headline: 'Closing the gap',
      emphasis: 'doesn’t have to wait.',
      intro: `${name} is on its way. In the meantime, here’s where to start.`,
      items: links,
      ground: 'blush',
    },
  ]

  return (
    <>
      <PageHero crumbs={[{ name, path }]} lead={lead} emphasis={emphasis} intro={intro} deep>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8 md:justify-start">
          <p className="label inline-flex min-h-11 items-center gap-2.5 rounded-full border border-line px-4 text-[0.6875rem] text-ink">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-terracotta/60 motion-reduce:animate-none" />
              <span className="relative size-2 rounded-full bg-terracotta" />
            </span>
            Coming soon
          </p>
          <MagneticButton href="/contact" cursor="start" trackAs={`coming_soon_${path.slice(1)}_contact`}>
            Start a conversation
          </MagneticButton>
        </div>
      </PageHero>

      <EditorialBlocks blocks={blocks} />

      <FinalCta numeral={null} />
    </>
  )
}
