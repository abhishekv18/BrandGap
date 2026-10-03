/**
 * VIII — About BrandGap, and the /about page.
 * Approved copy only; founder, team and qualifier details are placeholders
 * until BrandGap supplies them (brief §7, §11). No history, locations,
 * experience or achievement claims.
 */

// Approved positioning line.
export const ABOUT_STATEMENT = {
  lead: 'We close the gap between what a brand is and ',
  emphasis: 'what it could become.',
}

// Brand guidelines p.9 — Voice & personality.
export const ABOUT_BODY = 'Premium, but human. We have a point of view and the proof to back it — partners, not vendors.'

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

/**
 * Brief §7 — "Who we are for / not for". Audience from the brief (p.1);
 * the minimum spend is to be decided by BrandGap.
 */
export const AUDIENCE = {
  for: ['D2C brands', 'Service-based brands', 'Founders and marketing heads'],
  minimumSpend: '[Minimum monthly ad spend]',
  notFor: ['[Not-for qualifier]', '[Not-for qualifier]'],
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
