/**
 * Clients & testimonials. The brands themselves are listed in
 * data/brands.js (no logo wall).
 *
 * DRAFT CONTENT — the quotes below were written by the site team as
 * proposed wording. They are not yet the clients' own words. Send each one
 * to the client for approval or edits, then fill in the real person's name
 * and role, and remove `demo: true`. While any entry has `demo: true` the
 * section shows a "Sample testimonials" note. Results quote the case-study
 * figures from the Website Content Brief (§07).
 */
export const CLIENTS_INTRO = {
  title: "Trusted by brands building what's next.",
}

export const TESTIMONIALS = [
  {
    id: 't-decorshed',
    demo: true,
    quote:
      'BrandGap treated our ad account like a business. Paid traffic finally turned into steady, profitable orders.',
    name: 'The Decorshed',
    role: 'Founder',
    company: 'Home Décor & Lifestyle',
    result: '3.33X ROAS',
  },
  {
    id: 't-vibha',
    demo: true,
    quote:
      'They understood what our products mean to customers and scaled only what worked.',
    name: 'Vibha Designs',
    role: 'Founder',
    company: 'Spiritual & Devotional D2C',
    result: '3.41X ROAS',
  },
  {
    id: 't-global-ayurveda',
    demo: true,
    quote:
      'Clear campaigns, honest reporting and a team focused on growing the business, not the dashboard.',
    name: 'Global Ayurveda',
    role: 'Founder',
    company: 'Wellness / D2C',
    result: 'Product campaigns',
  },
]

/** True while any testimonial is still draft content. */
export const HAS_DEMO_TESTIMONIALS = TESTIMONIALS.some((t) => t.demo)
