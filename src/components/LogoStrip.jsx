import { useEffect, useRef } from 'react'
import { CLIENT_LOGOS, LOGO_STRIP } from '../data/clients'

/**
 * "Trusted by growing brands" — the client logos in one quiet line under
 * the hero. Every logo is set in the same ink at reduced strength and
 * lifts to full on hover; the row drifts like the site's word marquee,
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
      <li key={`${copy}-${logo.id}`} aria-hidden={copy ? true : undefined} className="flex shrink-0 items-center px-6 md:px-10 xl:px-12">
        <img
          src={logo.src}
          alt={copy ? '' : logo.name}
          width={logo.width}
          height={logo.height}
          decoding="async"
          draggable={false}
          className="w-auto opacity-60 transition-opacity duration-500 hover:opacity-100"
          style={{ height: `calc(${logo.size}px * var(--logo-scale))` }}
        />
      </li>
    ))

  return (
    <section aria-labelledby="logos-title" className="border-y border-line py-7 md:py-9">
      <div className="container-page flex flex-col items-center gap-5 md:flex-row md:gap-10">
        <h2 id="logos-title" className="label shrink-0 text-center font-sans text-[0.6875rem] text-ink-muted md:max-w-[8.5rem] md:text-left">
          {LOGO_STRIP.title}
        </h2>
        <div
          ref={root}
          data-running="true"
          className="marquee w-full min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)] select-none [--logo-scale:0.78] md:[--logo-scale:0.9] xl:[--logo-scale:1]"
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
