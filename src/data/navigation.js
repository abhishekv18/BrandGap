/** Primary navigation — every page is a route. */
export const NAV_LINKS = [
  { to: '/portfolio', label: 'Portfolio' },
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
  { to: '/roas-calculator', label: 'ROAS calculator' },
  { to: '/faq', label: 'FAQ' },
]

export const NAV_LEGAL = [
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
]

/** The homepage story, keyed by the section that opens each chapter. Sections read their numeral from here. */
export const CHAPTERS = [
  { id: 'top', numeral: 'I', name: 'Hero' },
  { id: 'gap', numeral: 'II', name: 'The gap' },
  { id: 'services', numeral: 'III', name: 'What we do' },
  { id: 'approach', numeral: 'IV', name: 'The BrandGap Method' },
  { id: 'performance', numeral: 'V', name: 'Performance marketing' },
  { id: 'numbers', numeral: 'VI', name: 'The numbers' },
  { id: 'work', numeral: 'VII', name: 'Case studies' },
  // { id: 'brands', numeral: 'VIII', name: 'Selected brands' }, // section currently hidden on Home
  { id: 'creative-performance', numeral: 'VIII', name: 'Creative × Performance' },
  { id: 'growth', numeral: 'IX', name: 'Growth system' },
  { id: 'capabilities', numeral: 'X', name: 'Capabilities' },
  { id: 'about', numeral: 'XI', name: 'About BrandGap' },
  { id: 'partners', numeral: 'XII', name: 'Technology partners' },
  { id: 'why', numeral: 'XIII', name: 'Why BrandGap' },
  { id: 'clients', numeral: 'XIV', name: 'Clients' },
  { id: 'development-partner', numeral: 'XV', name: 'Development partner' },
  { id: 'cta', numeral: 'XVI', name: 'Close the gap' },
]

/** The numeral for a homepage chapter, by section id. */
export const numeralOf = (id) => CHAPTERS.find((c) => c.id === id)?.numeral ?? null
