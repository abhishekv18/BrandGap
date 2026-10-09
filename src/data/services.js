/**
 * III — What we do. The six capability areas, their one-line promises and
 * "includes" lists are exactly as in the Website Content Brief §03.
 * image: { src, srcSet, sizes, width, height, alt } or null for an art-directed placeholder.
 * Source files live in public/services (compressed WebP at 480px plus a full-width file).
 */

// Content Brief §03 — heading and sub.
export const SERVICES_HEADING = { lead: 'One growth partner.', emphasis: 'Multiple capabilities.' }

export const SERVICES_INTRO =
  'From strategy and creative to performance and technology, BrandGap brings the essential pieces of modern digital growth together.'

export const SERVICES_CENTER = 'Growth'

// Shown cropped to 4:5 (object-cover), so the rendered width is ~1.9× the
// hover-preview card. The Services page passes its own sizes.
const PREVIEW_SIZES = '(min-width: 1536px) 470px, (min-width: 1280px) 425px, 380px'

export const SERVICES = [
  {
    id: 'performance-marketing',
    name: 'Performance Marketing',
    short: 'Performance',
    description: 'Turn ad spend into measurable growth.',
    includes: [
      'Meta Ads',
      'Google Ads',
      'Sales Campaigns',
      'Lead Gen',
      'Retargeting',
      'Catalog & Advantage+',
      'Audience & Funnel Strategy',
      'ROAS / CAC Optimization',
      'Campaign Scaling',
      'Creative Testing',
    ],
    image: {
      src: '/services/images%20(6).jpg',
      srcSet: '/services/performance-marketing-480.webp 480w, /services/images%20(6).jpg 678w',
      sizes: PREVIEW_SIZES,
      width: 678,
      height: 452,
      alt: 'Performance marketing — turning ad spend into measurable growth.',
    },
  },
  {
    id: 'brand-creative-strategy',
    name: 'Brand & Creative Strategy',
    short: 'Brand',
    description: 'Make your brand impossible to ignore.',
    includes: [
      'Positioning',
      'Brand Strategy',
      'Creative Direction',
      'Campaign Concepts',
      'Messaging',
      'Communication Strategy',
      'Visual Direction',
      'Offer Strategy',
    ],
    image: {
      src: '/services/brand-strategy-960.webp',
      srcSet: '/services/brand-strategy-480.webp 480w, /services/brand-strategy-960.webp 960w',
      sizes: PREVIEW_SIZES,
      width: 960,
      height: 590,
      alt: 'Brand and creative strategy — positioning, messaging and creative direction.',
    },
  },
  {
    id: 'social-media-content',
    name: 'Social Media & Content',
    short: 'Social',
    description: 'Don’t just post. Build attention that converts.',
    includes: [
      'Social Strategy',
      'Instagram Growth',
      'Content Strategy',
      'Reels',
      'Content Calendars',
      'Copywriting',
      'UGC Strategy',
      'Campaign Content',
      'Social Media Management',
    ],
    image: {
      src: '/services/flat-illustration-social-media-day-celebration_23-2150383246.avif',
      srcSet: '/services/social-growth-480.webp 480w, /services/flat-illustration-social-media-day-celebration_23-2150383246.avif 740w',
      sizes: PREVIEW_SIZES,
      width: 740,
      height: 493,
      alt: 'Illustration of people connected across social media platforms.',
    },
  },
  {
    id: 'ecommerce-growth',
    name: 'E-commerce Growth',
    short: 'E-commerce',
    description: 'Build a digital store designed to sell.',
    includes: [
      'Shopify Development',
      'E-commerce Strategy',
      'Product Page Optimization',
      'Landing Pages',
      'CRO',
      'Offer & Bundle Strategy',
      'Checkout Optimization',
      'Retargeting',
      'Analytics',
    ],
    image: {
      src: '/services/ecommerce-growth-738.webp',
      srcSet: '/services/ecommerce-growth-480.webp 480w, /services/ecommerce-growth-738.webp 738w',
      sizes: PREVIEW_SIZES,
      width: 738,
      height: 384,
      alt: 'E-commerce growth — a digital store designed to sell.',
    },
  },
  {
    id: 'website-conversion',
    name: 'Website & Conversion',
    short: 'Web',
    description: 'Your website should not just look good. It should perform.',
    includes: [
      'Website Design',
      'Shopify Websites',
      'Landing Pages',
      'Conversion-Focused UX',
      'Optimization',
      'Tracking Setup',
      'Analytics Integration',
    ],
    // From public/services/images (8).jpg, cropped to remove a third-party logo.
    image: {
      src: '/services/website-conversion-555.webp',
      srcSet: '/services/website-conversion-480.webp 480w, /services/website-conversion-555.webp 555w',
      sizes: PREVIEW_SIZES,
      width: 555,
      height: 452,
      alt: 'Website design and development — responsive design, content and testing.',
    },
  },
  {
    id: 'growth-analytics',
    name: 'Growth & Analytics',
    short: 'Analytics',
    description: 'Because what gets measured gets improved.',
    includes: [
      'Funnel Analysis',
      'Reporting',
      'GA4',
      'GTM',
      'Meta Pixel',
      'Conversion Tracking',
      'Customer Journey Analysis',
      'Campaign Diagnostics',
    ],
    // From public/services/images (9).jpg.
    image: {
      src: '/services/growth-analytics-678.webp',
      srcSet: '/services/growth-analytics-480.webp 480w, /services/growth-analytics-678.webp 678w',
      sizes: PREVIEW_SIZES,
      width: 678,
      height: 452,
      alt: 'Growth and analytics — dashboards, audience insight and performance data.',
    },
  },
]

// Brief §4 — the band between sections.
export const MARQUEE_WORDS = ['Strategy', 'Creative', 'Performance', 'Content', 'E-commerce', 'Growth']

// Brief §7 — show the format only, no prices.
export const ENGAGEMENT_MODELS = [
  // Formats only: no prices, timeframes or guarantees. Scope and terms are agreed per brand (see the FAQ).
  {
    id: 'project',
    name: 'Project',
    note: 'A defined piece of work with a clear scope and outcome: a website build, a campaign launch, a brand strategy or an ad-account rebuild. Best when you know exactly which gap needs closing.',
  },
  {
    id: 'retainer',
    name: 'Monthly Growth Retainer',
    note: 'An ongoing partnership across performance, content and creative. Every month we plan, launch, test and optimise, so the work compounds instead of starting over each time.',
  },
  {
    id: 'fractional-cmo',
    name: 'Fractional CMO',
    note: 'Senior marketing leadership without a full-time hire. We shape the strategy, guide priorities and budget, and connect your team, partners and channels into one growth system.',
  },
]
