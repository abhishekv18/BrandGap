import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { BRAND_GROUPS, BRANDS_INTRO, EXPERIENCE_ACROSS } from '../data/brands'
import { numeralOf } from '../data/navigation'

/**
 * Chapter VIII — Selected brands (Content Brief §08). Deliberately not a
 * logo wall: the brands are set as a quiet editorial index, grouped by
 * category, with the industries we work across underneath.
 */
export function Brands() {
  return (
    <section id="brands" aria-labelledby="brands-title" className="container-page section-y text-center md:text-left">
      <SectionLabel numeral={numeralOf('brands')} name="Selected brands" />
      <h2 id="brands-title" className="mt-5 text-h2 md:mt-7">
        <MaskReveal>{BRANDS_INTRO.lead}</MaskReveal>
        <MaskReveal delay={0.08} className="italic text-terracotta">
          {BRANDS_INTRO.emphasis}
        </MaskReveal>
      </h2>

      <div className="space-heading-content grid gap-columns md:grid-cols-12">
        {BRAND_GROUPS.map((group, g) => (
          <Reveal key={group.id} delay={g * 0.1} className={g ? 'md:col-span-5 md:col-start-8' : 'md:col-span-6'}>
            <h3 className="label flex items-center justify-center gap-3 font-sans text-terracotta md:justify-start">
              {group.name}
              <span className="text-ink-muted tabular-nums">{String(group.brands.length).padStart(2, '0')}</span>
            </h3>
            <ul className="mt-4 border-t border-line">
              {group.brands.map((brand) => (
                <li
                  key={brand.name}
                  className="group flex flex-col items-center gap-1 border-b border-line py-3.5 md:items-start lg:flex-row lg:items-baseline lg:justify-between lg:gap-6"
                >
                  <span className="font-display text-xl tracking-[-0.02em] transition-colors duration-500 group-hover:text-terracotta md:text-2xl">
                    {brand.name}
                  </span>
                  {brand.note && <span className="label text-[0.6875rem] text-ink-muted lg:text-right">{brand.note}</span>}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal className="space-subblock flex flex-col items-center gap-4 md:flex-row md:items-baseline md:gap-8">
        <p className="label shrink-0 text-ink-muted">Experience across</p>
        <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1 font-display text-xl italic md:justify-start">
          {EXPERIENCE_ACROSS.map((item, i) => (
            <li key={item} className="flex items-baseline gap-3">
              {item}
              {i < EXPERIENCE_ACROSS.length - 1 && (
                <span aria-hidden className="not-italic text-terracotta">
                  ·
                </span>
              )}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
