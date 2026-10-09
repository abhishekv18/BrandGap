import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { SplitAd, SplitAdMobile } from '../components/illustrations/SplitAd'
import { numeralOf } from '../data/navigation'
import { CREATIVE_PERFORMANCE as CP } from '../data/why'
import { useCapabilities } from '../hooks/useCapabilities'

/**
 * Chapter IX — Creative × Performance (Content Brief §09). One ad, split:
 * the creative half and the performance half start apart and close on
 * Growth as the section scrolls into view — the gap closing once more.
 */
export function CreativePerformance() {
  const { reducedMotion } = useCapabilities()
  const root = useRef(null)

  useLayoutEffect(() => {
    if (reducedMotion) return
    const mm = gsap.matchMedia()
    // Tablet and desktop; phones show the ad already joined.
    mm.add('(min-width: 768px)', () => {
      const fig = { trigger: '[data-split]', start: 'top 85%', end: 'center 55%', scrub: 0.6 }
      gsap.fromTo('[data-split] [data-half="b"]', { x: -110 }, { x: 0, ease: 'none', scrollTrigger: fig })
      gsap.fromTo('[data-split] [data-half="g"]', { x: 110 }, { x: 0, ease: 'none', scrollTrigger: fig })
      gsap.fromTo('[data-split] [data-stamp]', { scale: 0.86, autoAlpha: 0.3 }, { scale: 1, autoAlpha: 1, ease: 'none', scrollTrigger: fig })
    }, root)
    return () => mm.revert()
  }, [reducedMotion])

  return (
    <section id="creative-performance" ref={root} aria-labelledby="cp-title" className="container-page section-y overflow-hidden text-center md:text-left">
      <div className="grid gap-heading-row lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SectionLabel numeral={numeralOf('creative-performance')} name="Creative × Performance" />
          <h2 id="cp-title" className="mt-5 text-h2 md:mt-7">
            <MaskReveal>{CP.lead}</MaskReveal>
            <MaskReveal delay={0.08} className="italic text-terracotta">
              {CP.emphasis}
            </MaskReveal>
          </h2>
        </div>
        <Reveal as="p" delay={0.15} className="self-end text-lead text-ink-soft md:max-w-xl lg:col-span-4">
          {CP.body}
        </Reveal>
      </div>

      {/* One ad, split: creative | performance — closing on Growth */}
      <figure data-split className="space-heading-content">
        <SplitAd className="mx-auto hidden h-auto w-full max-w-5xl desk:block" />
        <SplitAd labelSize={28} uid="splitad-tab" className="mx-auto hidden h-auto w-full md:block desk:hidden" />
        <Reveal>
          <SplitAdMobile className="mx-auto block h-auto w-full max-w-[26rem] md:hidden" />
        </Reveal>
      </figure>
    </section>
  )
}
