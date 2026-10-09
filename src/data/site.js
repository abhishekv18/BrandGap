/**
 * Site-wide facts. Positioning, title and description come from the
 * Website Content Brief (cover and §15). The live domain is set once, in .env.
 */
export const SITE = {
  name: 'BrandGap',
  // REPLACE BEFORE LAUNCH in .env (VITE_SITE_URL) — no trailing slash.
  url: (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, ''),
  tagline: 'Where brand becomes growth.',
  positioning: 'We bridge the gap between your brand and measurable growth.',
  // Content Brief §15 — homepage <title>.
  homeTitle: 'BrandGap | Performance Marketing & Digital Growth Agency',
  description:
    'BrandGap is a growth focused digital agency helping D2C, e-commerce, startups and service businesses grow through performance marketing, creative strategy, social media, websites and conversion optimization.',
  ogImage: '/og-image.png',
}

// Content Brief §01 — the hero.
export const HERO = {
  label: 'Strategy × Creative × Performance',
  title: 'We bridge the gap between your brand and growth.',
  body: 'BrandGap is a growth-focused digital agency helping ambitious brands turn attention into customers, ideas into campaigns, and marketing into measurable business growth.',
  primary: 'Start your growth journey',
  secondary: 'Explore our work',
  line: 'Strategy. Creativity. Performance. Growth.',
}
