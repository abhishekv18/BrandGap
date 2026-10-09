import { m, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { ContactLink } from '../components/ContactLink'
import { MagneticButton } from '../components/MagneticButton'
import { SectionLabel } from '../components/SectionLabel'
import { CONTACT, FINAL_CTA } from '../data/contact'
import { useCapabilities } from '../hooks/useCapabilities'
import { useHrefClick } from '../hooks/useHrefClick'
import { track } from '../utils/analytics'
import { numeralOf } from '../data/navigation'

/**
 * Final CTA (Content Brief §14): the strongest call to
 * action on the page. The terracotta field opens from a thin band — the gap,
 * widening — and the page asks its one question. Reused at the foot of
 * every page, so each one ends on the same moment.
 */
export function FinalCta({ numeral = numeralOf('cta'), showSecondary = true, headline = FINAL_CTA.headline, body = FINAL_CTA.body }) {
  const { reducedMotion } = useCapabilities()
  const root = useRef(null)

  useLayoutEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 15%', scrub: 0.6 },
      })
      tl.fromTo('[data-field]', { clipPath: 'inset(47% 0% 47% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power2.inOut' }, 0)
      tl.fromTo('[data-contact-fade]', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.08 }, 0.55)
    }, root)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      id="cta"
      ref={root}
      aria-labelledby="cta-title"
      data-theme="terracotta"
      data-cursor-invert
      className="relative isolate overflow-hidden text-cream"
    >
      <div data-field aria-hidden className="absolute inset-0 -z-10 bg-terracotta" />

      <div className="container-page flex flex-col gap-10 pt-12 pb-10 text-center md:gap-12 md:pt-16 md:pb-10 md:text-left xl:pt-20">
        <SectionLabel data-contact-fade numeral={numeral} name="Close the gap" tone="light" />

        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-8">
            <h2 id="cta-title" data-contact-fade className="text-h2">
              {headline}
            </h2>
            <p data-contact-fade className="mx-auto mt-4 max-w-2xl font-display text-h3 italic md:mx-0 md:mt-5">
              {body}
            </p>
            {showSecondary && (
              <div data-contact-fade className="mt-5 flex justify-center md:mt-6 md:justify-start">
                <MagneticButton
                  href={FINAL_CTA.secondary.href}
                  variant="text"
                  className="!text-cream"
                  trackAs="cta_view_work"
                >
                  {FINAL_CTA.secondary.label}
                </MagneticButton>
              </div>
            )}
          </div>
          <div data-contact-fade className="flex justify-center md:col-span-4">
            <StartButton />
          </div>
        </div>

        <div data-contact-fade className="grid gap-5 border-t border-line-light pt-5 text-sm sm:grid-cols-3">
          <div>
            <p className="label mb-1.5 text-cream">Write</p>
            <ContactLink label={CONTACT.email.label} href={CONTACT.email.href} className="break-words" />
          </div>
          <div>
            <p className="label mb-1.5 text-cream">Call</p>
            <ContactLink label={CONTACT.phone.label} href={CONTACT.phone.href} placeholder="[Phone]" className="whitespace-nowrap" />
          </div>
          <div>
            <p className="label mb-1.5 text-cream">Follow</p>
            <ul className="flex justify-center gap-5 md:justify-start">
              {CONTACT.socials.map((s) => (
                <li key={s.id}>
                  <ContactLink label={s.label} href={s.href} placeholder={s.placeholder} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * The final call to action: a cream roundel that leans toward the pointer.
 * On hover an ink fill rises through it and the label rolls to a second line.
 */
function StartButton() {
  const { reducedMotion } = useCapabilities()
  const hrefClick = useHrefClick()
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 180, damping: 16, mass: 0.5 })
  const y = useSpring(my, { stiffness: 180, damping: 16, mass: 0.5 })
  const skewX = useTransform(x, [-60, 60], [4, -4])
  const labelX = useTransform(x, (v) => v * 0.3)
  const labelY = useTransform(y, (v) => v * 0.3)

  const onMove = (e) => {
    if (reducedMotion || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.35)
    my.set((e.clientY - (r.top + r.height / 2)) * 0.35)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const label = (
    <span className="flex max-w-[8.5rem] items-center justify-center text-center leading-snug tracking-[0.12em] md:max-w-[9rem]">
      {FINAL_CTA.label}
      {/* <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-4" /> */}
    </span>
  )

  return (
    <m.a
      ref={ref}
      href={FINAL_CTA.href}
      onClick={(e) => {
        track('cta_click', { cta: 'final_start_project', href: FINAL_CTA.href })
        hrefClick(e, FINAL_CTA.href)
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y, skewX }}
      data-cursor="start"
      className="group relative flex size-40 items-center justify-center overflow-hidden rounded-full bg-cream text-ink md:size-44 lg:size-52"
    >
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-700 ease-(--ease-out-expo) group-hover:translate-y-0 group-focus-visible:translate-y-0"
      />
      <m.span style={{ x: labelX, y: labelY }} className="label relative block overflow-hidden text-[0.8125rem]">
        <span className="block transition-transform duration-500 ease-(--ease-out-expo) group-hover:-translate-y-full group-focus-visible:-translate-y-full">
          {label}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full text-cream transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-y-0 group-focus-visible:translate-y-0"
        >
          {label}
        </span>
      </m.span>
    </m.a>
  )
}
