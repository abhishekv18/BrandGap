import { useEffect, useRef } from 'react'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { CAPABILITIES, CAPABILITIES_INTRO, TOOLS } from '../data/capabilities'
import { numeralOf } from '../data/navigation'

/**
 * Chapter XIII — Capabilities & tech stack (Content Brief §13). Five
 * capability columns, then the tools we work in, set as one quiet line of
 * text rather than a wall of logos.
 */
export function Capabilities() {
  return (
    <section id="capabilities" aria-labelledby="capabilities-title" className="container-page section-y text-center md:text-left">
      <SectionLabel numeral={numeralOf('capabilities')} name="Capabilities" />
      <h2 id="capabilities-title" className="mt-5 text-h2 md:mt-7">
        <MaskReveal>{CAPABILITIES_INTRO.lead}</MaskReveal>
        <MaskReveal delay={0.08} className="italic text-terracotta">
          {CAPABILITIES_INTRO.emphasis}
        </MaskReveal>
      </h2>

      <div className="space-heading-content grid gap-x-6 sm:grid-cols-2 md:grid-cols-3 desk:grid-cols-5">
        {CAPABILITIES.map((group, i) => (
          <Reveal key={group.id} delay={i * 0.06} className="border-t border-line py-6 md:py-7">
            <h3 className="font-display text-h3 tracking-[-0.02em]">
              {group.name}
              <span className="text-terracotta">.</span>
            </h3>
            <ul className="mt-4 flex flex-col items-center gap-1 text-sm text-ink-soft md:items-start">
              {group.items.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span aria-hidden className="h-px w-3 bg-terracotta" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <ToolsMarquee />
    </section>
  )
}

/**
 * The tools we work in, as one slow line of text that drifts the opposite
 * way to the client logos under the hero — present, but clearly secondary.
 * Names only, never the tools' logos. Pauses on hover and off-screen, and
 * stays still for reduced-motion users (CSS).
 */
function ToolsMarquee() {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      el.dataset.running = entry.isIntersecting ? 'true' : 'false'
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const run = (copy) =>
    TOOLS.map((tool) => (
      <li key={`${copy}-${tool}`} aria-hidden={copy ? true : undefined} className="label flex shrink-0 items-center text-[0.75rem] text-ink">
        <span className="px-5 md:px-7">{tool}</span>
        <span aria-hidden className="size-1 rounded-full bg-terracotta" />
      </li>
    ))

  return (
    <Reveal className="space-subblock border-y border-line py-5 md:py-6">
      <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
        <h3 id="tools-title" className="label shrink-0 font-sans text-ink-muted">
          Tools we work in
        </h3>
        <div
          ref={root}
          data-running="true"
          className="marquee w-full min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] select-none"
        >
          <ul
            aria-labelledby="tools-title"
            className="marquee-track flex w-max items-center"
            style={{ animationDuration: '56s', animationDirection: 'reverse' }}
          >
            {run(0)}
            {run(1)}
          </ul>
        </div>
      </div>
    </Reveal>
  )
}
