import { AnimatePresence, m } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useCallback, useState } from 'react'
import { CONTACT } from '../data/contact'
import { submitLead } from '../utils/leads'
import { ContactLink } from './ContactLink'

const EASE = [0.16, 1, 0.3, 1]

const TONE = {
  dark: {
    label: 'text-ink-soft',
    input: 'border-ink/25 text-ink placeholder:text-ink-muted/70 focus:border-terracotta',
    error: 'text-terracotta-deep',
  },
  light: {
    label: 'text-cream/80',
    input: 'border-cream/35 text-cream placeholder:text-cream/45 focus:border-cream',
    error: 'text-blush',
  },
}

const inputBase =
  'w-full rounded-none border-b bg-transparent py-2.5 text-base outline-none transition-colors duration-300 aria-[invalid=true]:border-terracotta'

/** A labelled text input with an inline error. Editorial: a single underline, no boxes. */
export function Field({ name, id: idProp, label, type = 'text', required, error, hint, tone = 'dark', className = '', ...rest }) {
  const t = TONE[tone]
  const id = idProp ?? `f-${name}`
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined
  return (
    <div className={`flex flex-col text-left ${className}`}>
      <label htmlFor={id} className={`label text-[0.6875rem] ${t.label}`}>
        {label}
        {required && (
          <span aria-hidden className="text-terracotta">
            {' '}
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={`${inputBase} ${t.input}`}
        {...rest}
      />
      {hint && (
        <p id={`${id}-hint`} className={`mt-2 text-xs ${t.label}`}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={`mt-2 text-xs ${t.error}`}>
          {error}
        </p>
      )}
    </div>
  )
}

/** A labelled native select, styled to match Field. */
export function SelectField({ name, id: idProp, label, options, required, error, placeholder = 'Choose one', tone = 'dark', className = '', ...rest }) {
  const t = TONE[tone]
  const id = idProp ?? `f-${name}`
  return (
    <div className={`flex flex-col text-left ${className}`}>
      <label htmlFor={id} className={`label text-[0.6875rem] ${t.label}`}>
        {label}
        {required && (
          <span aria-hidden className="text-terracotta">
            {' '}
            *
          </span>
        )}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          required={required}
          defaultValue=""
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputBase} ${t.input} appearance-none pr-8`}
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden strokeWidth={1.5} className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2" />
      </div>
      {error && (
        <p id={`${id}-error`} className={`mt-2 text-xs ${t.error}`}>
          {error}
        </p>
      )}
    </div>
  )
}

/** A labelled multi-line field, styled to match Field. */
export function TextAreaField({ name, id: idProp, label, required, error, tone = 'dark', rows = 3, className = '', ...rest }) {
  const t = TONE[tone]
  const id = idProp ?? `f-${name}`
  return (
    <div className={`flex flex-col text-left ${className}`}>
      <label htmlFor={id} className={`label text-[0.6875rem] ${t.label}`}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        className={`${inputBase} ${t.input} resize-y`}
        {...rest}
      />
    </div>
  )
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Required + email checks, returning { field: message }. */
export function validate(form, extra) {
  const errors = {}
  Array.from(form.elements).forEach((el) => {
    if (!el.name) return
    const value = String(el.value ?? '').trim()
    if (el.required && !value) errors[el.name] = 'Required'
    else if (el.type === 'email' && value && !EMAIL.test(value)) errors[el.name] = 'Enter a valid email address'
  })
  return { ...errors, ...(extra?.(form) ?? {}) }
}

/**
 * Submits a form through utils/leads.js.
 * status: idle | sending | sent | pending (no endpoint yet) | error
 */
export function useLeadForm(type, { extraValidate, onDone } = {}) {
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      const form = e.currentTarget
      const found = validate(form, extraValidate)
      setErrors(found)
      if (Object.keys(found).length) {
        const first = form.elements.namedItem(Object.keys(found)[0])
        if (first && 'focus' in first) first.focus()
        return
      }
      setStatus('sending')
      const data = Object.fromEntries(new FormData(form).entries())
      const res = await submitLead(type, data)
      const next = res.ok ? 'sent' : res.pending ? 'pending' : 'error'
      setStatus(next)
      onDone?.(next, data)
    },
    [type, extraValidate, onDone],
  )

  return { status, errors, onSubmit }
}

/** The announcement after a submit — always polite, always honest about what happened. */
export function FormStatus({ status, sentText = "Thank you — we'll be in touch shortly.", tone = 'dark', className = '' }) {
  const muted = tone === 'light' ? 'text-cream/80' : 'text-ink-soft'
  return (
    <div aria-live="polite" className={`min-h-6 text-sm ${muted} ${className}`}>
      <AnimatePresence mode="wait">
        {status !== 'idle' && status !== 'sending' && (
          <m.p key={status} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
            {status === 'sent' && sentText}
            {status === 'pending' && (
              <>
                <span className="underline decoration-dotted underline-offset-4">[Form endpoint to be connected]</span> — nothing
                was sent. Until then, write to <ContactLink label={CONTACT.email.label} href={CONTACT.email.href} className="underline" />.
              </>
            )}
            {status === 'error' && (
              <>
                Something went wrong. Please try again, or write to{' '}
                <ContactLink label={CONTACT.email.label} href={CONTACT.email.href} className="underline" />.
              </>
            )}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  )
}
