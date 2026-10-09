/**
 * FAQ (/faq), grouped by topic. Answers are written from what BrandGap has
 * already published — the Content Brief, the service pages, the case-study
 * handoffs and the contact options — so nothing here adds a promise the
 * business hasn't made: no prices, fixed timelines, contract terms or
 * guaranteed results.
 *
 * Answers support [label](/path) links. The FAQPage schema on the page is
 * built from these answers with the link syntax stripped.
 */
export const FAQ_INTRO = {
  title: 'Questions, answered.',
  intro: 'What we do, how we work and what to expect when you start a project with BrandGap — in plain language.',
}

export const FAQ_GROUPS = [
  {
    id: 'about',
    name: 'About BrandGap',
    items: [
      {
        id: 'what-is-brandgap',
        question: 'What does BrandGap do?',
        answer:
          'BrandGap is a growth-focused digital agency. We combine strategy, creative, performance marketing and technology to help ambitious brands close the gap between where they are today and where they want to be — between attention and conversion, and between marketing activity and measurable growth.',
      },
      {
        id: 'who-for',
        question: 'Who do you work with?',
        answer:
          'D2C brands ready to scale online sales, e-commerce businesses looking for predictable customer acquisition, startups building their growth engine, service businesses that need qualified conversations, established brands unlocking new growth, and personal and expert brands built around trust and audience.',
      },
      {
        id: 'different',
        question: 'What makes BrandGap different from other agencies?',
        answer:
          'We treat marketing as one growth system rather than a set of separate campaigns. Strategy comes before spend, creative and media are planned together, winners are proven with data before they are scaled — and if the data doesn’t prove it, we don’t claim it.',
      },
      {
        id: 'where',
        question: 'Where are you based? Do you work with brands outside India?',
        answer:
          'BrandGap is built in India and made for the world. Our work is digital-first, so the way we work doesn’t depend on where you are — [start a conversation](/contact) and tell us about your market.',
      },
    ],
  },
  {
    id: 'services',
    name: 'Services',
    items: [
      {
        id: 'services-offered',
        question: 'Which services do you offer?',
        answer:
          'Six areas that work together: performance marketing, brand and creative strategy, social media and content, e-commerce growth, website and conversion, and growth and analytics. You can see what each includes on our [services page](/services).',
      },
      {
        id: 'only-ads',
        question: 'Do you only run ads?',
        answer:
          'No. Ads are one part of the system. A campaign can underperform because the creative is weak, the audience is wrong, the offer is unclear or the landing page doesn’t convert — so we look at all of it. Read how we approach [performance marketing](/services/performance-marketing).',
      },
      {
        id: 'platforms',
        question: 'Which advertising platforms do you work with?',
        answer:
          'Most of our performance work is on Meta — Facebook and Instagram — across prospecting, retargeting, catalogue and Advantage+ campaigns. Google Ads is part of our paid acquisition offering as well.',
      },
      {
        id: 'social',
        question: 'Can you manage our social media?',
        answer:
          'Yes — end to end: strategy, content planning, Reels and short-form, creative, copy, community and monthly insights. We build the system behind the content rather than filling a calendar. See our [social media service](/services/social-media).',
      },
      {
        id: 'personal-brands',
        question: 'Do you work with personal and expert brands?',
        answer:
          'Yes. For coaches, consultants, creators and experts, social media is where people meet the person behind the expertise. Our work with [Healer Priya Agrawal](/portfolio/healer-priya-agrawal) started from zero and grew into a connected brand across YouTube, Instagram, Facebook, a website and a store.',
      },
      {
        id: 'local-leads',
        question: 'Can you help a local or service business get more enquiries?',
        answer:
          'Yes. Not every conversion is a purchase. For [Ambaji Marble House](/portfolio/ambaji-marble-house) we paired a market-wide awareness campaign with a messaging campaign, generating 1,087 messaging contacts — giving interested prospects a direct path to start a conversation.',
      },
    ],
  },
  {
    id: 'results',
    name: 'Performance & results',
    items: [
      {
        id: 'time-to-results',
        question: 'How long does it take to see results?',
        answer:
          'It depends on your category, your starting point and what needs fixing first. Paid campaigns need time to gather data before they can be judged fairly, so we test, read the signals, validate what’s repeatable and only then scale. We’ll set expectations for your account once we understand it.',
      },
      {
        id: 'measure',
        question: 'How do you measure success?',
        answer:
          'Against business outcomes, not vanity metrics. Depending on the goal we look at CAC or CPA, ROAS, conversion rate, average order value, CTR, frequency and creative performance — and for awareness or lead generation, the right KPI for that job, such as reach or conversations.',
      },
      {
        id: 'guarantee',
        question: 'Can you guarantee results?',
        answer:
          'No honest agency can guarantee results — markets, products and platforms all move. What we can promise is a clear strategy, disciplined testing, transparent reporting and no manufactured results. You can see what that looks like in our [case studies](/portfolio).',
      },
      {
        id: 'proof',
        question: 'Are the numbers in your case studies real?',
        answer:
          'Yes. Our case-study figures come from Meta Ads Manager account totals and campaign exports, labelled with their source. For example, [The Decorshed](/portfolio/the-decorshed) recorded 10,945+ purchases and [Vibha Designs](/portfolio/vibha-designs) a 3.41x purchase ROAS.',
      },
    ],
  },
  {
    id: 'working',
    name: 'Working together',
    items: [
      {
        id: 'start',
        question: 'How do we get started?',
        answer:
          'Tell us where your brand is today through our [project form](/contact) — it takes a few minutes. We review the details and the opportunity, then come back with the right next step. Prefer to talk? You can also message us on WhatsApp or [book a call](/contact#booking).',
      },
      {
        id: 'minimum-ad-spend',
        question: 'What is the minimum monthly ad spend?',
        answer:
          'There’s no single right number — it depends on your category, margins and goals. Our project form asks for a monthly budget range so we can understand the right scope, not to judge the size of your brand. We’ll recommend a starting budget once we’ve looked at your situation.',
      },
      {
        id: 'engagements',
        question: 'How do engagements work?',
        answer:
          'We work in three ways: a defined project, a monthly growth retainer, or a fractional CMO arrangement. Scope and terms are agreed with each brand based on what it needs.',
      },
      {
        id: 'audit',
        question: 'Do you offer a free audit?',
        answer:
          'A free Meta Ads and brand audit is launching soon. Until then, [start a conversation](/contact) and tell us what’s holding your growth back — we’re happy to take a look.',
      },
    ],
  },
]

/** Every question, flat — for the schema and counts. */
export const FAQ = FAQ_GROUPS.flatMap((g) => g.items)
