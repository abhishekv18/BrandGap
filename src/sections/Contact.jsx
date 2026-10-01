import { AnimatePresence, m, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../animations/gsap'
import { ContactLink } from '../components/ContactLink'
import { SectionLabel } from '../components/SectionLabel'
import { CONTACT, CONTACT_CTA } from '../data/contact'
import { useCapabilities } from '../hooks/useCapabilities'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Chapter VI — Action.
 * The terracotta field opens from a thin band — the gap, widening into the
 * final chapter — and the page asks its one question.
 */
export function Contact() {
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
      id="contact"
      ref={root}
      aria-labelledby="contact-title"
      data-theme="terracotta"
      data-cursor-invert
      className="relative isolate overflow-hidden text-cream"
    >
      <div data-field aria-hidden className="absolute inset-0 -z-10 bg-terracotta" />

      <div className="container-page section-y flex min-h-svh flex-col justify-between gap-10 text-center md:gap-12 md:text-left">
        <SectionLabel data-contact-fade numeral="VI" name="Action" tone="light" />

        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-8">
            <h2
              id="contact-title"
              data-contact-fade
              className="text-display"
            >
              {CONTACT_CTA.headline}
            </h2>
            <p data-contact-fade className="mt-4 font-display text-h2 italic text-cream/85 md:mt-6">
              {CONTACT_CTA.subline}
            </p>
          </div>
          <div data-contact-fade className="flex justify-center md:col-span-4">
            <StartButton />
          </div>
        </div>

        <div data-contact-fade className="grid gap-6 border-t border-line-light pt-6 text-sm sm:grid-cols-3">
          <div>
            <p className="label mb-2 text-cream">Write</p>
            <ContactLink label={CONTACT.email.label} href={CONTACT.email.href} />
          </div>
          <div>
            <p className="label mb-2 text-cream">Follow</p>
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
  const ref = useRef(null)
  const [note, setNote] = useState(false)
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

  const Tag = CONTACT_CTA.href ? m.a : m.button
  const linkProps = CONTACT_CTA.href
    ? { href: CONTACT_CTA.href }
    : { type: 'button', onClick: () => setNote(true), 'aria-describedby': 'start-note' }

  const label = (
    <span className="flex items-center gap-2">
      {CONTACT_CTA.label}
      <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-4" />
    </span>
  )

  return (
    <div className="flex flex-col items-center gap-4">
      <Tag
        ref={ref}
        {...linkProps}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ x, y, skewX }}
        data-cursor="start"
        className="group relative flex size-44 items-center justify-center overflow-hidden rounded-full bg-cream text-ink md:size-56 lg:size-64"
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
      </Tag>

      {!CONTACT_CTA.href && (
        <div id="start-note" className="min-h-6 text-sm text-cream" aria-live="polite">
          <AnimatePresence>
            {note && (
              <m.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="underline decoration-dotted underline-offset-4"
              >
                {CONTACT_CTA.pendingNote}
              </m.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
