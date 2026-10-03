import { ArrowRight } from 'lucide-react'
import { NEWSLETTER } from '../data/contact'
import { track } from '../utils/analytics'
import { Field, FormStatus, useLeadForm } from './Form'

/** "The Gap Weekly" signup (brief §7) — footer and Insights. */
export function NewsletterForm({ tone = 'dark', id = 'newsletter', className = '' }) {
  const { status, errors, onSubmit } = useLeadForm('newsletter', {
    onDone: (s) => s === 'sent' && track('newsletter_signup'),
  })
  const light = tone === 'light'

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby={`${id}-title`} className={className}>
      <p id={`${id}-title`} className={`font-display text-h3 ${light ? 'text-cream' : 'text-ink'}`}>
        {NEWSLETTER.name}
      </p>
      <p className={`mt-2 text-sm ${light ? 'text-cream/70' : 'text-ink-soft'}`}>{NEWSLETTER.line}</p>
      <div className="mt-3 flex items-start gap-3">
        <Field
          name="email"
          id={`${id}-email`}
          label="Email"
          type="email"
          autoComplete="email"
          required
          tone={tone}
          error={errors.email}
          className="flex-1"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          aria-label="Subscribe"
          className={`mt-[1.125rem] flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 disabled:opacity-50 ${
            light ? 'bg-cream text-ink hover:bg-terracotta hover:text-cream' : 'bg-ink text-cream hover:bg-terracotta'
          }`}
        >
          <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
        </button>
      </div>
      <FormStatus status={status} tone={tone} sentText="You're on the list." className="mt-3" />
    </form>
  )
}
