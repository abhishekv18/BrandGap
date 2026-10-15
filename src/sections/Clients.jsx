import { AnimatePresence, m } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Copy } from '../components/Copy'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { CLIENTS_INTRO, HAS_DEMO_TESTIMONIALS, TESTIMONIALS } from '../data/testimonials'
import { numeralOf } from '../data/navigation'
import { useReducedMotion } from '../hooks/useMediaQuery'

const EASE = [0.16, 1, 0.3, 1]
const pad = (n) => String(n).padStart(2, '0')

/**
 * Clients & testimonials. The brands themselves are listed in Selected
 * brands (Content Brief §08 asks for no logo wall), so this chapter holds
 * the testimonials only — placeholders until real, permitted quotes exist.
 *
 * Editorial layout: one quote at a time, set large on a print plate with its
 * attribution and result; beside it, the index of clients to choose from.
 */
export function Clients({ numeral = numeralOf('clients') }) {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const [lead, ...rest] = CLIENTS_INTRO.title.split(' building ')
  const t = TESTIMONIALS[active]

  return (
    <section id="clients" aria-labelledby="clients-title" className="container-page section-y text-center md:text-left">
      <div className="grid gap-heading-row lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SectionLabel numeral={numeral} name="Clients" />
          <h2 id="clients-title" className="mx-auto mt-5 max-w-[22ch] text-h2 md:mx-0 md:mt-7">
            <MaskReveal>{lead} building</MaskReveal>
            <MaskReveal delay={0.08} className="italic text-terracotta">
              {rest.join(' building ')}
            </MaskReveal>
          </h2>
        </div>
        {/* Shown only while the quotes are demo content (data/testimonials.js) */}
        {HAS_DEMO_TESTIMONIALS && (
          <p className="label flex items-center justify-center gap-2 self-end text-[0.625rem] text-ink-muted md:justify-start lg:col-span-4 lg:justify-end">
            <span aria-hidden className="size-1.5 rounded-full bg-terracotta" />
            Draft testimonials — awaiting client approval
          </p>
        )}
      </div>

      <Reveal className="space-heading-content grid gap-6 lg:grid-cols-12 lg:gap-8">
        {/* The quote, on a plate */}
        <figure
          id="testimonial-quote"
          aria-live="polite"
          className="relative flex min-h-[18rem] flex-col justify-between border border-line bg-cream/60 p-6 text-left shadow-[0_30px_60px_-45px_rgba(28,18,22,0.4)] sm:p-9 lg:col-span-8 lg:p-12"
        >
          <span aria-hidden className="pointer-events-none absolute inset-2 border border-ink/[0.06]" />
          <div className="relative flex items-start justify-between gap-6">
            <span aria-hidden className="font-display text-[clamp(3.5rem,2.5rem+3vw,5.5rem)] leading-[0.7] text-terracotta">
              &ldquo;
            </span>
            <span className="label pt-2 tabular-nums text-ink-muted">
              <span className="text-terracotta">{pad(active + 1)}</span> / {pad(TESTIMONIALS.length)}
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={t.id}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -10, transition: { duration: 0.25 } }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative mt-4"
            >
              <blockquote className="max-w-[38ch] font-display text-h3 leading-[1.25] tracking-[-0.015em]">
                <Copy value={t.quote} />
              </blockquote>
              <figcaption className="mt-8 flex flex-col gap-5 border-t border-line pt-5 sm:flex-row sm:items-end sm:justify-between md:mt-10">
                <span>
                  <span className="block font-display text-h3 leading-tight">
                    <Copy value={t.name} />
                  </span>
                  <span className="label mt-1.5 block text-[0.6875rem] text-ink-muted">
                    <Copy value={t.role} tone="inherit" /> <span aria-hidden>·</span> <Copy value={t.company} tone="inherit" />
                  </span>
                </span>
                <span className="flex flex-col sm:items-end">
                  <span className="label text-[0.625rem] text-ink-muted">Result</span>
                  <span className="mt-1 font-display text-h3 leading-none text-terracotta">
                    <Copy value={t.result} tone="inherit" />
                  </span>
                </span>
              </figcaption>
            </m.div>
          </AnimatePresence>
        </figure>

        {/* The index of clients: choose a quote */}
        <div className="lg:col-span-4">
          <p className="label hidden text-[0.625rem] text-ink-muted lg:block">In their words</p>
          <ul aria-label="Choose a testimonial" className="border-t border-line lg:mt-4">
            {TESTIMONIALS.map((item, i) => {
              const on = i === active
              return (
                <li key={item.id} className="border-b border-line">
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-controls="testimonial-quote"
                    onClick={() => setActive(i)}
                    className="group relative flex min-h-11 w-full items-center gap-4 py-5 text-left"
                  >
                    {/* The active row is marked by a terracotta rule along its top edge */}
                    <span
                      aria-hidden
                      className={`absolute -top-px left-0 h-px origin-left bg-terracotta transition-transform duration-700 ease-(--ease-out-expo) ${on ? 'w-full scale-x-100' : 'w-full scale-x-0'}`}
                    />
                    <span className={`label w-6 shrink-0 tabular-nums transition-colors ${on ? 'text-terracotta' : 'text-ink-muted'}`}>{pad(i + 1)}</span>
                    <span className="min-w-0 flex-1">
                      <span className={`block font-display text-xl leading-tight transition-colors ${on ? 'text-ink' : 'text-ink/55 group-hover:text-ink'}`}>
                        <Copy value={item.name} />
                      </span>
                      <span className="label mt-1 block text-[0.625rem] text-ink-muted">
                        <Copy value={item.result} tone="inherit" />
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      strokeWidth={1.5}
                      className={`size-4 shrink-0 transition-[transform,color,opacity] duration-500 ${on ? 'translate-x-0 text-terracotta opacity-100' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60'}`}
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}
