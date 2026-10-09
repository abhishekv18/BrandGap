import { m } from 'framer-motion'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { numeralOf } from '../data/navigation'
import { DIFFERENCE, WHY_INTRO, WHY_REASONS } from '../data/why'
import { useReducedMotion } from '../hooks/useMediaQuery'

const EASE = [0.16, 1, 0.3, 1]

/** One approach as a flow of steps. The BrandGap flow lights up step by step. */
function Flow({ flow, accent, loop = false }) {
  const reduced = useReducedMotion()
  return (
    <div className="grid gap-3 border-t border-line py-5 md:grid-cols-12 md:items-baseline md:gap-6">
      <p className={`label md:col-span-3 ${accent ? 'text-terracotta' : 'text-ink-muted'}`}>{flow.name}</p>
      <m.ol
        className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 md:col-span-9 md:justify-start"
        initial={reduced ? false : 'hidden'}
        whileInView="shown"
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ staggerChildren: accent ? 0.08 : 0.05 }}
      >
        {flow.steps.map((step, i) => (
          <m.li
            key={step}
            variants={{ hidden: { opacity: 0, y: 10 }, shown: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex items-baseline gap-2"
          >
            <span
              className={`font-display text-xl md:text-2xl ${
                accent ? (i === flow.steps.length - 1 ? 'italic text-terracotta' : 'text-ink') : 'text-ink-muted'
              }`}
            >
              {step}
            </span>
            {(i < flow.steps.length - 1 || loop) && (
              <span aria-hidden className={accent ? 'text-terracotta' : 'text-ink-muted'}>
                {i < flow.steps.length - 1 ? '→' : '↺'}
              </span>
            )}
          </m.li>
        ))}
      </m.ol>
    </div>
  )
}

/**
 * Chapter XI — Why BrandGap (Content Brief §10): six reasons in the site's
 * editorial index, then the BrandGap difference — the usual loop set beside
 * the way we work, end to end.
 */
export function Why() {
  return (
    <section id="why" aria-labelledby="why-title" className="container-page section-y text-center md:text-left">
      <div className="grid gap-heading-row md:grid-cols-12">
        <div className="md:col-span-7">
          <SectionLabel numeral={numeralOf('why')} name="Why BrandGap" />
          <h2 id="why-title" className="mt-5 text-h2 md:mt-7">
            <MaskReveal>{WHY_INTRO.title}</MaskReveal>
          </h2>
        </div>
        <Reveal as="p" delay={0.1} className="self-end font-display text-h3 italic text-ink-soft md:col-span-5">
          {WHY_INTRO.statement}
        </Reveal>
      </div>

      <ol className="space-heading-content grid gap-x-6 sm:grid-cols-2 desk:grid-cols-3">
        {WHY_REASONS.map((reason, i) => (
          <Reveal
            as="li"
            key={reason.id}
            delay={(i % 3) * 0.08}
            className="group flex flex-col items-center border-t border-line py-7 md:items-start md:py-8"
          >
            <span className="label tabular-nums text-terracotta">0{i + 1}</span>
            <h3 className="mt-3 font-display text-h3 tracking-[-0.02em] transition-colors duration-500 group-hover:text-terracotta">
              {reason.name}
            </h3>
            <p className="mt-3 max-w-sm text-ink-soft">{reason.text}</p>
          </Reveal>
        ))}
      </ol>

      <div className="space-subblock">
        <p className="label text-ink-muted">{DIFFERENCE.title}</p>
        <div className="mt-5 border-b border-line md:mt-6">
          <Flow flow={DIFFERENCE.traditional} loop />
          <Flow flow={DIFFERENCE.brandgap} accent />
        </div>
      </div>
    </section>
  )
}
