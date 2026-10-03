/**
 * Site-wide facts. Positioning, tagline and audience come from the
 * Website Development Brief (p.1). The live domain is set once, in .env.
 */
export const SITE = {
  name: 'BrandGap',
  // REPLACE BEFORE LAUNCH in .env (VITE_SITE_URL) — no trailing slash.
  url: (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, ''),
  tagline: 'Where brand becomes growth.',
  positioning: 'BrandGap connects brand thinking with measurable growth.',
  description:
    'BrandGap connects brand thinking with measurable growth — brand strategy, performance marketing and creative, built together for ambitious D2C and service brands.',
  ogImage: '/og-image.png',
}
