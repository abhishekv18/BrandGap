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
    'A few short questions on positioning clarity, creative refresh rate and funnel drop offs. You get a score and a short, personalised gap report.',
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
  note: 'An arithmetic estimate from your own inputs not a forecast or a BrandGap result.',
  confirmed: false,
  inputs: [
    { id: 'adSpend', label: 'Monthly ad spend', prefix: '₹', placeholder: 'e.g. 100000', step: 1000 },
    { id: 'aov', label: 'Average order value (AOV)', prefix: '₹', placeholder: 'e.g. 1500', step: 50 },
    { id: 'conversionRate', label: 'Conversion rate', suffix: '%', placeholder: 'e.g. 2', step: 0.1 },
    { id: 'cpc', label: 'Cost per click (assumption)', prefix: '₹', placeholder: 'e.g. 12', step: 0.5 },
    { id: 'margin', label: 'Gross margin (assumption)', suffix: '%', placeholder: 'e.g. 60', step: 1 },
  ],
}

/**
 * Coming-soon pages for the tools above, while each LAUNCHED switch is off
 * (pages/GapScore.jsx, FreeAudit.jsx, RoasCalculatorPage.jsx). Each describes
 * what the built tool does, then where to go until it launches. No dates,
 * results or promises.
 */
export const COMING_SOON = {
  gapScore: {
    name: 'Gap Score',
    path: '/gap-score',
    lead: 'Find your gap',
    emphasis: 'in a few questions.',
    intro:
      'A short diagnostic that shows where your brand is losing growth across positioning, creative and the funnel. We’re putting the finishing touches on it.',
    features: {
      label: 'What it will do',
      headline: 'Three themes.',
      emphasis: 'One clear score.',
      items: [
        { title: 'A few short questions', body: 'One at a time, on positioning clarity, how often your creative is refreshed and where your funnel drops off.' },
        { title: 'Your Gap Score', body: 'A single score that shows how wide the gap is between how your brand looks and how it grows.' },
        { title: 'A personalised gap report', body: 'A short report on where the gap sits and what to look at first, sent to your email or WhatsApp.' },
      ],
    },
    links: [
      { title: 'Start a conversation', body: 'Tell us where your brand is today and we’ll come back with the right next step.', href: '/contact' },
      { title: 'Read: why most Meta Ads stop working', body: 'A practical teardown of where performance breaks — and how to diagnose it.', href: '/insights/meta-ads-stop-working' },
      { title: 'See the work', body: 'Real campaigns and real numbers from the brands we work with.', href: '/portfolio' },
    ],
  },
  freeAudit: {
    name: 'Free audit',
    path: '/free-audit',
    lead: 'A free audit,',
    emphasis: 'from the people who fix it.',
    intro:
      'A free Meta Ads or brand audit for growing brands — a second pair of eyes on what’s holding growth back. It’s launching soon.',
    features: {
      label: 'What it will do',
      headline: 'Tell us where to look.',
      emphasis: 'We’ll take it from there.',
      items: [
        { title: 'Choose your audit', body: 'A Meta Ads audit for your ad account, or a brand audit for how your brand shows up and is perceived.' },
        { title: 'Share your brand', body: 'Your name, email and website are all we need to start.' },
        { title: 'We take a look', body: 'We review what you’ve shared and come back with what we find and where we’d start.' },
      ],
    },
    links: [
      { title: 'Start a conversation', body: 'Want a second pair of eyes before then? Tell us about your brand and we’ll take a look.', href: '/contact' },
      { title: 'Performance marketing', body: 'How we build paid media into a repeatable acquisition system.', href: '/services/performance-marketing' },
      { title: 'Read: why most Meta Ads stop working', body: 'The diagnostic we start with when an account has stalled.', href: '/insights/meta-ads-stop-working' },
    ],
  },
  roasCalculator: {
    name: 'ROAS calculator',
    path: '/roas-calculator',
    lead: 'Check your numbers',
    emphasis: 'before you scale.',
    intro:
      'A simple calculator that turns your ad spend, order value and conversion rate into estimated revenue, ROAS and break-even. It’s launching soon.',
    features: {
      label: 'What it will do',
      headline: 'Your numbers in.',
      emphasis: 'Four answers out.',
      items: [
        { title: 'Your inputs', body: 'Monthly ad spend, average order value and conversion rate — plus your cost per click and gross margin as stated assumptions.' },
        { title: 'Four estimates', body: 'Estimated revenue, estimated ROAS, estimated orders and the break-even ROAS your margin needs.' },
        { title: 'Arithmetic, not a forecast', body: 'An estimate from your own numbers — a way to sense-check a plan, not a prediction or a BrandGap result.' },
      ],
    },
    links: [
      { title: 'Start a conversation', body: 'Share your numbers with us and we’ll help you read them.', href: '/contact' },
      { title: 'Read: a Meta Ads playbook for D2C', body: 'Structuring Meta Ads around the full funnel — and the numbers that tell you it’s working.', href: '/insights/meta-ads-playbook-d2c' },
      { title: 'Performance marketing', body: 'Turning ad spend into measurable customer acquisition.', href: '/services/performance-marketing' },
    ],
  },
}
