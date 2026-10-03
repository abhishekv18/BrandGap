/**
 * IV — Selected work, the Work index and each /work/[slug] page.
 *
 * Nothing here is a verified result. Every published entry is a placeholder
 * until BrandGap supplies verified metrics, client names and written
 * permission to publish (brief §11).
 *
 *   slug        URL of the case study page: /work/[slug]
 *   published   only published entries are listed, routed and put in the sitemap
 *   industries  values from INDUSTRIES — drives the filter on /work
 *   metrics     the three headline numbers on the card
 *   flow        Problem → Strategy → Creative → Campaign → Result
 *   image       null renders an art-directed placeholder plate;
 *               to use real work set { src, srcSet, sizes, alt, width, height }
 *   gallery     further images for the case study page (same shape, or null)
 *   tone        placeholder plate colour — 'terracotta' | 'blush' | 'ink'
 */

// Brief §7 — industry filter tags.
export const INDUSTRIES = ['D2C', 'Home Decor', 'Spiritual', 'Services', 'Course Creators']

// Brief §5.2 — the detail flow.
export const CASE_FLOW = [
  { id: 'problem', label: 'Problem' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'creative', label: 'Creative' },
  { id: 'campaign', label: 'Campaign' },
  { id: 'result', label: 'Result' },
]

export const WORK_INTRO = {
  title: 'Selected work.',
  // Brand guidelines p.9 — tone of voice.
  line: 'Proof over adjectives.',
}

const placeholderMetrics = () => [
  { label: '[Metric label]', value: '[Metric 01]' },
  { label: '[Metric label]', value: '[Metric 02]' },
  { label: '[Metric label]', value: '[Metric 03]' },
]

const placeholderFlow = () => ({
  problem: '[Problem]',
  strategy: '[Strategy]',
  creative: '[Creative]',
  campaign: '[Campaign]',
  result: '[Result]',
})

export const PROJECTS = [
  {
    slug: 'case-study-01',
    published: true,
    index: '01',
    client: '[Client Name]',
    title: '[Project Title]',
    category: '[Category]',
    // Placeholder assignment so the filter can be reviewed — replace with the real industry.
    industries: ['D2C'],
    summary: '[Project Description]',
    metrics: placeholderMetrics(),
    flow: placeholderFlow(),
    image: null,
    gallery: [null, null],
    tone: 'terracotta',
  },
  {
    slug: 'case-study-02',
    published: true,
    index: '02',
    client: '[Client Name]',
    title: '[Project Title]',
    category: '[Category]',
    industries: ['Home Decor'],
    summary: '[Project Description]',
    metrics: placeholderMetrics(),
    flow: placeholderFlow(),
    image: null,
    gallery: [null, null],
    tone: 'blush',
  },
  {
    slug: 'case-study-03',
    published: true,
    index: '03',
    client: '[Client Name]',
    title: '[Project Title]',
    category: '[Category]',
    industries: ['Services'],
    summary: '[Project Description]',
    metrics: placeholderMetrics(),
    flow: placeholderFlow(),
    image: null,
    gallery: [null, null],
    tone: 'ink',
  },
  /**
   * DRAFT — the brief's own example (§5.2), "data to be verified before launch".
   * Hidden until BrandGap verifies the figures and has written permission
   * from the client. Then set published: true and fill in the flow.
   */
  {
    slug: 'vibha-designs',
    published: false,
    index: '04',
    client: 'Vibha Designs',
    title: '[Project Title]',
    category: 'Spiritual Lifestyle · D2C',
    industries: ['Spiritual', 'D2C'],
    summary: '[Project Description]',
    metrics: [
      { label: 'Ad Spend', value: '₹2.11L' },
      { label: 'Revenue', value: '₹11L+' },
      { label: 'ROAS', value: '5.60X' },
    ],
    flow: placeholderFlow(),
    image: null,
    gallery: [null, null],
    tone: 'terracotta',
  },
]

export const PUBLISHED_PROJECTS = PROJECTS.filter((p) => p.published)

export const findProject = (slug) => PUBLISHED_PROJECTS.find((p) => p.slug === slug)
