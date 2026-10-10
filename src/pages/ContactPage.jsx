import { AnimatePresence, m } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BookingCalendar } from '../components/BookingCalendar'
import { Copy } from '../components/Copy'
import { Field, FormStatus, TextAreaField, useLeadForm } from '../components/Form'
import { Ground } from '../components/Ground'
import { MagneticButton } from '../components/MagneticButton'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { whatsappHref } from '../components/WhatsAppButton'
import { BOOKING, CONTACT, FORM_OPTIONS, NEXT_STEPS } from '../data/contact'
import { useHrefClick } from '../hooks/useHrefClick'
import { breadcrumbLd, useSeo } from '../hooks/useSeo'
import { track } from '../utils/analytics'

const EASE = [0.16, 1, 0.3, 1]
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Missing client details show as labelled placeholders while developing, and stay hidden on the live site.
const SHOW_PLACEHOLDERS = import.meta.env.DEV

/** The three parts of the form, and the required fields that complete each. */
const STEPS = [
  { title: 'About you', note: 'So we know who we’re talking to.', fields: ['name', 'email'] },
  { title: 'Your brand', note: 'Where the brand is today.', fields: ['brand'] },
  { title: 'What you need', note: 'What you’d like help with, and the scope.', fields: ['service', 'budget'] },
]

/** Human messages for the required fields. Nothing the visitor typed is ever cleared. */
function check(form) {
  const v = (name) => String(form.elements.namedItem(name)?.value ?? '').trim()
  const errors = {}
  if (!v('name')) errors.name = 'Please tell us your name.'
  if (!v('email')) errors.email = 'Please add your email address.'
  else if (!EMAIL.test(v('email'))) errors.email = 'Please enter a valid email address.'
  if (!v('brand')) errors.brand = 'Please add your brand name or website.'
  if (!v('service')) errors.service = 'Please choose a service.'
  if (!v('budget')) errors.budget = 'Please choose a budget range.'
  return errors
}

const Optional = () => <span className="tracking-normal normal-case text-ink-muted"> (optional)</span>

/** A set of choices as quiet pills — native radios underneath, so keyboard and screen readers just work. */
function Choices({ name, legend, options, required, hint, error }) {
  const id = `f-${name}`
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  return (
    <fieldset className="min-w-0 text-left sm:col-span-2" aria-describedby={describedBy}>
      <legend className="label text-[0.6875rem] text-ink-soft">
        {legend}
        {required ? (
          <span aria-hidden className="text-terracotta">
            {' '}
            *
          </span>
        ) : (
          <Optional />
        )}
      </legend>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="relative">
            <input type="radio" name={name} value={option} aria-invalid={error ? 'true' : undefined} className="peer absolute inset-0 opacity-0" />
            <span className="label inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 bg-cream/70 px-4 text-[0.6875rem] text-ink transition-[background-color,border-color,color] duration-300 peer-hover:border-ink/40 peer-hover:bg-white peer-checked:border-ink peer-checked:bg-ink peer-checked:text-cream peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta peer-aria-[invalid=true]:border-terracotta/60 [&>svg]:hidden peer-checked:[&>svg]:block">
              <Check aria-hidden strokeWidth={2.25} className="size-3.5" />
              {option}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-terracotta-deep">
          {error}
        </p>
      )}
    </fieldset>
  )
}

/** One part of the form: a numbered heading, a one-line reason, then its fields. */
function Step({ index, done, children }) {
  const step = STEPS[index]
  return (
    <fieldset className={`min-w-0 ${index ? 'border-t border-line pt-7 md:pt-9' : ''}`}>
      <legend className="sr-only">
        Step {index + 1} of {STEPS.length}: {step.title}
      </legend>
      <div aria-hidden className="flex items-center gap-4 text-left">
        <span
          className={`label flex size-9 shrink-0 items-center justify-center rounded-full border text-[0.6875rem] tabular-nums transition-colors duration-500 ${done ? 'border-terracotta bg-terracotta text-cream' : 'border-ink/20 bg-white text-terracotta'}`}
        >
          {done ? <Check strokeWidth={2.25} className="size-4" /> : `0${index + 1}`}
        </span>
        <span>
          <span className="block font-display text-h3 leading-tight tracking-[-0.02em]">{step.title}</span>
          <span className="mt-0.5 block text-sm text-ink-muted">{step.note}</span>
        </span>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 md:gap-6">{children}</div>
    </fieldset>
  )
}

/** After a successful send: an honest thank-you and a few real places to go next. */
function Sent({ wa }) {
  const heading = useRef(null)
  const hrefClick = useHrefClick()
  useEffect(() => heading.current?.focus(), [])
  const next = [
    wa && { label: 'Have a quick question?', action: 'Chat on WhatsApp', href: wa, external: true },
    { label: 'Prefer to talk?', action: 'Book a call', href: '#booking' },
    { label: 'While you wait', action: 'See our portfolio', href: '/portfolio' },
    { label: 'Ideas we share', action: 'Read our insights', href: '/insights' },
  ].filter(Boolean)
  return (
    <m.div
      key="sent"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="mt-8 border-t border-line pt-8 text-center md:mt-10 md:text-left"
    >
      <p className="label text-terracotta">Received</p>
      <h3 ref={heading} tabIndex={-1} className="mt-4 text-h2 outline-none">
        Thank you — <span className="italic text-terracotta">we’ve got it.</span>
      </h3>
      <p className="mx-auto mt-4 max-w-md text-lead text-ink-soft md:mx-0">We’ll review your details and get back to you.</p>
      <ul className="mt-8 border-t border-line text-left">
        {next.map((item) => (
          <li key={item.action}>
            <a
              href={item.href}
              onClick={(e) => (item.external ? track('whatsapp_click', { location: 'contact_sent' }) : hrefClick(e, item.href))}
              {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="group flex items-center justify-between gap-6 border-b border-line py-4"
            >
              <span className="label text-[0.625rem] text-ink-muted">{item.label}</span>
              <span className="flex items-center gap-3 font-display text-xl transition-colors group-hover:text-terracotta">
                {item.action}
                <ArrowRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </m.div>
  )
}

/** A row in "Other ways to connect" / "Follow BrandGap": name, what it's best for, and the way in. */
function WayRow({ name, best, action, href, external, onClick, placeholder, plain = false }) {
  const hrefClick = useHrefClick()
  const body = (
    <>
      <span className="font-display text-h3 tracking-[-0.02em] md:col-span-3">{name}</span>
      <span className="text-ink-soft md:col-span-5">{best}</span>
      <span className="flex items-center gap-3 break-all md:col-span-4 md:justify-end">
        {placeholder ? (
          <span className="text-sm text-ink-muted">
            <Copy value={placeholder} />
            <span className="label ml-3 text-[0.625rem] text-terracotta">Placeholder · dev only</span>
          </span>
        ) : (
          <>
            <span className={`text-ink transition-colors group-hover:text-terracotta ${plain ? 'text-sm' : 'label text-[0.6875rem]'}`}>{action}</span>
            {external ? (
              <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-4 shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            ) : (
              <ArrowRight aria-hidden strokeWidth={1.5} className="size-4 shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
            )}
          </>
        )}
      </span>
    </>
  )
  const row = 'group grid gap-2 border-b border-line py-6 text-center md:grid-cols-12 md:items-baseline md:gap-6 md:text-left'
  if (placeholder) return <li className={`${row} opacity-70`}>{body}</li>
  return (
    <li>
      <a
        href={href}
        onClick={(e) => {
          onClick?.()
          if (!external) hrefClick(e, href)
        }}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        className={`${row} justify-items-center md:justify-items-stretch`}
      >
        {body}
      </a>
    </li>
  )
}

/**
 * /contact — Start a Project (brief §6). A guided, three-part enquiry form with
 * what happens next beside it; then every other real way in (WhatsApp, email,
 * and phone / booking once supplied), then BrandGap's social channels.
 */
export default function ContactPage() {
  const [tried, setTried] = useState(false)
  const [live, setLive] = useState(null)
  const [done, setDone] = useState([false, false, false])
  // ~4.5s after a send the thank-you gives way to a fresh, empty form (progress and errors cleared too).
  const onReset = useCallback(() => {
    setTried(false)
    setLive(null)
    setDone([false, false, false])
  }, [])
  const { status, errors, onSubmit } = useLeadForm('project-enquiry', { extraValidate: check, onReset })
  const wa = whatsappHref()
  const hrefClick = useHrefClick()
  const shown = live ?? errors
  const errorCount = Object.keys(shown).length

  useSeo({
    title: 'Start a project',
    description: 'Tell us where your brand is today. We’ll help you figure out where it can go — start a project with BrandGap.',
    path: '/contact',
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Start a project with BrandGap' },
      breadcrumbLd([{ name: 'Start a project', path: '/contact' }]),
    ],
  })

  // Calendly / Cal.com embeds announce a booking with a postMessage.
  useEffect(() => {
    if (!BOOKING.url) return
    const onMessage = (e) => {
      const event = typeof e.data === 'object' ? e.data?.event ?? e.data?.type : ''
      if (event === 'calendly.event_scheduled' || event === 'bookingSuccessful') track('calendar_booking', { provider: event.split('.')[0] })
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // As the visitor types: tick off finished parts, and once they've tried to send, clear errors as they're fixed.
  const onInput = useCallback(
    (e) => {
      const found = check(e.currentTarget)
      setDone(STEPS.map((s) => s.fields.every((f) => !found[f])))
      if (tried) setLive(found)
    },
    [tried],
  )
  const submit = useCallback(
    (e) => {
      setTried(true)
      setLive(null)
      onSubmit(e)
    },
    [onSubmit],
  )

  const ways = [
    wa && { id: 'whatsapp', name: 'WhatsApp', best: 'Best for a quick question.', action: 'Chat on WhatsApp', href: wa, external: true, onClick: () => track('whatsapp_click', { location: 'contact' }) },
    CONTACT.email.href && { id: 'email', name: 'Email', best: 'Best for sending details or a brief.', action: CONTACT.email.label, href: CONTACT.email.href, plain: true },
    CONTACT.phone.href
      ? { id: 'phone', name: 'Call us', best: 'Best for a direct conversation.', action: CONTACT.phone.label, href: CONTACT.phone.href, plain: true }
      : SHOW_PLACEHOLDERS && { id: 'phone', name: 'Call us', best: 'Best for a direct conversation.', placeholder: '[Phone number]' },
    { id: 'booking', name: 'Book a call', best: 'Best for booking a meeting.', action: 'Pick a time', href: '#booking' },
  ].filter(Boolean)

  const socials = CONTACT.socials.filter((s) => s.href || SHOW_PLACEHOLDERS)

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Start a project', path: '/contact' }]}
        lead="Start a"
        emphasis="project."
        intro={
          <>
            <span className="block font-display text-h3 italic text-ink">Ready to close the gap?</span>
            <span className="mt-3 block">Tell us where your brand is today. We’ll help you figure out where it can go.</span>
          </>
        }
      />

      <section id="enquiry" aria-labelledby="enquiry-title" className="container-page scroll-mt-24 pb-12 md:pb-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          {/* The guided form */}
          <div className="lg:col-span-7">
            <div className="text-center md:text-left">
              <SectionLabel numeral="01" name="Start a project" />
              <h2 id="enquiry-title" className="mt-5 text-h2 md:mt-7">
                {FORM_OPTIONS.title}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lead text-ink-soft md:mx-0">{FORM_OPTIONS.intro}</p>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {status === 'sent' ? (
                <Sent key="sent" wa={wa} />
              ) : (
                <m.form
                  key="form"
                  noValidate
                  onSubmit={submit}
                  onInput={onInput}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.3 } }}
                  className="mt-8 overflow-hidden rounded-[1rem] border border-ink/10 bg-white/55 shadow-[0_40px_80px_-50px_rgba(28,18,22,0.35)] md:mt-10"
                  aria-describedby="form-required"
                >
                  {/* Card header: what this is, how long it takes, and where you are */}
                  <div className="border-b border-line bg-blush/45 px-5 py-5 sm:px-8 md:px-10">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-left">
                      <p className="label text-ink">Project enquiry</p>
                      <p className="label text-[0.6875rem] text-ink-muted">3 short steps · about 2 minutes</p>
                    </div>
                    <div aria-hidden className="mt-4 grid grid-cols-3 gap-2">
                      {STEPS.map((s, i) => (
                        <span key={s.title} className="flex flex-col gap-2">
                          <span className="relative h-1 overflow-hidden rounded-full bg-ink/10">
                            <span
                              className="absolute inset-0 origin-left rounded-full bg-terracotta transition-transform duration-700 ease-(--ease-out-expo)"
                              style={{ transform: `scaleX(${done[i] ? 1 : 0})` }}
                            />
                          </span>
                          <span className={`label text-left text-[0.625rem] transition-colors duration-500 ${done[i] ? 'text-ink' : 'text-ink-muted'}`}>
                            0{i + 1}
                            <span className="hidden sm:inline"> · {s.title}</span>
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-7 px-5 py-7 sm:px-8 md:gap-9 md:px-10 md:py-10">

                  <Step index={0} done={done[0]}>
                    <Field name="name" label="Your name" autoComplete="name" required error={shown.name} boxed />
                    <Field name="email" label="Email" type="email" autoComplete="email" inputMode="email" required error={shown.email} boxed />
                    <Field
                      name="phone"
                      label={
                        <>
                          Phone / WhatsApp
                          <Optional />
                        </>
                      }
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      boxed
                    />
                  </Step>

                  <Step index={1} done={done[1]}>
                    <Field
                      name="brand"
                      label="Brand name or website"
                      autoComplete="url"
                      placeholder="yourbrand.com"
                      required
                      error={shown.brand}
                      hint="Your website helps us understand where the brand is today."
                      className="sm:col-span-2"
                      boxed
                    />
                    {FORM_OPTIONS.stages ? (
                      <Choices name="stage" legend="Brand stage" options={FORM_OPTIONS.stages} />
                    ) : (
                      <Field
                        name="stage"
                        label={
                          <>
                            Brand stage
                            <Optional />
                          </>
                        }
                        hint="In a few words — where is the brand right now?"
                        className="sm:col-span-2"
                        boxed
                      />
                    )}
                  </Step>

                  <Step index={2} done={done[2]}>
                    <Choices name="service" legend="Service needed" options={FORM_OPTIONS.services} required error={shown.service} />
                    <Choices
                      name="budget"
                      legend="Monthly budget range"
                      options={FORM_OPTIONS.budgets}
                      required
                      hint="This helps us understand the right scope — not to judge the size of your brand."
                      error={shown.budget}
                    />
                    <TextAreaField
                      name="message"
                      label={
                        <>
                          What’s the biggest gap you’re trying to close?
                          <Optional />
                        </>
                      }
                      rows={4}
                      placeholder="e.g. Our ads get clicks but not sales, or we’re launching and need a plan."
                      className="sm:col-span-2"
                      boxed
                    />
                  </Step>

                  </div>

                  <div className="flex flex-col items-center gap-4 border-t border-line bg-cream/60 px-5 py-6 sm:flex-row sm:justify-between sm:px-8 md:px-10">
                    <div className="order-2 text-center sm:order-1 sm:text-left">
                      {tried && errorCount > 0 && (
                        <p role="alert" className="mb-1 text-sm text-terracotta-deep">
                          {errorCount === 1 ? 'One thing to check above before we can start.' : `${errorCount} things to check above before we can start.`}
                        </p>
                      )}
                      <p id="form-required" className="text-xs text-ink-muted">
                        Fields marked <span className="text-terracotta">*</span> are required. We only use your details to reply.
                      </p>
                      <FormStatus status={status === 'sent' ? 'idle' : status} />
                    </div>
                    <div className="order-1 shrink-0">
                      <MagneticButton type="submit" disabled={status === 'sending'} cursor="start" trackAs="contact_submit">
                        {status === 'sending' ? 'Sending…' : 'Start the conversation'}
                      </MagneticButton>
                    </div>
                  </div>
                </m.form>
              )}
            </AnimatePresence>
          </div>

          {/* What happens next — beside the form on larger screens */}
          <aside aria-labelledby="next-title" className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <h2 id="next-title" className="label text-center text-ink-muted md:text-left">
                What happens next
              </h2>
              <ol className="mt-5 border-t border-line">
                {NEXT_STEPS.map((line, i) => (
                  <Reveal as="li" key={line} delay={i * 0.06} className="flex gap-4 border-b border-line py-4">
                    <span className="label pt-1.5 tabular-nums text-terracotta">0{i + 1}</span>
                    <span className="font-display text-xl leading-snug">{line}</span>
                  </Reveal>
                ))}
              </ol>
              <p className="mt-6 text-center text-sm text-ink-soft md:text-left">
                Rather talk it through?{' '}
                <a href="#connect" onClick={(e) => hrefClick(e, '#connect')} className="text-ink underline decoration-terracotta/40 underline-offset-4 transition-colors hover:text-terracotta">
                  Other ways to connect
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Other ways in — only the ones that are real */}
      <section
        id="connect"
        aria-labelledby="connect-title"
        className="container-page scroll-mt-24 pb-12 md:pb-16"
      >
        <div className="border-t border-line pt-10 text-center md:pt-12 md:text-left">
          <SectionLabel numeral="02" name="Other ways to connect" />
          <h2 id="connect-title" className="mt-5 text-h2 md:mt-7">
            Prefer to <span className="italic text-terracotta">talk instead?</span>
          </h2>
        </div>
        <ul className="mt-6 border-t border-line md:mt-8">
          {ways.map((way) => (
            <WayRow key={way.id} {...way} />
          ))}
        </ul>
      </section>

      {/* Book a call: the connected scheduler, or our own request calendar until one is set.
          Its own section so it can sit on the page's blush ground. */}
      <section id="booking" aria-label="Book a call" className="relative isolate scroll-mt-24 section-y">
        <Ground tone="blush" />
        <div className="container-page grid gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="text-center md:text-left lg:col-span-4">
            <p className="label text-ink-muted">Book a call</p>
            <h3 className="mt-4 text-h2">
              {BOOKING.title}
              <span className="text-terracotta">.</span>
            </h3>
            <p className="mx-auto mt-4 max-w-sm text-ink-soft md:mx-0">
              {BOOKING.url ? 'Choose a time that works for you.' : 'Pick a day and a time of day that suits you. We’ll confirm the exact time with you.'}
            </p>
            <ul className="mx-auto mt-6 max-w-sm border-t border-line text-left md:mx-0">
              {[
                ['Phone', CONTACT.phone],
                ['Email', CONTACT.email],
              ].map(([label, c]) =>
                c.href ? (
                  <li key={label} className="flex items-baseline justify-between gap-4 border-b border-line py-3 text-sm">
                    <span className="label text-[0.625rem] text-ink-muted">{label}</span>
                    <a href={c.href} className="-my-3 py-3 text-ink underline-offset-4 transition-colors hover:text-terracotta hover:underline">
                      {c.label}
                    </a>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
          <div className="lg:col-span-8">
            {BOOKING.url ? (
              <iframe src={BOOKING.url} title={BOOKING.title} loading="lazy" className="h-[40rem] w-full rounded-[0.625rem] border border-line bg-cream md:h-[44rem]" />
            ) : (
              <BookingCalendar />
            )}
          </div>
        </div>
      </section>

      {/* Follow BrandGap — real profiles only */}
      {socials.length > 0 && (
        <section aria-labelledby="follow-title" className="container-page pt-12 pb-16 md:pt-16 md:pb-24">
          <div className="text-center md:text-left">
            <SectionLabel numeral="03" name="Follow BrandGap" />
            <h2 id="follow-title" className="mt-5 text-h3 md:mt-7">
              Follow the <span className="italic text-terracotta">gap.</span>
            </h2>
          </div>
          <ul className="mt-6 border-t border-line md:mt-8">
            {socials.map((s) => (
              <WayRow key={s.id} name={s.label} best={s.note ?? ''} action="Follow" href={s.href} external placeholder={s.href ? null : s.placeholder} />
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
