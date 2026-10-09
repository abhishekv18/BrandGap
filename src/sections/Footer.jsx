import { ArrowUp } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { BrandMark } from '../components/BrandMark'
import { ContactLink } from '../components/ContactLink'
import { Copy } from '../components/Copy'
import { NewsletterForm } from '../components/NewsletterForm'
import { useSmoothScroll } from '../components/SmoothScroll'
import { CONTACT, FOOTER } from '../data/contact'
import { NAV_LEGAL, NAV_TOOLS } from '../data/navigation'
import { useCapabilities } from '../hooks/useCapabilities'
import { useHrefClick } from '../hooks/useHrefClick'

// Content Brief §14 — footer columns.
const COLUMNS = [
  { title: 'Services', links: FOOTER.services },
  { title: 'Company', links: FOOTER.company },
]

/**
 * The site's one dark ground (brief §4, section 10): navigation, contact,
 * social links, newsletter and availability. The mark switches to its cream-g
 * version, as the guidelines require on dark grounds. The closing wordmark is
 * the gap one last time: "Brand" and "Gap" drift together as the page ends
 * (parallax, desktop and tablet only).
 */
export function Footer() {
  const { scrollTo } = useSmoothScroll()
  const hrefClick = useHrefClick()
  const { tier, reducedMotion } = useCapabilities()
  const root = useRef(null)
  const parallax = tier !== 'mobile' && !reducedMotion

  useLayoutEffect(() => {
    if (!parallax) return
    const ctx = gsap.context(() => {
      const st = { trigger: '[data-wordmark]', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 }
      gsap.fromTo('[data-word-b]', { xPercent: -9 }, { xPercent: 0, ease: 'none', scrollTrigger: st })
      gsap.fromTo('[data-word-g]', { xPercent: 9 }, { xPercent: 0, ease: 'none', scrollTrigger: st })
      gsap.fromTo('[data-wordmark]', { yPercent: 28 }, { yPercent: 0, ease: 'none', scrollTrigger: st })
    }, root)
    return () => ctx.revert()
  }, [parallax])

  const link = (l) => (
    <li key={l.key ?? l.label}>
      <a
        href={l.to}
        onClick={(e) => hrefClick(e, l.to)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center transition-colors hover:text-blush md:justify-start lg:min-h-8"
      >
        {l.label}
      </a>
    </li>
  )

  return (
    <footer ref={root} data-theme="dark" className="overflow-hidden bg-ink text-cream">
      <div className="container-page pt-12 pb-6 md:pt-16">
        <div className="flex flex-col items-center gap-9 text-center md:grid md:grid-cols-12 md:items-start md:gap-6 md:text-left">
          <div className="flex flex-col items-center md:col-span-6 md:items-start lg:col-span-4">
            <BrandMark tone="dark" title="BrandGap" className="h-11 w-auto" />
            <p className="mt-4 max-w-xs font-display text-xl italic text-cream/80">{FOOTER.tagline}</p>
            <p className="label mt-4 flex items-center gap-3 text-[0.6875rem] text-cream/70">
              <span aria-hidden className="size-1.5 rounded-full bg-terracotta" />
              <Copy value={FOOTER.availability} tone="light" />
            </p>
          </div>

          {/* Side by side on phones; separate grid columns from tablet up */}
          <div className="grid w-full max-w-sm grid-cols-2 gap-6 md:contents">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title} className="md:col-span-3 lg:col-span-2">
                <p className="label mb-2 text-cream/60">{col.title}</p>
                <ul className="flex flex-col items-center md:items-start">{col.links.map(link)}</ul>
              </nav>
            ))}
          </div>

          <div className="flex w-full max-w-sm flex-col items-center gap-6 md:col-span-12 md:max-w-none md:flex-row md:items-start md:gap-8 md:border-t md:border-line-light md:pt-8 lg:col-span-4 lg:flex-col lg:items-stretch lg:gap-6 lg:border-0 lg:pt-0">
            <NewsletterForm tone="light" id="footer-newsletter" className="w-full" />
            <div className="grid w-full grid-cols-2 gap-6 text-sm md:max-w-sm lg:max-w-none">
              <div>
                <p className="label mb-2 text-cream/60">Social</p>
                <ul className="flex flex-col items-center md:items-start">
                  {CONTACT.socials.map((s) => (
                    <li key={s.id} className="flex min-h-11 items-center lg:min-h-8">
                      <ContactLink label={s.label} href={s.href} placeholder={s.placeholder} />
                    </li>
                  ))}
                </ul>
              </div>
              <nav aria-label="Free tools">
                <p className="label mb-2 text-cream/60">Free tools</p>
                <ul className="flex flex-col items-center md:items-start">{NAV_TOOLS.map(link)}</ul>
              </nav>
            </div>
            {/* <div className="grid w-full grid-cols-2 gap-6 text-sm md:max-w-sm lg:max-w-none">
              <div>
                <p className="label mb-3 text-cream/60">Write</p>
                <ContactLink label={CONTACT.email.label} href={CONTACT.email.href} className="break-all" />
              </div>
              <div>
                <p className="label mb-3 text-cream/60">Follow</p>
                <ul className="flex flex-col items-center md:items-start">
                  {CONTACT.socials.map((s) => (
                    <li key={s.id} className="flex min-h-11 items-center lg:min-h-8">
                      <ContactLink label={s.label} href={s.href} placeholder={s.placeholder} />
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}
          </div>
        </div>

        {/* The wordmark, set large — the last thing on the page */}
        <p
          data-wordmark
          aria-hidden
          className="mt-10 pb-[0.12em] text-center font-display text-[clamp(3rem,0.5rem+11vw,11rem)] leading-none tracking-[-0.03em] whitespace-nowrap select-none md:mt-12"
        >
          <span data-word-b className="inline-block text-cream">
            Brand
          </span>
          <span data-word-g className="inline-block text-terracotta">
            Gap
          </span>
        </p>

        <div className="mt-4 flex flex-col items-center gap-2 border-t border-line-light pt-4 text-center text-xs text-cream/60 md:flex-row md:justify-between md:text-left">
          <p>© {FOOTER.year} BrandGap. All Rights Reserved.</p>
          <p className="label text-[0.6875rem]">{FOOTER.line}</p>
          <ul className="flex items-center gap-4">
            {NAV_LEGAL.map((l) => (
              <li key={l.to}>
                <a href={l.to} onClick={(e) => hrefClick(e, l.to)} className="label inline-flex min-h-11 items-center text-[0.6875rem] transition-colors hover:text-cream">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => scrollTo(0)}
                className="label inline-flex min-h-11 items-center gap-2 text-[0.6875rem] transition-colors hover:text-cream"
              >
                Back to top <ArrowUp aria-hidden strokeWidth={1.5} className="size-3.5" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
