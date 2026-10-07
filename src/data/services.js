/**
 * III — What we do. The five service areas and their "includes" lists are
 * exactly as in the Website Development Brief §5.1.
 * image: { src, srcSet, sizes, width, height, alt } or null for an art-directed placeholder.
 * Source files live in public/services (compressed WebP at 480px plus a full-width file).
 */
export const SERVICES_INTRO =
  'Brand thinking and performance marketing, built together by one team and accountable to the same growth number.'

export const SERVICES_CENTER = 'Brand'

export const SERVICES = [
  {
    id: 'brand-strategy',
    name: 'Brand Strategy',
    short: 'Strategy',
    description:
      'We define who you are, who you are for and why customers should choose you, so every ad, page and post works from one clear idea.',
    includes: ['Positioning', 'Identity', 'Brand Direction'],
    image: {
      src: '/services/brand-strategy-960.webp',
      srcSet: '/services/brand-strategy-480.webp 480w, /services/brand-strategy-960.webp 960w',
      // Shown cropped to 4:5 (object-cover), so the rendered width is ~1.9× the
      // hover-preview card. The Services page passes its own sizes.
      sizes: '(min-width: 1536px) 470px, (min-width: 1280px) 425px, 380px',
      width: 960,
      height: 590,
      alt: 'Brand strategy is the process of defining your brand’s purpose, values, and positioning in the market.',
    },
  },
  {
    id: 'performance-marketing',
    name: 'Performance Marketing',
    short: 'Performance',
    description:
      'Paid campaigns built around profit, not clicks. We test, optimise and scale what works so your ad spend turns into measurable revenue.',
    includes: ['Meta Ads', 'Google Ads', 'CRO', 'Retargeting'],
    image: {
      src: '/services/images%20(6).jpg',
      srcSet: '/services/performance-marketing-480.webp 480w, /services/images%20(6).jpg 678w',
      // Shown cropped to 4:5 (object-cover), so the rendered width is ~1.9× the
      // hover-preview card. The Services page passes its own sizes.
      sizes: '(min-width: 1536px) 470px, (min-width: 1280px) 425px, 380px',
      width: 678,
      height: 452,
      alt: 'Performance marketing is a data-driven approach to advertising that focuses on driving measurable results and ROI.',
    },
  },
  {
    id: 'content-creative',
    name: 'Content and Creative',
    short: 'Creative',
    description:
      'Scroll-stopping creative led by strategy. Reels, UGC and product shoots designed to earn attention and drive action.',
    includes: ['Reels', 'UGC', 'Product Shoots', 'Creative Strategy'],
    image: {
      src: '/services/images%20(7).jpg',
      srcSet: '/services/content-creative-480.webp 480w, /services/images%20(7).jpg 656w',
      // Shown cropped to 4:5 (object-cover), so the rendered width is ~1.9× the
      // hover-preview card. The Services page passes its own sizes.
      sizes: '(min-width: 1536px) 470px, (min-width: 1280px) 425px, 380px',
      width: 656,
      height: 467,
      alt: 'Content & Creative is the process of creating compelling content and creative assets that resonate with your target audience.',
    },
  },
  {
    id: 'ecommerce-growth',
    name: 'E-commerce Growth',
    short: 'E-commerce',
    description:
      'We turn your store into a conversion engine, with fast Shopify builds, focused landing pages and funnels that move buyers from click to checkout.',
    includes: ['Shopify', 'Landing Pages', 'Funnels', 'Conversion'],
    image: {
      src: '/services/ecommerce-growth-738.webp',
      srcSet: '/services/ecommerce-growth-480.webp 480w, /services/ecommerce-growth-738.webp 738w',
      // Shown cropped to 4:5 (object-cover), so the rendered width is ~1.9× the
      // hover-preview card. The Services page passes its own sizes.
      sizes: '(min-width: 1536px) 470px, (min-width: 1280px) 425px, 380px',
      width: 738,
      height: 384,
      alt: 'E-commerce growth is the process of increasing online sales and revenue through strategies such as website optimization, digital marketing, and customer engagement.',
    },
  },
  {
    id: 'social-growth',
    name: 'Social Growth',
    short: 'Social',
    description:
      'Consistent, on-brand social presence that builds an audience, deepens trust and feeds your performance funnel.',
    includes: ['Content Strategy', 'Instagram', 'Community'],
    image: {
      src: '/services/flat-illustration-social-media-day-celebration_23-2150383246.avif',
      srcSet: '/services/social-growth-480.webp 480w, /services/flat-illustration-social-media-day-celebration_23-2150383246.avif 740w',
      // Shown cropped to 4:5 (object-cover), so the rendered width is ~1.9× the
      // hover-preview card. The Services page passes its own sizes.
      sizes: '(min-width: 1536px) 470px, (min-width: 1280px) 425px, 380px',
      width: 740,
      height: 493,
      alt: 'Social growth is the process of increasing your brand’s presence and engagement on social media platforms, building a loyal audience and driving business results.',
    },
  },
]

// Brief §4 — the band between sections.
export const MARQUEE_WORDS = ['Strategy', 'Creative', 'Performance', 'Content', 'E-commerce', 'Growth']

// Brief §7 — show the format only, no prices.
export const ENGAGEMENT_MODELS = [
  { id: 'project', name: 'Project', note: '[Engagement description]' },
  { id: 'retainer', name: 'Monthly Growth Retainer', note: '[Engagement description]' },
  { id: 'fractional-cmo', name: 'Fractional CMO', note: '[Engagement description]' },
]
