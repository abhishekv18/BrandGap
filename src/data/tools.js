/**
 * Lead-magnet tools (brief §6). Structure only — BrandGap supplies the
 * question set, scoring logic and calculator assumptions.
 */

/**
 * Gap Score quiz: 5–6 questions on positioning clarity, creative refresh
 * rate and funnel drop-offs. Replace each [placeholder]; the scoring
 * function lives in utils/gapScore.js.
 */
export const GAP_SCORE = {
  title: 'What is your Gap Score?',
  intro:
    'A few short questions on positioning clarity, creative refresh rate and funnel drop-offs. You get a score and a short, personalised gap report.',
  themes: ['Positioning clarity', 'Creative refresh rate', 'Funnel drop-offs'],
  questions: [
    { id: 'q1', theme: 'Positioning clarity', text: '[Question 1]' },
    { id: 'q2', theme: 'Positioning clarity', text: '[Question 2]' },
    { id: 'q3', theme: 'Creative refresh rate', text: '[Question 3]' },
    { id: 'q4', theme: 'Creative refresh rate', text: '[Question 4]' },
    { id: 'q5', theme: 'Funnel drop-offs', text: '[Question 5]' },
    { id: 'q6', theme: 'Funnel drop-offs', text: '[Question 6]' },
  ].map((q) => ({
    ...q,
    // Each option: { label, value } — value is what the scoring function reads.
    options: ['[Answer A]', '[Answer B]', '[Answer C]', '[Answer D]'].map((label, i) => ({ label, value: i })),
  })),
  // Brief §6: an email or WhatsApp number is requested to view the result.
  gate: 'Where should we send your gap report?',
  result: {
    scorePlaceholder: '[Gap Score Result]',
    reportPlaceholder: '[Personalised gap report]',
  },
}

/**
 * ROAS / growth calculator. The brief's inputs are ad spend, AOV and
 * conversion rate; estimating revenue also needs a cost per click, and
 * break-even ROAS needs a gross margin, so those are asked for as stated
 * assumptions. The formula (utils/roas.js) is standard arithmetic — not a
 * BrandGap result — and should be confirmed by the BrandGap team.
 */
export const ROAS_CALCULATOR = {
  title: 'ROAS / growth calculator',
  note: 'An arithmetic estimate from your own inputs — not a forecast or a BrandGap result.',
  confirmed: false,
  inputs: [
    { id: 'adSpend', label: 'Monthly ad spend', prefix: '₹', placeholder: 'e.g. 100000', step: 1000 },
    { id: 'aov', label: 'Average order value (AOV)', prefix: '₹', placeholder: 'e.g. 1500', step: 50 },
    { id: 'conversionRate', label: 'Conversion rate', suffix: '%', placeholder: 'e.g. 2', step: 0.1 },
    { id: 'cpc', label: 'Cost per click (assumption)', prefix: '₹', placeholder: 'e.g. 12', step: 0.5 },
    { id: 'margin', label: 'Gross margin (assumption)', suffix: '%', placeholder: 'e.g. 60', step: 1 },
  ],
}
