import { m } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { BOOKING, CONTACT, WHATSAPP } from '../data/contact'
import { track } from '../utils/analytics'
import { leadsConnected, submitLead } from '../utils/leads'
import { Field } from './Form'
import { MagneticButton } from './MagneticButton'

const EASE = [0.16, 1, 0.3, 1]
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const fmtMonth = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' })
const fmtDay = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
const fmtFull = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const sameDay = (a, b) => a && b && a.getTime() === b.getTime()

/** The month as a Monday-first grid: leading blanks, then each day. */
function monthCells(month) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const lead = (first.getDay() + 6) % 7
  return [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))]
}

/** A small numbered step heading inside the panel. */
function StepTitle({ n, children, id }) {
  return (
    <p id={id} className="label flex items-center gap-3 text-[0.6875rem] text-ink-soft">
      <span className="tabular-nums text-terracotta">0{n}</span>
      {children}
    </p>
  )
}

/**
 * Book a call (brief §6). With a Calendly / Cal.com URL in data/contact.js the
 * page embeds that instead; until then this calendar collects a preferred day
 * and time of day and sends it as a request — through the leads endpoint when
 * it is connected, otherwise as a pre-written WhatsApp message (or email).
 */
export function BookingCalendar() {
  const today = useMemo(() => startOfDay(new Date()), [])
  const first = addDays(today, 1)
  const last = addDays(today, BOOKING.daysAhead)
  const [month, setMonth] = useState(() => new Date(first.getFullYear(), first.getMonth(), 1))
  const [day, setDay] = useState(null)
  const [time, setTime] = useState(null)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle') // idle | sending | sent | opened | error

  const cells = useMemo(() => monthCells(month), [month])
  const canPrev = month > new Date(first.getFullYear(), first.getMonth(), 1)
  const canNext = new Date(month.getFullYear(), month.getMonth() + 1, 1) <= last
  const when = day && time ? `${fmtDay.format(day)} · ${time} (${BOOKING.timezone})` : null

  const message = (name) =>
    [`Hi BrandGap, I'd like to book a 20-min strategy call.`, `Preferred: ${fmtFull.format(day)}, ${time.toLowerCase()} (${BOOKING.timezone}).`, `Name: ${name}`].join('\n')

  const request = async (e) => {
    const form = e.currentTarget.closest('form') ?? document.getElementById('booking-form')
    const name = String(form?.elements.namedItem('callName')?.value ?? '').trim()
    const contact = String(form?.elements.namedItem('callContact')?.value ?? '').trim()
    const found = {}
    if (!day) found.day = 'Please pick a day.'
    if (!time) found.time = 'Please choose a time of day.'
    if (!name) found.name = 'Please add your name.'
    if (leadsConnected && !contact) found.contact = 'Please add a phone number or email so we can confirm.'
    setErrors(found)
    if (Object.keys(found).length) return

    if (leadsConnected) {
      setState('sending')
      const res = await submitLead('call-request', { name, contact, day: fmtFull.format(day), time, timezone: BOOKING.timezone })
      setState(res.ok ? 'sent' : 'error')
      return
    }
    const wa = WHATSAPP.number ? `https://wa.me/${WHATSAPP.number}?text=${encodeURIComponent(message(name))}` : null
    track('call_request', { method: wa ? 'whatsapp' : 'email' })
    if (wa) window.open(wa, '_blank', 'noopener')
    else window.location.href = mailto(name)
    setState('opened')
  }

  const mailto = (name) =>
    `${CONTACT.email.href}?subject=${encodeURIComponent('Strategy call request')}&body=${encodeURIComponent(message(name || '…'))}`

  if (state === 'sent' || state === 'opened') {
    return (
      <m.div
        key="done"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        role="status"
        className="flex min-h-[22rem] flex-col items-center justify-center gap-4 rounded-[0.625rem] border border-line bg-[#F7EFE9] p-8 text-center"
      >
        <p className="label text-terracotta">{state === 'sent' ? 'Request received' : 'Almost done'}</p>
        <p className="max-w-md font-display text-h3">
          {state === 'sent' ? 'Thank you — we’ll confirm the time with you.' : 'Send the message in WhatsApp and we’ll confirm the time with you.'}
        </p>
        <p className="text-sm text-ink-soft">{when}</p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="label mt-2 min-h-11 text-[0.6875rem] text-ink underline decoration-terracotta/40 underline-offset-4 hover:text-terracotta"
        >
          Change the request
        </button>
      </m.div>
    )
  }

  return (
    <form
      id="booking-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        request(e)
      }}
      aria-label="Request a strategy call"
      className="grid overflow-hidden rounded-[0.625rem] border border-line bg-[#F7EFE9] md:grid-cols-[1.15fr_1fr]"
    >
      {/* 01 — the day */}
      <div className="border-b border-line p-5 sm:p-6 md:border-r md:border-b-0 xl:p-8">
        <StepTitle n={1} id="pick-day">
          Pick a day
        </StepTitle>
        <div className="mt-5 flex items-center justify-between">
          <p className="font-display text-h3" aria-live="polite">
            {fmtMonth.format(month)}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous month"
              disabled={!canPrev}
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
              className="flex size-10 items-center justify-center rounded-full border border-line transition-colors hover:border-ink disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft aria-hidden strokeWidth={1.5} className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next month"
              disabled={!canNext}
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
              className="flex size-10 items-center justify-center rounded-full border border-line transition-colors hover:border-ink disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight aria-hidden strokeWidth={1.5} className="size-4" />
            </button>
          </div>
        </div>
        <div aria-hidden className="mt-5 grid grid-cols-7 text-center">
          {WEEKDAYS.map((d) => (
            <span key={d} className="label text-[0.625rem] text-ink-muted">
              {d}
            </span>
          ))}
        </div>
        <div role="group" aria-labelledby="pick-day" className="mt-2 grid grid-cols-7 gap-y-1 text-center">
          {cells.map((date, i) => {
            if (!date) return <span key={`blank-${i}`} />
            const off = date < first || date > last
            const selected = sameDay(date, day)
            const isToday = sameDay(date, today)
            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={off}
                aria-pressed={selected ? 'true' : 'false'}
                aria-label={`${fmtFull.format(date)}${off ? ' — not available to request' : ''}`}
                onClick={() => {
                  setDay(date)
                  setErrors((e) => ({ ...e, day: undefined }))
                }}
                className={`relative mx-auto flex size-10 items-center justify-center rounded-full text-sm tabular-nums transition-colors duration-300 sm:size-11 ${
                  selected ? 'bg-ink text-cream' : off ? 'cursor-not-allowed text-ink-muted/40' : 'text-ink hover:bg-ink/[0.06]'
                }`}
              >
                {date.getDate()}
                {isToday && <span aria-hidden className="absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-terracotta" />}
              </button>
            )
          })}
        </div>
        {errors.day && <p className="mt-3 text-xs text-terracotta-deep">{errors.day}</p>}
      </div>

      {/* 02 — the time, 03 — who and send */}
      <div className="flex flex-col gap-7 p-5 sm:p-6 xl:p-8">
        <fieldset>
          <legend>
            <StepTitle n={2}>Choose a time of day ({BOOKING.timezone})</StepTitle>
          </legend>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {BOOKING.windows.map((w) => (
              <label key={w} className="relative">
                <input
                  type="radio"
                  name="callTime"
                  value={w}
                  checked={time === w}
                  onChange={() => {
                    setTime(w)
                    setErrors((e) => ({ ...e, time: undefined }))
                  }}
                  className="peer absolute inset-0 opacity-0"
                />
                <span className="label flex min-h-11 items-center justify-center rounded-full border border-ink/25 px-2 text-[0.625rem] text-ink transition-colors duration-300 peer-hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-cream peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta">
                  {w}
                </span>
              </label>
            ))}
          </div>
          {errors.time && <p className="mt-3 text-xs text-terracotta-deep">{errors.time}</p>}
        </fieldset>

        <div className="flex flex-col gap-5">
          <StepTitle n={3}>Your details</StepTitle>
          <Field name="callName" label="Your name" autoComplete="name" required error={errors.name} />
          {leadsConnected && (
            <Field name="callContact" label="Phone or email" autoComplete="tel" required error={errors.contact} />
          )}
        </div>

        <div className="mt-auto flex flex-col gap-4 border-t border-line pt-5">
          <p aria-live="polite" className="min-h-6 text-sm text-ink-soft">
            {when ? (
              <>
                <span className="label mr-2 text-[0.625rem] text-ink-muted">Your request</span>
                <span className="text-ink">{when}</span>
              </>
            ) : (
              'Pick a day and a time of day to continue.'
            )}
          </p>
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <MagneticButton type="submit" disabled={state === 'sending'} cursor="start" trackAs="booking_request" className="whitespace-nowrap">
              {state === 'sending' ? 'Sending…' : leadsConnected ? 'Request this time' : 'Request on WhatsApp'}
            </MagneticButton>
            {!leadsConnected && (
              <a
                href={CONTACT.email.href}
                onClick={(e) => {
                  e.preventDefault()
                  const name = String(e.currentTarget.closest('form')?.elements.namedItem('callName')?.value ?? '').trim()
                  if (!day || !time) {
                    setErrors({ day: day ? undefined : 'Please pick a day.', time: time ? undefined : 'Please choose a time of day.' })
                    return
                  }
                  track('call_request', { method: 'email' })
                  window.location.href = mailto(name)
                }}
                className="label min-h-11 content-center whitespace-nowrap text-[0.625rem] text-ink-soft underline decoration-terracotta/40 underline-offset-4 hover:text-terracotta"
              >
                Or send by email
              </a>
            )}
          </div>
          <p className="text-xs text-ink-muted">This is a request — we’ll confirm the exact time with you.</p>
          {state === 'error' && (
            <p role="alert" className="text-xs text-terracotta-deep">
              Something went wrong. Please try again, or call {CONTACT.phone.label}.
            </p>
          )}
        </div>
      </div>
    </form>
  )
}
