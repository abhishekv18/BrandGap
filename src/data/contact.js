/**
 * Contact, conversion and footer details. Anything not supplied by BrandGap
 * is a placeholder: fill in the value (or `href`) to go live — no component
 * changes needed.
 */

// Final CTA. Copy from the Website Content Brief §14.
export const FINAL_CTA = {
  headline: 'Ready to close your growth gap?',
  body: 'Tell us where your business is today, where you want to go, and what is holding you back. Let’s identify the opportunity and build a strategy around it.',
  label: 'Start a conversation',
  href: '/contact',
  secondary: { label: 'View our work', href: '/portfolio' },
}

export const CONTACT = {
  email: { label: 'contact@brandgap.co', href: 'mailto:contact@brandgap.co' },
  phone: { label: '+91 9625802011', href: 'tel:+919625802011' },
  // `note` is the one-line description on the contact page's "Follow BrandGap" list.
  // BrandGap's one social channel. Add more here later and they appear in the footer, CTA and contact page.
  socials: [
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/brand-gap/', note: 'Strategy, growth and BrandGap thinking.' },
  ],
}

/**
 * Sticky WhatsApp button (brief §6). number: digits only, with country code,
 * e.g. '91XXXXXXXXXX'. While null the button explains that it is not connected.
 */
export const WHATSAPP = {
  number: 919625802011,
  placeholder: '[WhatsApp number]',
  message: "Hi BrandGap, I'd like to talk about growing my brand.",
}

/**
 * Booking calendar (brief §6). url: a Calendly or Cal.com embed URL.
 * While null the page shows a labelled placeholder panel.
 */
export const BOOKING = {
  title: 'Book a 30-min strategy call',
  // Calendly inline embed, themed to the site: cream ground, ink text, terracotta accents.
  url: 'https://calendly.com/brandsgap/30min?embed_type=Inline&embed_domain=brand-gap.vercel.app&hide_gdpr_banner=1&hide_event_type_details=1&hide_landing_page_details=1&background_color=f4e9e1&text_color=1a1a1a&primary_color=a8483a',
  placeholder: '[Booking calendar — Calendly / Cal.com embed URL]',
  // Until `url` is set, the page shows its own calendar: visitors pick a day and a
  // time of day, and send it as a request that BrandGap confirms. No slots are
  // promised — these are preferences, not availability.
  windows: ['Morning', 'Afternoon', 'Evening'],
  timezone: 'IST',
  daysAhead: 30,
}

// Brief §7 — newsletter in footer and blog.
export const NEWSLETTER = {
  name: 'The Gap Weekly',
  line: 'Ad teardowns, Meta Ads playbooks and creative breakdowns.',
}

/**
 * Start-a-project form (Content Brief §14): name, email, phone, brand/website,
 * service, monthly budget and brand stage.
 */
export const FORM_OPTIONS = {
  title: 'Let’s start with the essentials.',
  intro: 'Tell us a little about your brand, your goals and where you’re stuck. It only takes a few minutes.',
  budgets: ['Under ₹25K', '₹25K–₹50K', '₹50K–₹1L', '₹1L–₹5L', '₹5L+'],
  services: ['Brand Strategy', 'Performance Marketing', 'Content & Creative', 'E-commerce Growth', 'Social Growth'],
  /**
   * Brand-stage choices — not supplied yet. While null, the form asks for the
   * stage in a few words (optional); add the approved options here, e.g.
   * ['…', '…', '…'], and the field becomes a set of choices automatically.
   */
  stages: null,
  stagesPlaceholder: '[Brand stage options — to be confirmed by BrandGap]',
}

/**
 * "What happens next" beside the form. Neutral on purpose: no response times
 * or steps that BrandGap has not confirmed.
 */
export const NEXT_STEPS = [
  'You tell us where your brand is today.',
  'We review the details and the opportunity.',
  'We come back with the right next step.',
]

// Brief §7 — free audit offer.
export const AUDIT_OFFER = {
  title: 'Get a free Meta Ads / Brand audit.',
  types: ['Meta Ads audit', 'Brand audit'],
  details: '[Audit offer details]',
}

// Content Brief §14 — footer. Origin line: brand guidelines p.14.
export const FOOTER = {
  tagline: 'Where Brand Becomes Growth.',
  line: 'Strategy × Creativity × Performance',
  services: [
    { to: '/services/performance-marketing', label: 'Performance Marketing' },
    { to: '/services#brand-creative-strategy', label: 'Brand Strategy' },
    { to: '/services#brand-creative-strategy', label: 'Creative', key: 'creative' },
    { to: '/services#ecommerce-growth', label: 'E-commerce Growth' },
    { to: '/services/social-media', label: 'Social Media' },
    { to: '/services#website-conversion', label: 'Web & Conversion' },
    { to: '/services#growth-analytics', label: 'Analytics' },
  ],
  company: [
    { to: '/about', label: 'About' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/#approach', label: 'Process' },
    { to: '/insights', label: 'Insights' },
    { to: '/contact', label: 'Contact' },
  ],
  origin: 'Built in India · Made for the world',
  // Brief §4 — optional availability line.
  availability: 'Every brand has a gap. Let’s find yours.',
  year: 2026,
}
