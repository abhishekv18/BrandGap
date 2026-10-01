/**
 * Metrics — all placeholders. No figures are published in the brand guidelines.
 * To go live, set `value` to a number; the component counts up to it.
 * While `value` is null the placeholder text is shown instead.
 */
export const METRICS_INTRO = {
  // Brand guidelines p.3 — Promise.
  title: 'Accountable to a number.',
  note: '[Figures to be confirmed]',
}

export const METRICS = [
  { id: 'brands', label: 'Brands built', value: null, placeholder: '00', suffix: '+' },
  { id: 'markets', label: 'Markets', value: null, placeholder: '00', suffix: '+' },
  { id: 'campaigns', label: 'Campaigns', value: null, placeholder: '00', suffix: '+' },
  { id: 'growth', label: 'Growth', value: null, placeholder: '00', suffix: '%' },
]
