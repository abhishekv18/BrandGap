import { CalendarDays, MessageCircle } from 'lucide-react'
import { useEffect } from 'react'
import { ContactLink } from '../components/ContactLink'
import { Copy } from '../components/Copy'
import { Field, FormStatus, SelectField, TextAreaField, useLeadForm } from '../components/Form'
import { MagneticButton } from '../components/MagneticButton'
import { PageHero } from '../components/PageHero'
import { SectionLabel } from '../components/SectionLabel'
import { whatsappHref } from '../components/WhatsAppButton'
import { BOOKING, CONTACT, FINAL_CTA, FORM_OPTIONS, WHATSAPP } from '../data/contact'
import { SERVICES } from '../data/services'
import { breadcrumbLd, useSeo } from '../hooks/useSeo'
import { track } from '../utils/analytics'

const SERVICE_OPTIONS = [...SERVICES.map((s) => s.name), FORM_OPTIONS.notSure]

/**
 * /contact — Start a Project (brief §6): the smart enquiry form (its fields
 * filter low-quality leads), the 20-minute strategy call, and WhatsApp.
 */
export default function ContactPage() {
  const { status, errors, onSubmit } = useLeadForm('project-enquiry')
  const wa = whatsappHref()

  useSeo({
    title: 'Start a project',
    description: FINAL_CTA.body,
    path: '/contact',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Start a project with BrandGap',
      },
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

  return (
    <>
      <PageHero crumbs={[{ name: 'Start a project', path: '/contact' }]} lead="Start a" emphasis="project." intro={FINAL_CTA.body} />

      <section aria-labelledby="enquiry-title" className="container-page pb-12 md:pb-16">
        <div className="grid gap-12 md:grid-cols-12 md:gap-6">
          {/* The smart form */}
          <div className="md:col-span-7">
            <div className="text-center md:text-left">
              <SectionLabel numeral="01" name="Enquiry" />
              <h2 id="enquiry-title" className="mt-5 text-h2 md:mt-7">
                Where is your brand today?
              </h2>
            </div>
            <form noValidate onSubmit={onSubmit} className="mt-8 grid gap-6 sm:grid-cols-2">
              <Field name="name" label="Name" autoComplete="name" required error={errors.name} />
              <Field name="email" label="Email" type="email" autoComplete="email" required error={errors.email} />
              <Field name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" />
              <Field name="website" label="Brand / website URL" type="url" inputMode="url" placeholder="https://" required error={errors.website} />
              <SelectField name="service" label="Service needed" options={SERVICE_OPTIONS} required error={errors.service} />
              <SelectField name="budget" label="Monthly budget range" options={FORM_OPTIONS.budgets} required error={errors.budget} />
              <SelectField name="stage" label="Brand stage" options={FORM_OPTIONS.stages} className="sm:col-span-2" />
              <TextAreaField name="message" label="Anything else we should know?" className="sm:col-span-2" />
              <div className="flex flex-col items-center gap-4 sm:col-span-2 sm:items-start">
                <MagneticButton type="submit" disabled={status === 'sending'} cursor="start" trackAs="contact_submit">
                  Send enquiry
                </MagneticButton>
                <FormStatus status={status} />
              </div>
            </form>
          </div>

          {/* Other ways in */}
          <aside className="flex flex-col gap-4 md:col-span-4 md:col-start-9" aria-label="Other ways to reach us">
            <div id="booking" className="scroll-mt-28 border border-line p-5 md:p-6">
              <p className="label flex items-center gap-3 text-ink-muted">
                <CalendarDays aria-hidden strokeWidth={1.5} className="size-4 text-terracotta" /> 02 — Call
              </p>
              <h2 className="mt-4 font-display text-h3">{BOOKING.title}</h2>
              {BOOKING.url ? (
                <iframe
                  src={BOOKING.url}
                  title={BOOKING.title}
                  loading="lazy"
                  className="mt-5 h-[34rem] w-full border-0 bg-cream"
                />
              ) : (
                <div className="mt-5 flex aspect-[16/10] items-center justify-center bg-blush p-5 text-center text-sm">
                  <Copy value={BOOKING.placeholder} />
                </div>
              )}
            </div>

            <div className="border border-line p-5 md:p-6">
              <p className="label flex items-center gap-3 text-ink-muted">
                <MessageCircle aria-hidden strokeWidth={1.5} className="size-4 text-terracotta" /> 03 — WhatsApp
              </p>
              <p className="mt-4 text-ink-soft">Prefer to talk it through? Message us directly.</p>
              <div className="mt-5">
                {wa ? (
                  <MagneticButton href={wa} variant="ink" onClick={() => track('whatsapp_click', { location: 'contact' })}>
                    Chat on WhatsApp
                  </MagneticButton>
                ) : (
                  <p className="text-sm">
                    <Copy value={WHATSAPP.placeholder} />
                  </p>
                )}
              </div>
            </div>

            <div className="border border-line p-5 md:p-6">
              <p className="label text-ink-muted">04 — Write</p>
              <p className="mt-4 break-all">
                <ContactLink label={CONTACT.email.label} href={CONTACT.email.href} />
              </p>
              <p className="mt-2 text-sm">
                <ContactLink label={CONTACT.phone.label} href={CONTACT.phone.href} placeholder="[Phone]" />
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
