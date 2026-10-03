/** Primary navigation — every page is a route. */
export const NAV_LINKS = [
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/insights', label: 'Insights' },
]

// Start a Project is the primary CTA throughout the website (brief §6).
export const NAV_CTA = { to: '/contact', label: 'Start a project' }

/** Lower-commitment routes, shown in the mobile menu and the footer. */
export const NAV_TOOLS = [
  { to: '/gap-score', label: 'Gap Score' },
  { to: '/free-audit', label: 'Free audit' },
  { to: '/free-audit#calculator', label: 'ROAS calculator' },
  { to: '/faq', label: 'FAQ' },
]

export const NAV_LEGAL = [
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
]

/** The homepage story, keyed by the section that opens each chapter (brief §4). */
export const CHAPTERS = [
  { id: 'top', numeral: 'I', name: 'Hero' },
  { id: 'gap', numeral: 'II', name: 'The gap' },
  { id: 'services', numeral: 'III', name: 'What we do' },
  { id: 'work', numeral: 'IV', name: 'Selected work' },
  { id: 'approach', numeral: 'V', name: 'Our approach' },
  { id: 'growth', numeral: 'VI', name: 'Growth system' },
  { id: 'clients', numeral: 'VII', name: 'Clients' },
  { id: 'about', numeral: 'VIII', name: 'About' },
  { id: 'cta', numeral: 'IX', name: 'Close the gap' },
]
