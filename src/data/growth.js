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
 * The dashboard (brief §5.3). These are the brief's own sample values, which it
 * states are placeholders — so the panel is always labelled as an illustration
 * while `sample` is true. Replace with real aggregated figures and set
 * `sample: false` only once they are verified.
 */
export const DASHBOARD = {
  title: 'BrandGap / Growth system',
  sample: true,
  sampleLabel: 'Illustration · sample data',
  sampleNote: 'Sample figures for illustration only — not BrandGap client results.',
  kpis: [
    { id: 'spend', label: 'Ad Spend', value: 4.8, prefix: '₹', suffix: 'L', decimals: 1 },
    { id: 'revenue', label: 'Revenue', value: 24.6, prefix: '₹', suffix: 'L', decimals: 1 },
    { id: 'roas', label: 'ROAS', value: 5.12, suffix: 'X', decimals: 2 },
    { id: 'conversions', label: 'Conversions', value: 1842, decimals: 0 },
    { id: 'growth', label: 'Growth', value: 127, prefix: '+', suffix: '%', decimals: 0 },
  ],
  // Shape of the illustrative trend line (0–1), drawn when the panel enters view.
  trend: [0.08, 0.12, 0.1, 0.18, 0.22, 0.2, 0.31, 0.36, 0.34, 0.47, 0.55, 0.52, 0.66, 0.74, 0.83, 0.92],
}
