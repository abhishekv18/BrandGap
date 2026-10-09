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
export const NUMBERS = {
  lead: 'The numbers',
  emphasis: 'behind the work.',
  panelTitle: 'BrandGap / Meta Ads data',
  disclaimer: 'Selected campaign performance based on Meta Ads data across featured projects.',
  kpis: [
    { id: 'spend', label: 'Tracked Meta Ad Spend', value: 50, prefix: '₹', suffix: 'L+', decimals: 0 },
    { id: 'value', label: 'Purchase Conversion Value', value: 1.68, prefix: '₹', suffix: 'Cr+', decimals: 2 },
    { id: 'purchases', label: 'Tracked Purchases', value: 14.5, suffix: 'K+', decimals: 1 },
    { id: 'roas', label: 'Blended Purchase ROAS', value: 3.4, suffix: 'X', decimals: 1 },
    { id: 'impressions', label: 'Impressions', value: 4.2, suffix: 'Cr+', decimals: 1 },
  ],
  /**
   * The graph: cumulative Meta ad spend (x) against cumulative purchase value
   * (y) across the two featured case studies — the brief's own figures (§07),
   * in lakh (₹1Cr = 100L). Vibha Designs, then The Decorshed added on top,
   * lands on the headline totals (₹50L+ spend, ₹1.68Cr+ value). The dashed
   * line is break-even (1X ROAS) for reference.
   */
  graph: {
    title: 'Cumulative ad spend → purchase value',
    xMax: 55,
    yMax: 180,
    xTicks: [0, 10, 20, 30, 40, 50],
    yTicks: [0, 50, 100, 150],
    points: [
      { id: 'start', x: 0, y: 0 },
      { id: 'vibha', x: 12.24, y: 41.68, name: 'Vibha Designs', value: '₹41.68L+', roas: '3.41X' },
      { id: 'decorshed', x: 50.03, y: 167.68, name: '+ The Decorshed', value: '₹1.68Cr+', roas: '3.4X blended' },
    ],
  },
}
