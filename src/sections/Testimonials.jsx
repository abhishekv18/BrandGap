import { AnimatePresence, m } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Copy } from '../components/Copy'
import { SectionLabel } from '../components/SectionLabel'
import { TESTIMONIALS } from '../data/testimonials'

const EASE = [0.16, 1, 0.3, 1]

/**
 * A single editorial quote at a time. Changes only when the reader asks —
 * buttons or arrow keys — and crossfades in place. No auto-rotation.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0)
  const count = TESTIMONIALS.length
  const t = TESTIMONIALS[index]
  const go = (dir) => setIndex((i) => (i + dir + count) % count)

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="container-page section-y text-center md:text-left">
      <div className="flex items-center justify-center gap-6 md:justify-between">
        <SectionLabel numeral="V" name="In their words" />
        <h2 id="testimonials-title" className="sr-only">
          Testimonials
        </h2>
      </div>

      <div
        role="region"
        className="relative mt-10 grid md:mt-14 md:grid-cols-12"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
        onKeyDown={onKeyDown}
      >
        <span
          aria-hidden
          className="pointer-events-none font-display text-[clamp(5rem,3rem+6vw,10rem)] leading-[0.6] text-terracotta md:col-span-2"
        >
          &ldquo;
        </span>

        <div className="relative md:col-span-9 md:col-start-3">
          <div aria-live="polite" className="grid">
            <AnimatePresence mode="wait" initial={false}>
              <m.figure
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="[grid-area:1/1]"
              >
                <blockquote className="font-display text-quote tracking-[-0.02em]">
                  <Copy value={t.quote} />
                </blockquote>
                <figcaption className="mt-8 flex flex-wrap items-baseline justify-center gap-x-6 gap-y-2 md:mt-10 md:justify-start">
                  <span className="font-display text-xl">
                    <Copy value={t.name} />
                  </span>
                  <span className="label text-ink-muted">
                    <Copy value={t.role} /> <span aria-hidden>·</span> <Copy value={t.company} />
                  </span>
                </figcaption>
              </m.figure>
            </AnimatePresence>
          </div>

          {count > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 border-t border-line pt-6 md:mt-14 md:flex-nowrap md:justify-start">
              <p className="label tabular-nums text-ink-muted">
                <span className="text-terracotta">0{index + 1}</span> / 0{count}
              </p>
              <span aria-hidden className="relative order-last h-px basis-full bg-line md:order-none md:basis-auto md:flex-1">
                <m.span
                  className="absolute inset-0 origin-left bg-terracotta"
                  initial={false}
                  animate={{ scaleX: (index + 1) / count }}
                  transition={{ duration: 0.8, ease: EASE }}
                />
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous testimonial"
                  className="flex size-12 items-center justify-center rounded-full border border-line transition-colors duration-300 hover:border-terracotta hover:text-terracotta"
                >
                  <ArrowLeft aria-hidden strokeWidth={1.5} className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next testimonial"
                  className="flex size-12 items-center justify-center rounded-full border border-line transition-colors duration-300 hover:border-terracotta hover:text-terracotta"
                >
                  <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
