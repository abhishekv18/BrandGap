import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { numeralOf } from '../data/navigation'
import { TECH_INTRO, TECH_PARTNERS } from '../data/partners'

function Card({ partner, hidden }) {
  return (
    <li aria-hidden={hidden || undefined} className={`mr-3 shrink-0 motion-reduce:mb-3 md:mr-4 ${hidden ? 'motion-reduce:hidden' : ''}`}>
      <div className="flex h-32 w-48 flex-col items-center justify-between rounded-[0.75rem] border border-line bg-[#FBF7F3] px-5 pt-6 pb-3.5 md:h-36 md:w-56">
        <span className="flex h-12 w-full items-center justify-center">
          <img
            src={partner.src}
            alt={hidden ? '' : `${partner.name} logo`}
            width={partner.width}
            height={120}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-8 w-auto max-w-full object-contain md:h-9"
          />
        </span>
        <span className="label w-full border-t border-line pt-2.5 text-center text-[0.625rem] text-ink-muted">{partner.role}</span>
      </div>
    </li>
  )
}

/**
 * Our technology partners: the platforms, as a slow slider of full-colour logos on
 * paper cards. Hover, off-screen or the Pause button stops it; reduced motion shows
 * a still set.
 */
export function TechPartners({ numeral = numeralOf('partners') }) {
  const [paused, setPaused] = useState(false)
  const [onScreen, setOnScreen] = useState(true)
  const root = useRef(null)
  const running = onScreen && !paused ? 'true' : 'false'

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="partners" ref={root} aria-labelledby="partners-title" className="section-y overflow-hidden text-center md:text-left">
      <div className="container-page grid gap-heading-row lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SectionLabel numeral={numeral} name="Our technology partners" />
          <h2 id="partners-title" className="mt-5 text-h2 md:mt-7">
            <MaskReveal>{TECH_INTRO.title}</MaskReveal>
            <MaskReveal delay={0.08} className="italic text-terracotta">
              {TECH_INTRO.emphasis}
            </MaskReveal>
          </h2>
        </div>
        <Reveal delay={0.12} className="self-end lg:col-span-4">
          <p className="mx-auto max-w-xl text-lead text-ink-soft md:mx-0">{TECH_INTRO.body}</p>
          <div className="mt-4 flex items-center justify-center gap-5 md:justify-between">
            <span className="label text-[0.6875rem] text-ink-muted">
              <span className="tabular-nums text-terracotta">{String(TECH_PARTNERS.length).padStart(2, '0')}</span> platforms
            </span>
            <button
              type="button"
              aria-pressed={paused}
              onClick={() => setPaused((v) => !v)}
              className="label inline-flex min-h-11 items-center gap-2 text-[0.6875rem] text-ink transition-colors hover:text-terracotta motion-reduce:hidden"
            >
              {paused ? <Play aria-hidden strokeWidth={1.5} className="size-3.5" /> : <Pause aria-hidden strokeWidth={1.5} className="size-3.5" />}
              {paused ? 'Play' : 'Pause'}
            </button>
          </div>
        </Reveal>
      </div>

      <div data-running={running} className="marquee space-heading-content [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)] select-none motion-reduce:[mask-image:none]">
        <ul aria-label="Technology partner logos" className="marquee-track flex w-max [animation-duration:52s] motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center">
          {TECH_PARTNERS.map((p) => (
            <Card key={p.name} partner={p} />
          ))}
          {TECH_PARTNERS.map((p) => (
            <Card key={`${p.name}-copy`} partner={p} hidden />
          ))}
        </ul>
      </div>
    </section>
  )
}
