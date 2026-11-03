import { ArrowUpRight } from 'lucide-react'
import { BuildLayers } from '../components/illustrations/BuildLayers'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { numeralOf } from '../data/navigation'
import { DEV_PARTNER } from '../data/partners'
import { useReducedMotion } from '../hooks/useMediaQuery'

/**
 * Our development partner: KY Creatives on an ink panel (its logo is drawn for dark
 * grounds), beside a drawing of what the studio does: one website pulled apart into
 * design, build and launch.
 */
export function DevelopmentPartner({ numeral = numeralOf('development-partner') }) {
  const { name, logo, href, tagline, body, services } = DEV_PARTNER
  const reduced = useReducedMotion()
  return (
    <section id="development-partner" aria-labelledby="development-partner-title" className="container-page section-y text-center md:text-left">
      <SectionLabel numeral={numeral} name="Our development partner" />
      <h2 id="development-partner-title" className="mt-5 text-h2 md:mt-7">
        <MaskReveal>The websites behind</MaskReveal>
        <MaskReveal delay={0.08} className="italic text-terracotta">
          the growth.
        </MaskReveal>
      </h2>

      <Reveal data-ground="ink" className="space-heading-content grid overflow-hidden rounded-[1rem] bg-[#140D10] shadow-[0_40px_80px_-50px_rgba(20,13,16,0.75)] lg:grid-cols-12">
        <div className="flex flex-col p-6 sm:p-9 lg:col-span-6 lg:p-12">
          <img src={logo.src} alt={name} width={logo.width} height={logo.height} loading="lazy" decoding="async" className="h-12 w-auto self-center md:h-14 md:self-start" />
          <p className="mt-6 font-display text-h3 leading-tight italic">{tagline}</p>
          {body.map((p) => (
            <p key={p} className="mt-4 text-lead text-ink-soft">
              {p}
            </p>
          ))}

          {/* The list is centred as a block on phones, so its rules line up down the left */}
          <ul className="mx-auto mt-7 grid w-fit gap-x-6 gap-y-1.5 text-left text-sm text-ink-soft sm:grid-cols-2 md:mx-0">
            {services.map((s) => (
              <li key={s} className="flex items-center gap-3">
                <span aria-hidden className="h-px w-3 shrink-0 bg-terracotta" />
                {s}
              </li>
            ))}
          </ul>

          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group label mt-7 inline-flex min-h-11 items-center justify-center gap-2 self-center text-[0.75rem] text-ink transition-colors hover:text-terracotta md:self-start"
          >
            Visit {name}
            <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="flex items-center border-t border-line p-6 sm:p-9 lg:col-span-6 lg:border-t-0 lg:border-l lg:p-10">
          <BuildLayers reduced={reduced} className="w-full" />
        </div>
      </Reveal>
    </section>
  )
}
