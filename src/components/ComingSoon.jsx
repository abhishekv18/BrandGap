import { MagneticButton } from './MagneticButton'
import { Breadcrumb } from './PageHero'
import { MaskReveal, Reveal } from './Reveal'
import { SectionLabel } from './SectionLabel'
import { useSeo } from '../hooks/useSeo'

/**
 * A page that is built but not launched yet. Shown in place of the full page
 * while its LAUNCHED switch is false (see the page file). Kept out of search
 * results until it goes live.
 */
export function ComingSoon({ name, path, line, note }) {
  useSeo({ title: `${name} — Coming soon`, description: line, path, noindex: true })

  return (
    <section aria-labelledby="soon-title" className="container-page flex min-h-[78svh] flex-col justify-center pt-28 pb-16 text-center md:pt-36 md:pb-24 md:text-left">
      <div className="flex justify-center md:justify-start">
        <Breadcrumb items={[{ name, path }]} />
      </div>

      <SectionLabel numeral={null} name="Coming soon" className="mt-10 md:mt-14" />
      <h1 id="soon-title" className="mt-5 text-h2 md:mt-7">
        <MaskReveal>{name}</MaskReveal>
        <MaskReveal delay={0.08} className="italic text-terracotta">
          is on its way.
        </MaskReveal>
      </h1>

      <Reveal as="p" delay={0.15} className="mx-auto mt-6 max-w-xl text-lead text-ink-soft md:mx-0 md:mt-8">
        {line}
      </Reveal>
      {note && (
        <Reveal as="p" delay={0.2} className="mx-auto mt-3 max-w-xl text-sm text-ink-muted md:mx-0">
          {note}
        </Reveal>
      )}

      <Reveal delay={0.25} className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8 md:justify-start">
        <MagneticButton href="/contact" cursor="start" trackAs={`coming_soon_${path.slice(1)}_contact`}>
          Start a conversation
        </MagneticButton>
        <MagneticButton href="/" variant="text">
          Back to home
        </MagneticButton>
      </Reveal>

      {/* The gap, waiting to close */}
      <div aria-hidden className="relative mt-14 h-2.5 md:mt-20">
        <span className="absolute top-1/2 right-1.5 left-1.5 h-px bg-line" />
        <span className="absolute top-0 left-0 size-2.5 rounded-full bg-terracotta" />
        <span className="absolute top-0 right-0 size-2.5 rounded-full bg-ink" />
      </div>
    </section>
  )
}
