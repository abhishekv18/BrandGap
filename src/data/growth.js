import { isLocal, localizeDeep, localizeKpi } from '../utils/currency'
/**
 * VI — The growth system. Flow and title from the Website Development Brief
 * §4 (section 06); "What it proves" from the brand guidelines p.13.
 */
export const GROWTH_INPUTS = [
  { id: 'strategy', label: 'Strategy' },
  { id: 'creative', label: 'Creative' },
  { id: 'media', label: 'Media' },
  { id: 'optimization', label: 'Optimization' },
]

export const GROWTH_OUTPUT = 'Growth'

export const GROWTH_TITLE = { lead: 'One team.', emphasis: 'One growth system.' }

export const GROWTH_PROVES = 'Lower CAC, more repeat.'

/**
 * VI — The numbers (Content Brief §06). These figures and the disclaimer are
 * exactly as supplied by BrandGap; the disclaimer must always stay visible.
 */
export const NUMBERS = localizeDeep({
  lead: 'The numbers',
  emphasis: 'behind the work.',
  panelTitle: 'BrandGap / Performance data',
  disclaimer: 'Selected performance across featured projects. Ad spend from Meta Ads data; total sales, orders and ROAS from updated performance reports supplied by BrandGap.',
  kpis: [
    { id: 'spend', label: 'Tracked Meta Ad Spend', value: 50, prefix: '₹', suffix: 'L+', decimals: 0 },
    { id: 'value', label: 'Total Sales', value: 3.17, prefix: '₹', suffix: 'Cr+', decimals: 2 },
    { id: 'purchases', label: 'Total Orders', value: 15.5, suffix: 'K+', decimals: 1 },
    { id: 'roas', label: 'Blended ROAS', value: 6.3, suffix: 'X', decimals: 1 },
    { id: 'impressions', label: 'Impressions', value: 4.2, suffix: 'Cr+', decimals: 1 },
  ],
  /**
   * The graph: cumulative ad spend (x) against cumulative total sales (y)
   * across the two featured case studies, in lakh (₹1Cr = 100L). Vibha Designs
   * (₹12.84L → ₹93.96L), then The Decorshed added on top (₹37.64L → ₹2.23Cr),
   * lands on the headline totals (₹50L+ spend, ₹3.17Cr+ sales). The dashed
   * line is break-even (1X ROAS) for reference.
   */
  graph: {
    title: 'Cumulative ad spend → total sales',
    valueLabel: 'Total sales',
    xMax: 55,
    yMax: 340,
    xTicks: [0, 10, 20, 30, 40, 50],
    yTicks: [0, 100, 200, 300],
    points: [
      { id: 'start', x: 0, y: 0 },
      { id: 'vibha', x: 12.84, y: 93.96, name: 'Vibha Designs', value: '₹93.96L', roas: '7.32X' },
      { id: 'decorshed', x: 50.48, y: 316.96, name: '+ The Decorshed', value: '₹3.17Cr+', roas: '6.3X blended' },
    ],
  },
})

// Count-up figures recorded in rupees (and crore counts) in the visitor's currency and units.
NUMBERS.kpis = NUMBERS.kpis.map((k) =>
  !isLocal && k.id === 'impressions' ? { ...k, value: 42, suffix: 'M+', decimals: 0 } : localizeKpi(k),
)
