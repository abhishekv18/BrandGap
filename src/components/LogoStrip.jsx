import { useEffect, useRef } from 'react'
import { CLIENT_LOGOS, LOGO_STRIP } from '../data/clients'

/**
 * "Trusted by growing brands" — the client logos in one quiet line under
 * the hero. Every logo is set in one even ink tone (the files arrive in
 * mismatched greys) and returns to its own colours on hover; terracotta
 * dots space them like the word marquee. The row drifts like the marquee,
 * fades out at both edges, pauses on hover and off-screen, and stays
 * still for reduced-motion users (CSS).
 */
export function LogoStrip() {
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

  if (!CLIENT_LOGOS.length) return null

  const row = (copy) =>
    CLIENT_LOGOS.map((logo) => (
      <li key={`${copy}-${logo.id}`} aria-hidden={copy ? true : undefined} className="flex shrink-0 items-center">
        <img
          src={logo.src}
          alt={copy ? '' : logo.name}
          width={logo.width}
          height={logo.height}
          decoding="async"
          draggable={false}
          className="w-auto opacity-55 transition-[opacity,filter] duration-500 [filter:grayscale(1)_brightness(0.35)] hover:opacity-100 hover:[filter:none]"
          style={{ height: `calc(${logo.size}px * var(--logo-scale))` }}
        />
        <span aria-hidden className="mx-7 size-1 shrink-0 rounded-full bg-terracotta/45 md:mx-10 xl:mx-12" />
      </li>
    ))

  return (
    <section aria-labelledby="logos-title" className="border-y border-line py-5 md:py-6">
      <div className="container-page flex flex-col items-center gap-5 md:flex-row md:gap-10">
        {/* The label, ruled off from the moving row by a hairline */}
        <h2 id="logos-title" className="label flex shrink-0 items-center gap-3 text-center font-sans text-[0.6875rem] text-ink-muted md:max-w-[11rem] md:gap-0 md:self-stretch md:border-r md:border-line md:pr-10 md:text-left">
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-terracotta md:hidden" />
          {LOGO_STRIP.title}
        </h2>
        <div
          ref={root}
          data-running="true"
          className="marquee w-full min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)] select-none [--logo-scale:0.72] md:[--logo-scale:0.82] xl:[--logo-scale:0.9]"
        >
          <ul aria-label="Clients" className="marquee-track flex w-max items-center [animation-duration:42s]">
            {row(0)}
            {row(1)}
          </ul>
        </div>
      </div>
    </section>
  )
}
