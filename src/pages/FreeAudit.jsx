import { Copy } from '../components/Copy'
import { Field, FormStatus, SelectField, useLeadForm } from '../components/Form'
import { MagneticButton } from '../components/MagneticButton'
import { PageHero } from '../components/PageHero'
import { RoasCalculator } from '../components/RoasCalculator'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { AUDIT_OFFER } from '../data/contact'
import { ROAS_CALCULATOR } from '../data/tools'
import { breadcrumbLd, useSeo } from '../hooks/useSeo'

/**
 * /free-audit — the low-commitment offer (brief §6): a free Meta Ads / Brand
 * audit request, and the ROAS / growth calculator.
 */
export default function FreeAudit() {
  const { status, errors, onSubmit } = useLeadForm('free-audit')

  useSeo({
    title: 'Free audit',
    description: 'Get a free Meta Ads or brand audit from BrandGap, and estimate revenue and break-even ROAS with the growth calculator.',
    path: '/free-audit',
    jsonLd: breadcrumbLd([{ name: 'Free audit', path: '/free-audit' }]),
  })

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Free audit', path: '/free-audit' }]}
        lead="Get a free"
        emphasis="Meta Ads / Brand audit."
        intro={<Copy value={AUDIT_OFFER.details} />}
      />

      <section aria-labelledby="audit-form-title" className="container-page pb-12 md:pb-16">
        <div className="grid gap-8 md:grid-cols-12 md:gap-6">
          <div className="text-center md:col-span-4 md:text-left">
            <SectionLabel numeral="01" name="Request" />
            <h2 id="audit-form-title" className="mt-5 text-h2 md:mt-7">
              Tell us where to look.
            </h2>
          </div>
          <form noValidate onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2 md:col-span-7 md:col-start-6">
            <Field name="name" label="Name" autoComplete="name" required error={errors.name} />
            <Field name="email" label="Email" type="email" autoComplete="email" required error={errors.email} />
            <Field name="website" label="Brand / website URL" type="url" inputMode="url" placeholder="https://" required error={errors.website} />
            <SelectField name="auditType" label="Audit" options={AUDIT_OFFER.types} required error={errors.auditType} />
            <div className="flex flex-col items-center gap-4 sm:col-span-2 sm:items-start">
              <MagneticButton type="submit" disabled={status === 'sending'} cursor="start">
                Request the audit
              </MagneticButton>
              <FormStatus status={status} sentText="Thank you — we'll be in touch about your audit." />
            </div>
          </form>
        </div>
      </section>

      <section id="calculator" aria-labelledby="calculator-title" className="scroll-mt-24 bg-blush">
        <div className="container-page section-y">
          <div className="text-center md:text-left">
            <SectionLabel numeral="02" name="Calculator" className="[&>span:first-child]:text-terracotta-deep" />
            <h2 id="calculator-title" className="mt-5 text-h2 md:mt-7">
              <MaskReveal>ROAS / growth</MaskReveal>
              <MaskReveal delay={0.08} className="italic text-terracotta-deep">
                calculator.
              </MaskReveal>
            </h2>
            <Reveal as="p" delay={0.1} className="mx-auto mt-4 max-w-lg text-lead text-ink-soft md:mx-0">
              {ROAS_CALCULATOR.note}
            </Reveal>
          </div>
          <div className="mt-8 bg-cream md:mt-10 md:pl-8">
            <RoasCalculator />
          </div>
        </div>
      </section>
    </>
  )
}
