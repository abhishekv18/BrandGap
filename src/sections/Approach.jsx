import { useLayoutEffect, useRef, useState } from 'react'
import { ScrollTrigger } from '../animations/gsap'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { APPROACH_INTRO, APPROACH_STEPS } from '../data/approach'
import { useCapabilities } from '../hooks/useCapabilities'

const LAST = APPROACH_STEPS.length - 1

/**
 * Chapter V — Our approach (brief §4, section 05).
 * One large numeral holds its place while the steps pass beside it, rolling
 * to the step being read; beneath it the b and the g close in, one step at a
 * time, and meet on Scale. Phones read the steps as a simple sequence.
 */
export function Approach({ numeral = 'V', headingLevel = 'h2', className = '' }) {
  const { reducedMotion } = useCapabilities()
  const root = useRef(null)
  const [active, setActive] = useState(0)
  const Heading = headingLevel

  // State, not motion: this runs for everyone; reduced motion just drops the transitions (CSS).
  useLayoutEffect(() => {
    const triggers = Array.from(root.current.querySelectorAll('[data-step]')).map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end: 'bottom 60%',
        onToggle: (self) => self.isActive && setActive(i),
      }),
    )
    return () => triggers.forEach((t) => t.kill())
  }, [])

  // How far the gap has closed: 0 at Discover, 1 at Scale.
  const closed = active / LAST

  return (
    <section id="approach" ref={root} aria-labelledby="approach-title" className={`container-page section-y ${className}`}>
      <div className="grid gap-6 text-center md:grid-cols-12 md:gap-8 md:text-left">
        <div className="md:col-span-8">
          <SectionLabel numeral={numeral} name="Our approach" />
          <Heading id="approach-title" className="mt-5 text-h2 md:mt-7">
            <MaskReveal>{APPROACH_INTRO.title}</MaskReveal>
          </Heading>
        </div>
        <Reveal as="p" delay={0.1} className="self-end font-display text-h3 italic text-ink-soft md:col-span-4">
          {APPROACH_INTRO.line}
        </Reveal>
      </div>

      <div className="mt-8 md:mt-10 desk:mt-12 desk:grid desk:grid-cols-12 desk:gap-8">
        {/* The rolling numeral and the closing gap — tablet and up */}
        <div aria-hidden className="hidden desk:sticky desk:top-[22svh] desk:col-span-5 desk:block desk:self-start">
          <div className="line-mask font-display text-[clamp(5rem,2rem+6vw,8.5rem)] leading-[0.85] text-terracotta">
            <div className="h-[0.85em] overflow-hidden">
              <div
                className="transition-transform duration-[900ms] ease-(--ease-out-expo)"
                style={{ transform: `translateY(${-active * 0.85}em)` }}
              >
                {APPROACH_STEPS.map((s) => (
                  <div key={s.id} className="h-[0.85em] tabular-nums">
                    {s.index}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-xs">
            <div className="relative h-3">
              <span
                className="absolute top-1/2 h-px -translate-y-1/2 bg-ink/25 transition-[left,right] duration-[900ms] ease-(--ease-out-expo)"
                style={{ left: `calc(${closed * 50}% + 6px)`, right: `calc(${closed * 50}% + 6px)` }}
              />
              <span
                className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-terracotta transition-[left] duration-[900ms] ease-(--ease-out-expo)"
                style={{ left: `calc(${closed * 50}% - ${closed * 12}px)` }}
              />
              <span
                className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-ink transition-[right] duration-[900ms] ease-(--ease-out-expo)"
                style={{ right: `calc(${closed * 50}% - ${closed * 12}px)` }}
              />
            </div>
            <p className="label mt-4 flex justify-between text-ink-muted">
              <span>Brand</span>
              <span className="tabular-nums text-terracotta">{String(Math.round(100 - closed * 100)).padStart(2, '0')}</span>
              <span>Growth</span>
            </p>
          </div>
        </div>

        <ol className="md:grid md:grid-cols-2 md:gap-x-8 desk:col-span-6 desk:col-start-7 desk:block">
          {APPROACH_STEPS.map((step, i) => {
            const on = reducedMotion || i === active
            return (
              <li
                key={step.id}
                data-step
                className="flex flex-col items-center border-t border-line py-8 text-center last:border-b md:items-start md:justify-start md:py-8 md:text-left md:last:border-b-0 desk:min-h-[34svh] desk:justify-center desk:py-12 desk:last:border-b"
              >
                <span className="font-display text-numeral text-terracotta desk:hidden">
                  <MaskReveal>{step.index}</MaskReveal>
                </span>
                <h3
                  className={`mt-2 font-display text-h3 transition-colors duration-700 desk:mt-0 ${
                    on ? 'text-ink' : 'desk:text-ink/35'
                  }`}
                >
                  <span className="label mr-4 hidden align-middle text-ink-muted desk:inline">{step.index}</span>
                  {step.name}
                  {i === LAST && <span className="text-terracotta">.</span>}
                </h3>
                <p
                  className={`mt-4 max-w-sm text-lead transition-colors duration-700 ${
                    on ? 'text-ink-soft' : 'desk:text-ink/35'
                  }`}
                >
                  {step.text}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
