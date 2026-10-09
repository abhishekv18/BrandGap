/**
 * About BrandGap, and the /about page.
 * Statement, story, closing line, values and audience come from the Website
 * Content Brief §11–12. The brand speaks as "we" — no personal bios.
 * Anything else not yet supplied stays a placeholder.
 */

// Content Brief §12 — headline.
export const ABOUT_STATEMENT = {
  lead: 'We believe every brand ',
  emphasis: 'has a gap.',
}

// Content Brief §12 — the story, in its own words.
export const ABOUT_STORY = {
  between:
    'Somewhere between where a business is today and where it wants to be. Between how a brand looks and how it is perceived. Between attention and conversion. Between marketing activity and measurable growth.',
  exists: 'BrandGap exists to close that gap.',
  body: [
    'We are a growth focused digital agency combining strategy, creative, performance marketing and technology to help ambitious brands build stronger digital businesses. Our team works across performance advertising, e-commerce, social media, content, creative strategy, websites and conversion optimization.',
    'We do not believe in one size fits all marketing. Every business has a different audience, challenge and growth opportunity, and our role is to understand it, build the right strategy and keep improving what works.',
  ],
  closing: { lead: 'Your brand shouldn’t just exist online.', emphasis: 'It should grow there.' },
}

// Content Brief §12 — values.
export const VALUES = [
  { id: 'beyond-campaign', name: 'Think Beyond the Campaign', text: 'A campaign is one part of the growth system.' },
  { id: 'data-context', name: 'Data With Context', text: 'Understanding why numbers move matters more.' },
  { id: 'creativity-purpose', name: 'Creativity With Purpose', text: 'Every creative has a reason.' },
  { id: 'execution', name: 'Execution Matters', text: 'Great strategy needs strong execution.' },
  { id: 'improve', name: 'Always Improve', text: 'Another test, insight and opportunity always exists.' },
]

// Brand guidelines p.9 — Voice & personality.
export const ABOUT_BODY = 'Premium, but human. We have a point of view and the proof to back it partners, not vendors.'

// Brand guidelines p.13 — Brand summary.
export const ABOUT_SUMMARY =
  'Warm, editorial and confident. We speak plainly, prove our claims, and turn brand into the thing that makes a business grow.'

// Brand guidelines p.9 — Personality.
export const ABOUT_PERSONALITY = ['Editorial', 'Intelligent', 'Candid', 'Refined', 'Warm']

// Brand guidelines p.14.
export const ABOUT_ORIGIN = 'Built in India · Made for the world'

// Longer "who we are" copy for the /about page.
export const ABOUT_COPY = '[About BrandGap Copy]'

/**
 * Brief §7 — "Meet the strategist": photo, 2-line point of view, fractional CMO angle.
 * photo: { src, alt, width, height } or null.
 */
export const FOUNDER = {
  name: '[Founder Name]',
  role: 'Founder · Fractional CMO',
  photo: null,
  pointOfView: '[Founder Point of View — two lines]',
}

/** Content Brief §11 — Who we work with. */
export const AUDIENCE = {
  title: { lead: 'Built for', emphasis: 'ambitious brands.' },
  segments: [
    { id: 'd2c', name: 'D2C Brands', text: 'Ready to scale online sales.' },
    { id: 'ecommerce', name: 'E-commerce Businesses', text: 'Looking for predictable customer acquisition.' },
    { id: 'startups', name: 'Startups', text: 'Building their digital growth engine.' },
    { id: 'services', name: 'Service Businesses', text: 'Looking for qualified leads and better acquisition.' },
    { id: 'established', name: 'Established Brands', text: 'Improving digital performance and unlocking new growth.' },
  ],
}

/** Team — placeholders until details are supplied. photo: { src, alt } or null. */
export const TEAM = [
  { id: 'team-01', name: '[Team Member]', role: '[Role]', photo: null, tone: 'blush', letter: 'b' },
  { id: 'team-02', name: '[Team Member]', role: '[Role]', photo: null, tone: 'terracotta', letter: 'g' },
  { id: 'team-03', name: '[Team Member]', role: '[Role]', photo: null, tone: 'ink', letter: 'b' },
]

/**
 * Studio imagery — placeholders until photography is supplied.
 * Guidelines p.10: editorial beauty photography, soft natural light,
 * warm neutral tones, real texture, generous negative space.
 */
export const ABOUT_IMAGES = [
  { id: 'studio-01', label: '[Studio image]', image: null, tone: 'blush', ratio: '4 / 5', letter: 'b' },
  { id: 'studio-02', label: '[Studio image]', image: null, tone: 'terracotta', ratio: '3 / 4', letter: 'g' },
  { id: 'studio-03', label: '[Studio image]', image: null, tone: 'blush', ratio: '16 / 11', letter: 'g' },
  { id: 'studio-04', label: '[Studio image]', image: null, tone: 'ink', ratio: '4 / 5', letter: 'b' },
]
