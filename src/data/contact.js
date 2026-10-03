/**
 * Contact, conversion and footer details. Anything not supplied by BrandGap
 * is a placeholder: fill in the value (or `href`) to go live — no component
 * changes needed.
 */

// IX — Final CTA. Copy from the Website Development Brief §4 (section 09).
export const FINAL_CTA = {
  headline: 'Ready to close the gap?',
  body: "Tell us where your brand is today. We'll help you figure out where it can go.",
  label: 'Start a project',
  href: '/contact',
  // The lower-commitment route for visitors not ready to start (brief §6).
  secondary: { label: 'Get your Gap Score', href: '/gap-score' },
}

export const CONTACT = {
  email: { label: 'agrawalabhishek723@gmail.com', href: 'mailto:agrawalabhishek723@gmail.com' },
  phone: { label: '[Phone]', href: null },
  socials: [
    { id: 'instagram', label: 'Instagram', href: null, placeholder: '[Instagram URL]' },
    { id: 'linkedin', label: 'LinkedIn', href: null, placeholder: '[LinkedIn URL]' },
  ],
}

/**
 * Sticky WhatsApp button (brief §6). number: digits only, with country code,
 * e.g. '91XXXXXXXXXX'. While null the button explains that it is not connected.
 */
export const WHATSAPP = {
  number: null,
  placeholder: '[WhatsApp number]',
  message: "Hi BrandGap, I'd like to talk about growing my brand.",
}

/**
 * Booking calendar (brief §6). url: a Calendly or Cal.com embed URL.
 * While null the page shows a labelled placeholder panel.
 */
export const BOOKING = {
  title: 'Book a 20-min strategy call',
  url: null,
  placeholder: '[Booking calendar — Calendly / Cal.com embed URL]',
}

// Brief §7 — newsletter in footer and blog.
export const NEWSLETTER = {
  name: 'The Gap Weekly',
  line: 'Ad teardowns, Meta Ads playbooks and creative breakdowns.',
}

/**
 * Smart contact form options (brief §6). Budget ranges, brand stages and the
 * minimum qualifier are BrandGap's to define — placeholders until then.
 */
export const FORM_OPTIONS = {
  budgets: ['[Budget range 1]', '[Budget range 2]', '[Budget range 3]', '[Budget range 4]'],
  stages: ['[Brand stage 1]', '[Brand stage 2]', '[Brand stage 3]'],
  notSure: 'Not sure yet',
}

// Brief §7 — free audit offer.
export const AUDIT_OFFER = {
  title: 'Get a free Meta Ads / Brand audit.',
  types: ['Meta Ads audit', 'Brand audit'],
  details: '[Audit offer details]',
}

// Brand guidelines p.1 and p.14.
export const FOOTER = {
  tagline: 'Where brand becomes growth.',
  origin: 'Built in India · Made for the world',
  // Brief §4 — optional availability line.
  availability: 'Every brand has a gap. Let’s find yours.',
  year: 2026,
}
