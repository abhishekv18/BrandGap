import { Fragment, useEffect, useRef } from 'react'

/**
 * A slow band of words between chapters. Decorative (aria-hidden); pauses
 * when off-screen and stays still for reduced-motion users (CSS).
 */
export function Marquee({ words }) {
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
      className="marquee overflow-hidden border-y border-line py-4 select-none md:py-6"
    >
      <div className="marquee-track flex w-max font-display text-[clamp(1.75rem,1rem+2.2vw,3.25rem)] leading-[1.1] whitespace-nowrap">
        {run}
        {run}
      </div>
    </div>
  )
}
