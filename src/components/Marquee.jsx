import { Fragment, useEffect, useRef } from 'react'

/**
 * A slow band of words between chapters (brief §4). Decorative (aria-hidden);
 * `reverse` runs it the other way so consecutive bands alternate. Pauses on
 * hover and when off-screen, and stays still for reduced-motion users (CSS).
 * tone: 'cream' (the page), 'ink' (a near-black band, light type) or 'blush' (a soft band).
 */
const TONES = {
  cream: 'border-y border-line',
  // A literal ink: inside data-ground="ink" the --color-ink token reads as cream (global.css).
  ink: 'bg-[#1A1A1A] border-y border-[#1A1A1A]',
  blush: 'bg-blush border-y border-line',
}

export function Marquee({ words, reverse = false, tone = 'cream' }) {
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

  const run = (
    <span className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className={`px-[0.35em] ${i % 2 ? 'italic text-terracotta' : ''}`}>{w}</span>
          <span className="inline-block size-[0.14em] rounded-full bg-terracotta" />
        </Fragment>
      ))}
    </span>
  )

  return (
    <div
      ref={root}
      aria-hidden
      data-grain
      data-running="true"
      {...(tone === 'ink' ? { 'data-ground': 'ink' } : {})}
      className={`marquee overflow-hidden py-3 select-none md:py-5 ${TONES[tone]}`}
    >
      <div
        className={`marquee-track flex w-max font-display text-[clamp(1.5rem,0.9rem+1.8vw,2.75rem)] leading-[1.1] whitespace-nowrap ${
          reverse ? '[animation-direction:reverse]' : ''
        }`}
      >
        {run}
        {run}
      </div>
    </div>
  )
}
