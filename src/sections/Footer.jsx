import { ArrowUp } from 'lucide-react'
import { BrandMark } from '../components/BrandMark'
import { ContactLink } from '../components/ContactLink'
import { useSmoothScroll } from '../components/SmoothScroll'
import { CONTACT, FOOTER } from '../data/contact'
import { NAV_LINKS } from '../data/navigation'

/**
 * The page's one dark moment. The mark switches to its cream-g version,
 * as the guidelines require on dark grounds, and the wordmark closes the page.
 */
export function Footer() {
  const { scrollTo } = useSmoothScroll()
  const go = (e, id) => {
    e.preventDefault()
    scrollTo(`#${id}`)
  }

  return (
    <footer data-theme="dark" className="overflow-hidden bg-ink text-cream">
      <div className="container-page pt-16 pb-8 md:pt-24">
        <div className="flex flex-col items-center gap-10 text-center md:grid md:grid-cols-12 md:items-start md:gap-6 md:text-left">
          <div className="flex flex-col items-center md:col-span-5 md:items-start">
            <BrandMark tone="dark" title="BrandGap" className="h-14 w-auto" />
            <p className="mt-5 max-w-xs font-display text-xl italic text-cream/80 md:text-2xl">{FOOTER.tagline}</p>
          </div>

          <nav aria-label="Footer" className="md:col-span-2 md:col-start-7">
            <p className="label mb-4 text-cream/60">Index</p>
            <ul className="flex flex-col items-center md:items-start">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={(e) => go(e, l.id)} className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-terracotta">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className="label mb-4 text-cream/60">Follow</p>
            <ul className="flex flex-col items-center md:items-start">
              {CONTACT.socials.map((s) => (
                <li key={s.id} className="flex min-h-11 items-center justify-center md:justify-start">
                  <ContactLink label={s.label} href={s.href} placeholder={s.placeholder} />
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="label mb-4 text-cream/60">Write</p>
            <ContactLink label={CONTACT.email.label} href={CONTACT.email.href} className="break-words" />
          </div>
        </div>

        {/* The wordmark, set large — the last thing on the page */}
        <p
          aria-hidden
          className="mt-14 pb-[0.14em] text-center font-display text-[clamp(3.5rem,1rem+13vw,16rem)] leading-none tracking-[-0.03em] whitespace-nowrap select-none md:mt-16"
        >
          <span className="text-cream">Brand</span>
          <span className="text-terracotta">Gap</span>
        </p>

        <div className="mt-6 flex flex-col items-center gap-3 border-t border-line-light pt-6 text-center text-xs text-cream/60 sm:flex-row sm:justify-between sm:text-left">
          <p>© {FOOTER.year} BrandGap</p>
          <p className="label text-[0.6875rem]">{FOOTER.origin}</p>
          <button
            type="button"
            onClick={() => scrollTo(0)}
            className="label inline-flex min-h-11 items-center gap-2 text-[0.6875rem] transition-colors hover:text-cream"
          >
            Back to top <ArrowUp aria-hidden strokeWidth={1.5} className="size-3.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
