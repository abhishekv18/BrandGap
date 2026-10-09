import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { SignalChain, SignalChainMobile, SignalChainTablet } from '../components/illustrations/SignalChain'
import { numeralOf } from '../data/navigation'
import { FUNNEL, PERFORMANCE_INTRO, PHILOSOPHY } from '../data/performance'
import { useCapabilities } from '../hooks/useCapabilities'

/**
 * Chapter V — Performance marketing & philosophy (Content Brief §05).
 * The full funnel reads left to right on desktop (top to bottom elsewhere);
 * a terracotta hairline fills through the four stages as you scroll, ending
 * on Scale. Below it, the philosophy: what we ignore, and what we focus on.
 */
export function Performance() {
  const { reducedMotion } = useCapabilities()
  const root = useRef(null)

  useLayoutEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      const st = { trigger: '[data-funnel]', start: 'top 75%', end: 'bottom 60%', scrub: 0.6 }
      gsap.fromTo('[data-funnel-x]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: st })
      gsap.fromTo('[data-funnel-y]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: st })

      // The figure below: its thread draws through the five steps the same way, callouts following.
      gsap.utils.toArray('[data-chain] svg').forEach((svg) => {
        const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: svg, start: 'top 80%', end: 'bottom 70%', scrub: 0.6 } })
        tl.fromTo(svg.querySelectorAll('[data-draw]'), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55 }, 0)
        const late = svg.querySelectorAll('[data-draw-late]')
        if (late.length) tl.fromTo(late, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4 }, 0.6)
        tl.fromTo(svg.querySelectorAll('[data-callout]'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.17 }, 0.02)
      })
    }, root)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section id="performance" ref={root} aria-labelledby="performance-title" className="container-page section-y text-center md:text-left">
      <div className="grid gap-heading-row md:grid-cols-12">
        <div className="md:col-span-8">
          <SectionLabel numeral={numeralOf('performance')} name="Performance marketing" />
          <h2 id="performance-title" className="mt-5 max-w-[22ch] text-h2 md:mt-7">
            <MaskReveal>{PERFORMANCE_INTRO.lead}</MaskReveal>
            <MaskReveal delay={0.08} className="italic text-terracotta">
              {PERFORMANCE_INTRO.emphasis}
            </MaskReveal>
          </h2>
        </div>
        <Reveal as="div" delay={0.15} className="flex flex-col gap-2 self-end text-lead text-ink-soft md:col-span-4">
          {PERFORMANCE_INTRO.principles.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </Reveal>
      </div>

      {/* The full funnel */}
      <div data-funnel className="space-heading-content">
        <p className="label text-ink-muted">
          Full-funnel view <span className="text-terracotta">—</span> 04 stages
        </p>
        <div className="relative mt-6 md:mt-8">
          {/* Desktop: one hairline across the four stages */}
          <span aria-hidden className="absolute inset-x-0 top-0 hidden h-px bg-line desk:block">
            <span data-funnel-x className="absolute inset-0 origin-left bg-terracotta" />
          </span>
          {/* Phones and tablets: the same line, running down the left */}
          <span aria-hidden className="absolute top-0 bottom-0 left-0 hidden w-px bg-line md:block desk:hidden">
            <span data-funnel-y className="absolute inset-0 origin-top bg-terracotta" />
          </span>

          <ol className="grid gap-px md:gap-0 desk:grid-cols-4 desk:gap-6">
            {FUNNEL.map((stage, i) => {
              const last = i === FUNNEL.length - 1
              return (
                <Reveal
                  as="li"
                  key={stage.id}
                  delay={i * 0.08}
                  className="relative border-t border-line py-7 md:border-t-0 md:py-6 md:pl-10 desk:pt-9 desk:pb-0 desk:pl-0"
                >
                  <span
                    aria-hidden
                    className={`absolute hidden size-2.5 rounded-full md:block md:top-8 md:-left-[4.5px] desk:-top-[4.5px] desk:left-0 ${
                      last ? 'bg-terracotta' : 'bg-ink'
                    }`}
                  />
                  <p className="label text-terracotta">
                    {stage.stage} <span className="text-ink-muted">— 0{i + 1}</span>
                  </p>
                  <h3 className="mt-3 font-display text-h3 tracking-[-0.02em]">
                    {stage.name}
                    {last && <span className="text-terracotta">.</span>}
                  </h3>
                  <ul className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-ink-soft md:justify-start desk:flex-col">
                    {stage.items.map((item, k) => (
                      <li key={item} className="flex items-center gap-3">
                        <span aria-hidden className="hidden h-px w-3 bg-terracotta desk:block" />
                        {item}
                        {k < stage.items.length - 1 && (
                          <span aria-hidden className="text-ink-muted desk:hidden">
                            ·
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )
            })}
          </ol>
        </div>
      </div>

      {/* Inside a single ad — an editorial figure (desktop 21:9, tablet 16:9, phones a compact list) */}
      <figure data-chain className="space-subblock">
        <SignalChain className="mx-auto hidden h-auto w-full desk:block desk:w-10/12" />
        <SignalChainTablet className="mx-auto hidden h-auto w-full max-w-3xl md:block desk:hidden" />
        <SignalChainMobile className="mx-auto block h-auto w-[15rem] max-w-full md:hidden" />
        <figcaption className="label mt-4 text-center text-[0.625rem] text-ink-muted md:mt-5">
          Fig. — Inside a single ad <span className="text-terracotta">·</span> illustrative
        </figcaption>
      </figure>

      {/* The philosophy */}
      <div className="space-subblock grid gap-columns border-t border-line pt-8 md:grid-cols-12 md:pt-10">
        <Reveal className="md:col-span-7">
          <h3 className="font-display text-h3 tracking-[-0.02em]">
            {PHILOSOPHY.lead} <span className="italic text-terracotta">{PHILOSOPHY.emphasis}</span>
          </h3>
          <ul className="mt-5 flex flex-col gap-1.5">
            {PHILOSOPHY.myths.map((line) => (
              <li key={line} className="font-display text-xl italic text-ink-muted">
                {line}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-5 md:col-start-8 md:self-end">
          <p className="label text-ink-muted">Focus on</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
            {PHILOSOPHY.focus.map((item) => (
              <li key={item} className="label rounded-full border border-line px-4 py-2 text-[0.6875rem]">
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
