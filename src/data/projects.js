/**
 * Case studies: the homepage cards, /portfolio and each /portfolio/[slug] page.
 *
 * Source of truth: the BrandGap case-study developer handoffs in the shared
 * Google Drive folder (Work › Case Studies), one per client. Copy and figures
 * are taken from them, including their publishing guardrails — e.g. purchases
 * are never called customers, messaging contacts are never called qualified
 * leads, and site-reported figures are labelled as such. Nothing is added.
 *
 *   slug        URL of the case study page: /portfolio/[slug]
 *   published   only published entries are listed, routed and put in the sitemap
 *   industries  values from INDUSTRIES — drives the filter on /portfolio
 *   statement   the case's headline (handoff "hero headline")
 *   summary     the hero subhead
 *   metrics     the hero metric cards { label, value, note? }; cards show `highlights`
 *   flow        Problem → Strategy → Result, used by the card preview and quick view
 *   image       a real website screenshot, or null for a text-led case (no visual at all)
 *   gallery     further real screenshots for the case page
 *   website     the brand's live site, or null when there is none
 *   graph       the numbers panel's chart (see components/MetricsPanel.jsx), or null
 *   panelMetrics optional figures for the panel when they differ from `metrics`
 *   panelCaption the source line under the panel
 *   story       the case page, as editorial blocks (see components/EditorialBlocks.jsx)
 *   closing     the final CTA copy for the case page
 *   seo         page title / description from the handoff
 *   tone        plate colour — 'terracotta' | 'blush' | 'ink'
 */

// Filter tags on /portfolio, drawn from the case-study categories.
export const INDUSTRIES = ['E-commerce', 'Home Décor', 'Spiritual', 'Personal Brand', 'Local Business']

// The detail flow.
export const CASE_FLOW = [
  { id: 'problem', label: 'Problem' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'creative', label: 'Creative' },
  { id: 'campaign', label: 'Campaign' },
  { id: 'result', label: 'Result' },
]

/** The flow steps a project actually has content for. */
export const flowSteps = (project) => CASE_FLOW.filter((step) => project.flow?.[step.id])

/** The cases shown on the homepage; the rest live on /portfolio. */
export const HOME_CASES = 3

/** The metrics shown on a card (three). */
export const cardMetrics = (project) =>
  project.highlights ? project.highlights.map((i) => project.metrics[i]) : project.metrics.slice(0, 3)

// Content Brief §07 — heading.
export const WORK_INTRO = {
  title: 'Real campaigns.',
  emphasis: 'Real growth. Real numbers.',
  intro:
    'Four brands, four growth challenges from e-commerce and D2C to personal branding and local leads. All figures are backed by Meta Ads data or client websites.',
}

const ADS_PERIOD = 'Meta Ads Manager account total · 8 Sep 2023 – 8 Oct 2026'

export const PROJECTS = [
  /* ------------------------------------------------------------------ */
  {
    slug: 'the-decorshed',
    published: true,
    index: '01',
    client: 'The Decorshed',
    statement: 'From product ads to a scalable acquisition engine.',
    category: 'Performance Marketing × Social Media',
    industries: ['E-commerce', 'Home Décor'],
    summary:
      'How BrandGap used performance marketing, audience strategy and campaign iteration to generate 10,945+ purchases from ₹37.64L+ in Meta ad spend across a multi-product ecommerce business.',
    metrics: [
      { label: 'Purchases', value: '10,945+', note: ADS_PERIOD },
      { label: 'Ad spend', value: '₹37.64L+', note: ADS_PERIOD },
      { label: 'Impressions', value: '28.89M+', note: ADS_PERIOD },
      { label: 'Reach', value: '13.21M+', note: ADS_PERIOD },
    ],
    highlights: [0, 1, 2],
    strategy: ['Product-led campaigns', 'Audience testing & expansion', 'Retargeting', 'Continuous iteration', 'Seasonal campaigns', 'Social media management'],
    flow: {
      problem: 'Turning traffic into predictable revenue across a broad home, garden and décor catalogue.',
      strategy: 'Product-led campaigns · Audience testing & expansion · Retargeting · Continuous iteration',
      result: '10,945+ purchases from ₹37.64L+ Meta ad spend, with 28.89M+ impressions and 13.21M+ reach (Ads Manager account total).',
    },
    image: {
      src: '/work/decorshed-main-1600.webp',
      srcSet: '/work/decorshed-main-800.webp 800w, /work/decorshed-main-1600.webp 1600w',
      width: 1600,
      height: 900,
      position: 'top',
      alt: 'The Decorshed website — festive season home décor collection',
    },
    gallery: [
      {
        src: '/work/decorshed-gallery-1-1600.webp',
        srcSet: '/work/decorshed-gallery-1-800.webp 800w, /work/decorshed-gallery-1-1600.webp 1600w',
        width: 1600,
        height: 900,
        position: 'top',
        alt: 'The Decorshed website — garden fountains campaign banner',
      },
      {
        src: '/work/decorshed-gallery-2-1600.webp',
        srcSet: '/work/decorshed-gallery-2-800.webp 800w, /work/decorshed-gallery-2-1600.webp 1600w',
        width: 1600,
        height: 900,
        position: 'top',
        alt: 'The Decorshed website — decorative fountain collection page',
      },
    ],
    website: 'https://thedecorshed.com/',
    // The numbers panel. Headline figures: Ads Manager account totals. Graph: the five featured
    // campaigns from the supplied campaign export, cumulative (₹ in lakh), ordered by ROAS.
    graph: {
      title: 'Featured campaigns · spend → attributed value',
      xMax: 12,
      yMax: 45,
      xTicks: [0, 3, 6, 9, 12],
      yTicks: [0, 15, 30, 45],
      points: [
        { id: 'start', x: 0, y: 0 },
        { id: 'lookalike', x: 0.1454, y: 0.8497, name: 'Lookalike Audience', value: '₹84.97K', roas: '5.84X' },
        { id: 'advantage', x: 1.0959, y: 5.7906, name: 'Advantage+ Sales', value: '₹4.94L', roas: '5.20X' },
        { id: 'retarget', x: 3.3757, y: 15.477, name: 'Retargeting', value: '₹9.69L', roas: '4.25X' },
        { id: 'cbo', x: 7.6857, y: 31.407, name: 'Lookalike CBO', value: '₹15.93L', roas: '3.70X' },
        { id: 'customer', x: 11.1857, y: 42.387, name: 'Customer Audience', value: '₹10.98L', roas: '3.14X' },
      ],
    },
    panelCaption:
      'Figures: Meta Ads Manager account totals, 8 Sep 2023 – 8 Oct 2026. Graph: the five featured campaigns from the supplied campaign export, cumulative.',
    seo: {
      title: 'The Decorshed Case Study | Meta Ads & Ecommerce Growth',
      description:
        'See how BrandGap helped The Decorshed drive 10,945+ purchases, ₹37.6L+ in Meta ad spend and 28.89M+ impressions through performance marketing, audience strategy and campaign testing.',
    },
    story: [
      {
        type: 'intro',
        label: 'The challenge',
        headline: 'The challenge wasn’t getting traffic.',
        emphasis: 'It was turning traffic into predictable revenue.',
        body: [
          'The Decorshed is an ecommerce brand with a broad home, garden and decorative product catalogue — with multiple customer segments and products that can perform very differently in paid media.',
          'The challenge was to build a paid acquisition system that could identify high-intent opportunities, scale profitable combinations and bring interested users back into the buying journey. The answer was a continuous testing-and-scaling approach across products, audiences, campaign structures, retargeting and seasonal demand.',
        ],
      },
      {
        type: 'pillars',
        label: 'The strategy',
        ground: 'blush',
        headline: 'An evolving acquisition system,',
        emphasis: 'not a single campaign.',
        items: [
          { title: 'Product-led campaign strategy', body: 'Campaigns were built around individual products, product groups and catalogue opportunities instead of treating the entire catalogue as one audience.' },
          { title: 'Audience testing & expansion', body: 'Broad, lookalike, customer-audience and automated campaign structures were tested to find scalable pockets of purchase intent.' },
          { title: 'Retargeting', body: 'High-intent users were re-engaged through dedicated retargeting campaigns, helping recover demand from users who did not purchase on their first interaction.' },
          { title: 'Continuous iteration', body: 'The account evolved through repeated testing around new products, seasonal promotions and different campaign structures, moving budget toward stronger performers.' },
        ],
      },
      {
        type: 'ledger',
        label: 'Results snapshot',
        headline: 'The account,',
        emphasis: 'in numbers.',
        columns: ['Metric', 'Value'],
        rows: [
          ['Ad spend', '₹37,64,141.80'],
          ['Purchases', '10,945'],
          ['Impressions', '28,891,728'],
          ['Reach', '13,215,042'],
          ['CPM', '₹130.28'],
          ['Visible active campaign ROAS range', '2.98x – 5.84x'],
        ],
        note: 'Meta Ads Manager account-level totals, 8 Sep 2023 – 8 Oct 2026. Purchases can include repeat orders from the same customer.',
      },
      {
        type: 'proof',
        image: {
          src: '/work/decorshed-ads-manager-1600.webp',
          srcSet: '/work/decorshed-ads-manager-800.webp 800w, /work/decorshed-ads-manager-1600.webp 1510w',
          width: 1510,
          height: 615,
          alt: 'Meta Ads Manager — The Decorshed campaigns, with an account total of ₹37,64,141.80 spent, 28,891,728 impressions, 13,215,042 reach and 10,945 purchases.',
        },
        caption: 'Meta Ads Manager — campaign view with the account-level total row (8 Sep 2023 – 8 Oct 2026). Supplied by BrandGap.',
      },
      {
        type: 'cards',
        label: 'Campaign winners',
        headline: 'Scale and efficiency,',
        emphasis: 'campaign by campaign.',
        intro: 'Campaign-level figures from the supplied campaign export.',
        items: [
          { kicker: '5.84x ROAS', title: 'Lookalike Audience', meta: '85 purchases · ₹14.54K spend · ₹84.97K attributed value', body: 'One of the strongest efficiency performers in the account, generating 5.84x return while acquiring 85 purchases from ₹14.5K in spend.' },
          { kicker: '5.20x ROAS', title: 'Advantage+ Sales', meta: '196 purchases · ₹95.05K spend · ₹4.94L attributed value', body: 'An automated acquisition structure generated 196 purchases at a 5.20x ROAS, showing the value of combining scale-oriented automation with strong product demand.' },
          { kicker: '4.25x ROAS', title: 'Retargeting', meta: '568 purchases · ₹2.28L spend · ₹9.69L attributed value', body: 'Dedicated retargeting converted high-intent users efficiently, generating 568 purchases at a 4.25x ROAS.' },
          { kicker: '3.70x ROAS', title: 'Lookalike CBO', meta: '1,404 purchases · ₹4.31L spend · ₹15.93L attributed value', body: 'One of the strongest scale stories in the account, delivering 1,404 purchases while maintaining a 3.70x ROAS.' },
          { kicker: '3.14x ROAS', title: 'Customer Audience', meta: '1,432 purchases · ₹3.50L spend · ₹10.98L attributed value', body: 'The highest-purchase campaign in the supplied export, generating 1,432 purchases at a 3.14x ROAS.' },
        ],
      },
      {
        type: 'intro',
        label: 'Product-led growth',
        headline: 'From one catalogue to',
        emphasis: 'multiple growth opportunities.',
        body: [
          'The campaign history shows dedicated acquisition efforts around product themes including Garden Stakes, Hanging Products, Flamingo, Bunny/Panda, Aquarium and Deer, alongside catalogue and new-product campaigns.',
          'This allowed the media strategy to discover product-specific pockets of demand instead of forcing every product through the same advertising structure.',
        ],
        chips: ['Garden Stakes', 'Hanging Products', 'Flamingo', 'Bunny/Panda', 'Aquarium', 'Deer', 'Catalogue', 'New products'],
      },
      {
        type: 'timeline',
        label: 'Seasonal engine',
        headline: 'Built around',
        emphasis: 'the buying calendar.',
        body: 'The campaign history includes commercial pushes around key moments alongside new-product and catalogue campaigns — an iterative approach that adapts to seasonal demand rather than relying on a static setup.',
        steps: ['Valentine’s Day', 'Dussehra', 'Diwali', 'Christmas', 'New products', 'Catalogue / evergreen'],
      },
      {
        type: 'ledger',
        label: 'Scale vs efficiency',
        headline: 'The strongest story isn’t the highest ROAS.',
        emphasis: 'It’s scale and efficiency together.',
        columns: ['Proof point', 'Result', 'Campaign', 'Supporting metric'],
        rows: [
          ['Highest featured ROAS', '5.84x', 'Lookalike ABO', '85 purchases'],
          ['Largest purchase volume', '1,432', 'Customer Audience', '3.14x ROAS'],
          ['Large-scale acquisition', '1,404 purchases', 'Lookalike CBO', '3.70x ROAS'],
          ['Retargeting', '568 purchases', 'Sales Re-Target', '4.25x ROAS'],
        ],
        line: 'The objective wasn’t to chase the highest ROAS on a tiny budget. It was to find repeatable combinations of scale, efficiency and purchase volume.',
      },
      {
        type: 'insights',
        label: 'What the data tells us',
        headline: 'Five',
        emphasis: 'learnings.',
        items: [
          { title: 'Scale does not automatically mean sacrificing efficiency.', body: 'Several campaigns generated hundreds or more than a thousand purchases while remaining above 3x ROAS.' },
          { title: 'Product-specific campaigns created new growth pockets.', body: 'The campaign history shows that individual product themes could be isolated, tested and scaled.' },
          { title: 'Retargeting remained a valuable conversion layer.', body: 'The Sales Re-Target campaign delivered 568 purchases at 4.25x ROAS.' },
          { title: 'Audience structure mattered.', body: 'Lookalike, broad, customer-audience and Advantage+ structures each produced different performance profiles.' },
          { title: 'Testing created the winners.', body: 'The account accumulated performance through repeated iteration rather than depending on one permanent campaign.' },
        ],
      },
      {
        type: 'workstreams',
        label: 'Social media management',
        headline: 'Beyond performance.',
        emphasis: 'Building the brand people remember.',
        body: [
          'BrandGap’s work with The Decorshed extends beyond paid acquisition. We also manage the brand’s social media presence, translating its product catalogue into an ongoing stream of visual content, product storytelling and social-first communication.',
          'The Decorshed operates in the home and garden décor space, with collections spanning home décor, garden décor, hanging décor, planters, pots, aquarium accessories, spiritual décor and other decorative products. The social strategy gives these products a consistent visual presence while supporting launches, promotions and broader brand awareness.',
        ],
        rows: [
          ['Social media strategy', 'Content planning and platform strategy aligned with products, launches, promotions and seasonal moments.'],
          ['Content creation', 'Creative posts, carousels, reels and product-focused visual content designed to make the catalogue more engaging.'],
          ['Brand storytelling', 'Turning individual products and collections into visual stories that communicate the personality of The Decorshed.'],
          ['Campaign & promotion support', 'Social content that supports sales campaigns, new arrivals, seasonal promotions and key commercial moments.'],
        ],
        links: [
          { label: 'Instagram', href: 'https://www.instagram.com/thedecorshed/' },
          { label: 'Facebook', href: 'https://www.facebook.com/Decorshed' },
        ],
        line: 'From the first scroll to the final sale, BrandGap works across the funnel — combining social content and performance marketing to keep The Decorshed visible, relevant and conversion-ready.',
      },
    ],
    closing: {
      headline: 'Growth isn’t one campaign.',
      body: 'We treated paid media as an evolving system — testing audiences, products, campaign structures and seasonal moments until Meta Ads became a repeatable acquisition engine. Let’s build yours.',
    },
    tone: 'terracotta',
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'vibha-designs',
    published: true,
    index: '02',
    client: 'Vibha Designs',
    statement: 'Turning mindful products into measurable ecommerce growth.',
    category: 'Performance Marketing × Social Media',
    industries: ['D2C', 'E-commerce', 'Spiritual'],
    summary:
      'How BrandGap used Meta Ads, product-led campaigns, audience testing and retargeting to generate 3,689+ purchases from ₹12.23L+ in ad spend, with a 3.41x purchase ROAS in the account snapshot.',
    metrics: [
      { label: 'Purchases', value: '3,689+', note: 'Meta Ads Manager total' },
      { label: 'Ad spend', value: '₹12.23L+', note: 'Meta Ads Manager total' },
      { label: 'Purchase value', value: '₹41.68L+', note: 'Meta-attributed conversion value' },
      { label: 'Purchase ROAS', value: '3.41X', note: 'Meta Ads Manager average' },
    ],
    highlights: [2, 0, 3],
    strategy: ['Product-led acquisition', 'Full-funnel Meta activity', 'Audience testing', 'Seasonal & thematic campaigns', 'Scale the winners', 'Social media management'],
    flow: {
      problem: 'Turning meaning-led products into repeatable demand.',
      strategy: 'Product-led acquisition · Full-funnel Meta activity · Audience testing · Seasonal & thematic campaigns · Scale the winners',
      result: '3,689+ purchases and ₹41.68L+ Meta-attributed purchase value from ₹12.23L+ ad spend — 3.41x purchase ROAS (Ads Manager account snapshot).',
    },
    image: {
      src: '/work/vibha-cover-1600.webp',
      srcSet: '/work/vibha-cover-800.webp 800w, /work/vibha-cover-1600.webp 1600w',
      width: 1600,
      height: 900,
      position: 'center',
      alt: 'Vibha Designs website — Rakshak, a guided Hanuman Chalisa journal',
    },
    gallery: [
      {
        src: '/work/vibha-gallery-1-1600.webp',
        srcSet: '/work/vibha-gallery-1-800.webp 800w, /work/vibha-gallery-1-1600.webp 1600w',
        width: 1600,
        height: 900,
        position: 'top',
        alt: 'Vibha Designs website — bundles, card decks and journals',
      },
      {
        src: '/work/vibha-gallery-2-1600.webp',
        srcSet: '/work/vibha-gallery-2-800.webp 800w, /work/vibha-gallery-2-1600.webp 1600w',
        width: 1600,
        height: 900,
        position: 'top',
        alt: 'Vibha Designs website — product unboxing videos',
      },
    ],
    website: 'https://vibhadesigns.com/',
    // The numbers panel. Headline figures: Ads Manager account totals. Graph: the four scale
    // campaigns from the supplied campaign export, cumulative (₹ in lakh), ordered by ROAS.
    graph: {
      title: 'Scale campaigns · spend → attributed value',
      xMax: 10,
      yMax: 36,
      xTicks: [0, 2, 4, 6, 8, 10],
      yTicks: [0, 12, 24, 36],
      points: [
        { id: 'start', x: 0, y: 0 },
        { id: 'shop-all', x: 2.03, y: 8.19, name: 'Shop All', value: '₹8.19L', roas: '4.02X' },
        { id: 'retarget', x: 3.39, y: 13.59, name: 'Re-Targeting', value: '₹5.40L', roas: '3.96X' },
        { id: 'rakshak', x: 6.44, y: 25.23, name: 'Rakshak', value: '₹11.64L', roas: '3.82X' },
        { id: 'likhit', x: 8.66, y: 33.67, name: 'Likhit Japa', value: '₹8.44L', roas: '3.80X' },
      ],
    },
    panelCaption:
      'Figures: Meta Ads Manager account totals, 4 Sep 2023 – 4 Oct 2026. Graph: the four highest-volume campaigns from the supplied campaign export, cumulative.',
    seo: {
      title: 'Vibha Designs Case Study | Meta Ads & Ecommerce Growth',
      description:
        'See how BrandGap helped Vibha Designs generate 3,689+ purchases with ₹12.23L+ in Meta ad spend and a 3.41x purchase ROAS through product-led performance marketing.',
    },
    story: [
      {
        type: 'intro',
        label: 'The brand',
        headline: 'Products built around',
        emphasis: 'meaning.',
        body: [
          'Vibha Designs is a purpose-led ecommerce brand built around mindful living, self-development, spirituality and ancient wisdom. Its product ecosystem includes journals, card decks, bundles and guided practices designed to help customers pause, reflect and grow.',
          'Products such as Likhit Japa, Rakshak, Shivaank, the Bhagavad Gita card deck and the Rumi, Stoic, Self-Love and Financial Abundance decks give the work a strong storytelling angle: paid media is not simply selling objects, but translating ideas, rituals and wisdom into ecommerce demand.',
        ],
        chips: ['Likhit Japa', 'Rakshak', 'Shivaank', 'Bhagavad Gita deck', 'Rumi', 'Stoic', 'Self-Love', 'Financial Abundance'],
      },
      {
        type: 'intro',
        label: 'The challenge',
        headline: 'The product had meaning.',
        emphasis: 'The challenge was turning that meaning into repeatable demand.',
        body: [
          'Vibha Designs operates in a category where customers often discover products through ideas, beliefs, interests and personal aspirations before they become buyers — which makes the performance-marketing challenge broader than pushing a catalogue.',
          'The acquisition system needed to create awareness, introduce customers to the brand, identify high-intent product audiences, retarget interested users and scale the products that demonstrated real purchase demand.',
        ],
      },
      {
        type: 'pillars',
        label: 'The strategy',
        ground: 'blush',
        headline: 'Five moves,',
        emphasis: 'one performance engine.',
        items: [
          { title: 'Product-led acquisition', body: 'Campaigns were structured around specific products and product families such as Likhit Japa, Rakshak, Shivaank, card decks and bundles, giving individual offers room to prove their own demand.' },
          { title: 'Full-funnel Meta activity', body: 'The account was not limited to purchase campaigns. Awareness, traffic, Instagram follower acquisition and sales campaigns worked together to create multiple entry points into the brand.' },
          { title: 'Audience testing', body: 'Broad, lookalike, retargeting and different campaign structures were tested to identify combinations that could generate purchases efficiently.' },
          { title: 'Seasonal & thematic campaigns', body: 'Campaigns were aligned with relevant moments such as Hanuman Jayanti, Rakshak / Mother’s Day and other product-led promotional windows.' },
          { title: 'Scale the winners', body: 'Once products and campaign structures demonstrated strong purchase economics, spend could be concentrated around those opportunities.' },
        ],
      },
      {
        type: 'ledger',
        label: 'Results snapshot',
        headline: 'The account,',
        emphasis: 'in numbers.',
        columns: ['Metric', 'Value'],
        rows: [
          ['Total spend', '₹12,23,510.00'],
          ['Purchases', '3,689'],
          ['Purchase conversion value', '₹41,68,366.95'],
          ['Purchase ROAS', '3.41x'],
          ['Cost per purchase', '₹331.66'],
          ['Adds-to-cart conversion value', '₹6,07,719.48'],
        ],
        note: 'Meta Ads Manager account-level totals, 4 Sep 2023 – 4 Oct 2026. Purchases can include repeat orders from the same customer.',
      },
      {
        type: 'proof',
        image: {
          src: '/work/vibha-ads-manager-1600.webp',
          srcSet: '/work/vibha-ads-manager-800.webp 800w, /work/vibha-ads-manager-1600.webp 1546w',
          width: 1546,
          height: 627,
          alt: 'Meta Ads Manager — Vibha Designs campaigns, with an account total of 3,689 purchases, ₹41,68,366.95 purchase conversion value and 3.41 purchase ROAS.',
        },
        caption:
          'Meta Ads Manager — campaign view with the account-level total row (4 Sep 2023 – 4 Oct 2026). Supplied by BrandGap. The campaign cards below come from a later campaign export, so individual rows differ slightly.',
      },
      {
        type: 'cards',
        label: 'Campaign winners',
        headline: 'Where scale and efficiency',
        emphasis: 'met.',
        intro: 'Campaign-level figures from the supplied campaign export.',
        items: [
          { kicker: '3.80x ROAS', title: 'Likhit Japa', meta: '1,068 purchases · ₹2.22L spend · ₹8.44L attributed value', body: 'The largest purchase-volume campaign in the supplied export, turning a focused product proposition into more than 1,000 purchases.' },
          { kicker: '3.82x ROAS', title: 'Rakshak', meta: '732 purchases · ₹3.05L spend · ₹11.64L attributed value', body: 'A major scale driver, producing 732 purchases and more than ₹11.6L in Meta-attributed purchase value at 3.82x ROAS.' },
          { kicker: '4.02x ROAS', title: 'Shop All', meta: '547 purchases · ₹2.03L spend · ₹8.19L attributed value', body: 'One of the strongest scale performers in the account, delivering 547 purchases while maintaining a 4.02x ROAS.' },
          { kicker: '3.96x ROAS', title: 'Re-Targeting', meta: '357 purchases · ₹1.36L spend · ₹5.40L attributed value', body: 'Retargeting brought high-intent users back into the purchase journey, generating 357 purchases at 3.96x ROAS.' },
          { kicker: '4.16x ROAS', title: 'Jayanti Sales', meta: '23 purchases · ₹11,022.88 spend · ₹45,824.50 attributed value', body: 'A seasonal sales campaign built around a relevant cultural moment, producing 23 purchases at more than 4x ROAS.' },
          { kicker: '6.86x ROAS', title: 'Rakshak · Mother’s Day', meta: '7 purchases · ₹2,269.84 spend · ₹15,576.25 attributed value', body: 'A small but highly efficient thematic campaign, showing how a relevant product moment can unlock strong purchase economics.' },
          { kicker: '3.30x ROAS', title: 'Shivaank ABO', meta: '38 purchases · ₹22.92K spend · ₹75.70K attributed value', body: 'A focused product campaign for Shivaank generated 38 purchases at 3.30x ROAS.' },
          { kicker: '3.17x ROAS', title: 'Likhit Japa (earlier)', meta: '144 purchases · ₹55.31K spend · ₹1.75L attributed value', body: 'An earlier Likhit Japa campaign also delivered 144 purchases at 3.17x ROAS, showing repeatability around the product.' },
        ],
      },
      {
        type: 'ledger',
        label: 'The scale story',
        headline: 'Finding products that could',
        emphasis: 'carry the growth.',
        columns: ['Scale proof', 'Campaign', 'ROAS'],
        rows: [
          ['1,068 purchases', 'Sales_Likhit_Japa_27/08/26', '3.80x'],
          ['732 purchases', 'Sales || Rakshak || 15/05', '3.82x'],
          ['622 purchases', 'Sales Journal_09/12/25', '2.86x'],
          ['547 purchases', 'Sales || Shop All || 15/05/26', '4.02x'],
          ['357 purchases', 'Sales || Re-Target || 09/05', '3.96x'],
        ],
        line: 'The goal wasn’t simply to find the campaign with the highest ROAS. It was to identify products and audiences that could maintain healthy economics while generating meaningful purchase volume.',
      },
      {
        type: 'timeline',
        label: 'Full-funnel marketing',
        headline: 'Not every customer starts with',
        emphasis: '“Buy now.”',
        body: 'The account includes dedicated awareness, traffic, Instagram follower acquisition and purchase campaigns, working across the customer journey rather than judging every campaign by immediate purchase volume. The supplied export records 2,061 Instagram follows, 6,783 add-to-cart events and 6,340 initiated checkouts across the exported campaign rows — supporting activity metrics, not unique users.',
        steps: ['Awareness', 'Traffic', 'Social', 'Purchase', 'Retargeting'],
      },
      {
        type: 'timeline',
        label: 'Seasonal & cultural relevance',
        headline: 'Marketing the moment,',
        emphasis: 'not just the product.',
        body: 'The campaign history includes Hanuman Jayanti awareness, Jayanti Sales, Rakshak Mother’s Day and other product-led moments. For a brand rooted in spirituality, wisdom and mindful living, contextual campaigns connect product propositions with moments that already carry emotional or cultural relevance.',
        steps: ['Hanuman Jayanti', 'Mother’s Day', 'Product launches', 'Thematic product campaigns', 'Evergreen acquisition'],
      },
      {
        type: 'insights',
        label: 'What the data tells us',
        headline: 'Five',
        emphasis: 'learnings.',
        items: [
          { title: 'Product specificity matters.', body: 'Likhit Japa and Rakshak both produced high-volume campaigns with healthy ROAS, showing the value of giving strong products dedicated acquisition structures.' },
          { title: 'Retargeting is a major conversion layer.', body: 'The 357-purchase retargeting campaign delivered 3.96x ROAS, bringing high-intent users back into the buying journey.' },
          { title: 'Scale and efficiency can coexist.', body: 'Shop All, Rakshak and Likhit Japa all produced hundreds or more than a thousand purchases while remaining around 3.8–4.0x ROAS.' },
          { title: 'Full-funnel activity supports the brand.', body: 'Awareness, traffic and follower campaigns created touchpoints beyond direct purchase campaigns.' },
          { title: 'Thematic relevance can improve efficiency.', body: 'Campaigns tied to relevant moments such as Jayanti and Mother’s Day produced strong performance in the supplied dataset.' },
        ],
      },
      {
        type: 'workstreams',
        label: 'Social media management',
        headline: 'Building the brand',
        emphasis: 'beyond the product page.',
        body: [
          'BrandGap also manages Vibha Designs’ social media presence, giving the brand a consistent space to communicate its philosophy, showcase products, educate audiences and turn ideas around mindfulness, spirituality and self-development into engaging visual content.',
          'Social media makes the products discoverable before a customer is ready to purchase: content can introduce a product, explain its purpose, create familiarity with the brand and support launches or campaigns that are later amplified through paid media.',
        ],
        rows: [
          ['Content strategy', 'Planning content around products, brand philosophy, education, inspiration and relevant moments.'],
          ['Creative content', 'Developing posts, carousels, reels and product-led creatives that fit the Vibha Designs identity.'],
          ['Product storytelling', 'Communicating the meaning, use and context behind journals, card decks, bundles and other products.'],
          ['Campaign support', 'Creating social content that supports launches, promotions, seasonal moments and paid advertising campaigns.'],
        ],
        links: [{ label: 'Instagram', href: 'https://www.instagram.com/vibhadesigns30/' }],
        line: 'From the first scroll to the final sale, BrandGap connects social content and performance marketing to keep Vibha Designs visible, relevant and conversion-ready.',
      },
    ],
    closing: {
      headline: 'Growth can be thoughtful too.',
      body: 'Performance marketing doesn’t have to strip away a brand’s meaning. We find the audiences, products and moments where a meaningful proposition becomes a measurable purchase.',
    },
    tone: 'blush',
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'healer-priya-agrawal',
    published: true,
    index: '03',
    client: 'Healer Priya Agrawal',
    statement: 'Building a digital brand from zero.',
    category: 'Social Media × Digital Brand Growth',
    industries: ['Personal Brand', 'Spiritual', 'E-commerce'],
    summary:
      'How BrandGap built Healer Priya Agrawal’s digital presence from zero — across social media, YouTube, a brand website and an ecommerce store.',
    metrics: [
      { label: 'Starting point', value: '0', note: 'The client-work starting point' },
      { label: 'Social followers', value: '200K+', note: 'Currently reported by the Healer of the Ages website' },
      { label: 'Products on the site', value: '100+', note: 'Current website catalogue' },
      { label: 'Website reviews', value: '4.92/5', note: 'Current website — 50 reviews' },
    ],
    highlights: [0, 1, 2],
    strategy: ['Social media', 'YouTube content engine', 'Brand website', 'Ecommerce', 'Content strategy'],
    flow: {
      problem: 'There was no audience to manage — the engagement started from zero.',
      strategy: 'Content and publishing system · YouTube content engine · Brand website · Ecommerce · Multi-platform brand',
      result: 'A connected digital brand across YouTube, Instagram, Facebook, website and ecommerce. 200K+ followers are reported by the client’s website today.',
    },
    // Client-supplied screenshots of the Healer of the Ages website (floating chat widgets removed).
    image: {
      src: '/work/healer-main-1600.webp',
      srcSet: '/work/healer-main-800.webp 800w, /work/healer-main-1600.webp 1600w',
      width: 1600,
      height: 900,
      position: 'top',
      alt: 'Healer of the Ages website — homepage with the Crystal Bracelets collection banner',
    },
    gallery: [
      {
        src: '/work/healer-gallery-1-1600.webp',
        srcSet: '/work/healer-gallery-1-800.webp 800w, /work/healer-gallery-1-1600.webp 1600w',
        width: 1600,
        height: 900,
        position: 'top',
        alt: 'Healer of the Ages website — new arrivals and the Divine Attars collection',
      },
      {
        src: '/work/healer-gallery-2-1600.webp',
        srcSet: '/work/healer-gallery-2-800.webp 800w, /work/healer-gallery-2-1600.webp 1600w',
        width: 1600,
        height: 900,
        position: 'top',
        alt: 'Healer of the Ages website — the About section and Instagram reels',
      },
    ],
    website: 'https://healeroftheages717.com/',
    // No ad-spend or time-series data for this case, so the panel shows its figures without a chart.
    graph: null,
    panelMetrics: [
      { label: 'Starting point', value: '0' },
      { label: 'Social followers*', value: '200K+' },
      { label: 'Views · one featured video', value: '22,345' },
      { label: 'Products on the site', value: '100+' },
      { label: 'Website rating', value: '4.92/5' },
    ],
    panelCaption:
      '* Social following as currently reported by the Healer of the Ages website; rating from 50 website reviews; views from one February 2024 YouTube video — current proof points, not historical growth metrics.',
    seo: {
      title: 'Healer Priya Agrawal Case Study | Social Media & Digital Brand Growth',
      description:
        'See how BrandGap built Healer Priya Agrawal’s digital presence from zero across social media, YouTube, website and ecommerce.',
    },
    story: [
      {
        type: 'intro',
        label: 'The starting point',
        headline: 'There was no audience to manage.',
        emphasis: 'We had to build one.',
        body: [
          'BrandGap’s engagement with Healer Priya Agrawal began from the ground up. The goal was not simply to manage an existing social account, but to build a recognizable digital presence around Priya’s expertise in tarot, spiritual guidance, healing and Vastu — and then extend that presence into a connected digital ecosystem.',
          'There was no established content machine to maintain and no ready-made website funnel connecting content, community and commerce. So the work started with foundations: define the digital identity, establish content formats, create publishing consistency, develop the website and connect the audience journey across platforms.',
        ],
      },
      {
        type: 'ledger',
        label: 'The transformation',
        headline: 'From a personal practice',
        emphasis: 'to a digital ecosystem.',
        columns: ['Starting point', 'BrandGap-built direction'],
        rows: [
          ['0 → Social presence', 'Built the content and publishing system around Priya’s voice, expertise and spiritual niche.'],
          ['0 → YouTube content engine', 'Built a dedicated tarot content destination around Hindi readings, guidance and pick-a-card formats.'],
          ['0 → Brand website', 'Created an owned digital destination connecting the personal brand, healing identity, products and customer journey.'],
          ['0 → Ecommerce ecosystem', 'Developed a shop experience around crystals, bracelets, pendants, attars, malas, gemstones, pooja samagri and spiritual products.'],
          ['0 → Multi-platform brand', 'Connected YouTube, Instagram, Facebook and the website into one recognizable brand ecosystem.'],
        ],
      },
      {
        type: 'intro',
        label: 'Brand positioning',
        headline: 'One person. Multiple touchpoints.',
        emphasis: 'One recognizable brand.',
        body: [
          'The brand was built around Priya as the central trust layer. Tarot and spiritual guidance create the audience relationship; educational and inspirational content creates recurring attention; the website gives the audience an owned destination; and the store provides products that extend the brand experience beyond content.',
        ],
      },
      {
        type: 'pillars',
        label: 'Content strategy',
        ground: 'blush',
        headline: 'Five',
        emphasis: 'content pillars.',
        items: [
          { title: 'Tarot as the content engine', body: 'YouTube content focuses on Hindi tarot readings, pick-a-card formats, timeless readings, love/career guidance, destiny themes and spiritual messages.' },
          { title: 'Education + inspiration', body: 'Content is designed not only to entertain, but to give viewers concepts, guidance and practical spiritual perspectives they can return to.' },
          { title: 'Personality-led trust', body: 'Priya remains central to the communication, so the audience connects with a recognizable person rather than an anonymous content brand.' },
          { title: 'Content → community → commerce', body: 'The ecosystem creates a path from free content and social discovery toward deeper engagement, personal consultations and products.' },
          { title: 'Consistency over isolated virality', body: 'The objective is an audience asset that compounds over time through repeatable formats, recognizable topics and a consistent visual identity.' },
        ],
      },
      {
        type: 'intro',
        label: 'YouTube growth',
        headline: 'Turning tarot content into',
        emphasis: 'an audience engine.',
        body: [
          'The YouTube channel was built as a dedicated home for Priya’s tarot content, positioned around spiritual guidance and wisdom through tarot readings — including love, career and spirituality — primarily in Hindi.',
          'Repeatable formats such as Pick a Card, timeless readings, destiny messages, next-7-days readings, relationship themes, career guidance and spiritual messages create a library that keeps attracting viewers beyond the day a video is published. One February 2024 Pick-a-Card video, for example, has 22,345 views and 2,100 likes — a single-video proof point, not a channel total.',
        ],
      },
      {
        type: 'workstreams',
        label: 'Social media management',
        headline: 'Building familiarity',
        emphasis: 'one post at a time.',
        body: [
          'Instagram and Facebook provide the shorter-form, higher-frequency layer of the brand — recurring touchpoints around tarot, spirituality, healing, guidance, products and community moments — while YouTube provides the deeper long-form destination.',
        ],
        rows: [
          ['Instagram', 'Personal-brand visibility, community and daily content'],
          ['Facebook', 'Community and content distribution'],
          ['YouTube', 'Long-form tarot and spiritual guidance'],
        ],
        links: [
          { label: 'Instagram', href: 'https://www.instagram.com/healerpriyaagrawal' },
          { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100091345584830' },
          { label: 'YouTube', href: 'https://www.youtube.com/@healeroftheages717tarot' },
        ],
      },
      {
        type: 'intro',
        label: 'Website & ecommerce',
        headline: 'Social media creates attention.',
        emphasis: 'The website gives the brand somewhere to take it.',
        body: [
          'BrandGap also developed the Healer of the Ages website as the owned digital layer of the brand. It brings the brand story, spiritual and healing identity, ecommerce catalogue, reviews and customer information into one destination.',
          'The site describes the brand as a sacred space set up by Spiritual Healer Priya Agrawal. Its shop currently lists 100+ products across bracelets, pendants, attars, malas, gemstones, crystals, pooja samagri, rings, tumblestones, yantras and related spiritual products.',
        ],
        chips: ['Bracelets', 'Pendants', 'Attars', 'Malas', 'Gemstones', 'Crystals', 'Pooja samagri', 'Rings', 'Yantras'],
      },
      {
        type: 'timeline',
        label: 'The digital ecosystem',
        headline: 'Content at the top. Commerce at the bottom.',
        emphasis: 'Brand connecting everything.',
        body: 'YouTube brings depth, education and recurring discovery; Instagram daily visibility, community and personality; Facebook distribution; the website a brand home, trust and product discovery; and the store the purchase and the customer relationship.',
        steps: ['Discover', 'Watch', 'Follow', 'Explore', 'Shop'],
      },
      {
        type: 'ledger',
        label: 'Brand-building proof points',
        headline: 'What the brand',
        emphasis: 'looks like today.',
        columns: ['Proof point', 'Value'],
        rows: [
          ['Starting point', '0'],
          ['Social following', '200K+ followers, reported by the current website'],
          ['YouTube proof point', '22,345 views + 2,100 likes on one Feb 2024 Pick-a-Card video'],
          ['Website catalogue', '100+ products'],
          ['Website reviews', '4.92/5 from 50 reviews'],
          ['Digital ecosystem', 'YouTube + Instagram + Facebook + Website + Ecommerce'],
        ],
        note: 'Current, site- and platform-reported proof points — not historical growth metrics attributed solely to BrandGap.',
      },
      {
        type: 'insights',
        label: 'What the work demonstrates',
        headline: 'Five',
        emphasis: 'brand-building insights.',
        items: [
          { title: 'We built the audience, not just the posts.', body: 'The engagement began from 0, so the value is in creating the underlying system, not merely maintaining an existing following.' },
          { title: 'The personal brand became a media brand.', body: 'Priya’s expertise became repeatable content formats that could live across platforms.' },
          { title: 'Content became a distribution engine.', body: 'YouTube provides long-form discovery while Instagram and Facebook create frequent touchpoints.' },
          { title: 'The brand gained an owned destination.', body: 'The website reduces dependence on social platforms by giving the audience a place to learn, explore and purchase.' },
          { title: 'Social and commerce became connected.', body: 'The same brand now operates across education, community, guidance and products.' },
        ],
      },
    ],
    closing: {
      headline: 'Turn your expertise into a brand.',
      body: 'Starting from zero, we turned Priya Agrawal’s practice into one connected brand across content, community, YouTube, a website and a store. Let’s build the ecosystem around yours.',
    },
    tone: 'blush',
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'ambaji-marble-house',
    published: true,
    index: '04',
    client: 'Ambaji Marble House',
    statement: 'Turning local visibility into real customer conversations.',
    category: 'Meta Ads × Lead Generation',
    industries: ['Local Business'],
    summary:
      'How BrandGap combined large-scale Meta reach with messaging-led lead generation to put Ambaji Marble House in front of more than 9.3 million people and generate 1,087 messaging contacts.',
    metrics: [
      { label: 'Messaging contacts', value: '1,087', note: 'Account-level total' },
      { label: 'Reach', value: '9.30M+', note: 'Account-level total' },
      { label: 'Impressions', value: '21.76M+', note: 'Account-level total' },
      { label: 'Ad spend', value: '₹1.30L+', note: 'Account-level total' },
    ],
    highlights: [0, 1, 3],
    strategy: ['Market-wide awareness', 'Messaging-led acquisition', 'KPI separation', 'Intent optimization', 'Efficient reach'],
    flow: {
      problem: 'For a high-consideration local business, attention only matters when it can become a conversation.',
      strategy: 'Build market-wide visibility · Turn attention into conversations · Separate awareness from direct response',
      result: '9.3M+ people reached, 21.7M+ impressions and 1,087 messaging contacts across the reporting period (account-level totals).',
    },
    // No website or imagery for this client: the case is text-led throughout.
    image: null,
    gallery: [],
    website: null,
    // The numbers panel. Graph: cumulative spend → messaging contacts per campaign, from the
    // Ads Manager account view (₹ in lakh). Reach is not summed — it isn't additive across campaigns.
    graph: {
      title: 'Campaigns · spend → messaging contacts',
      valueLabel: 'Messaging contacts',
      yFormat: 'count',
      ratio: 'cost',
      breakEven: false,
      xMax: 1.4,
      yMax: 1200,
      xTicks: [0, 0.4, 0.8, 1.2],
      yTicks: [0, 400, 800, 1200],
      points: [
        { id: 'start', x: 0, y: 0 },
        { id: 'leads', x: 0.7931, y: 1065, name: 'Leads || 18/3/26', value: '1,065', roas: '₹74.47 / contact' },
        { id: 'awareness', x: 1.3073, y: 1087, name: '+ Marble Awareness', value: '1,087', roas: '₹120.27 / contact' },
      ],
    },
    panelCaption:
      'Meta Ads Manager account view, 8 Sep 2023 – 8 Oct 2026. Messaging contacts are platform-attributed conversations — not qualified leads or customers.',
    seo: {
      title: 'Ambaji Marble House Case Study | Meta Ads & Lead Generation',
      description:
        'See how BrandGap used Meta Ads awareness and messaging campaigns to reach 9.3M+ people and generate 1,087 messaging contacts for Ambaji Marble House.',
    },
    story: [
      {
        type: 'intro',
        label: 'The engagement',
        headline: 'A local-service',
        emphasis: 'acquisition funnel.',
        body: [
          'Ambaji Marble House is a different kind of performance-marketing engagement from our ecommerce case studies. The work centred on Meta Ads for brand awareness and lead generation through messaging.',
          'Two complementary objectives shaped the account: a large-scale awareness campaign designed to maximize reach, and a messaging campaign designed to generate conversations from people interested enough to contact the business. Awareness creates market presence; messaging provides the direct-response layer.',
        ],
      },
      {
        type: 'intro',
        label: 'The challenge',
        headline: 'In local business, attention only matters',
        emphasis: 'when it can become a conversation.',
        body: [
          'For a local, high-consideration business such as a marble house, customers typically need more than a single ad impression before they are ready to enquire.',
          'The challenge was twofold: create enough local visibility to build familiarity, while giving high-intent prospects a direct path to ask questions and start a conversation.',
        ],
      },
      {
        type: 'pillars',
        label: 'The strategy',
        ground: 'blush',
        headline: 'Two objectives. Two jobs.',
        emphasis: 'One acquisition system.',
        items: [
          { title: 'Build market-wide visibility', body: 'The Marble Awareness campaign was designed around reach, placing the brand in front of more than 9 million people during the reporting period.' },
          { title: 'Turn attention into conversations', body: 'The Leads campaign used messaging as the conversion mechanism, generating more than 1,000 messaging conversations started.' },
          { title: 'Separate awareness from direct response', body: 'Instead of forcing one campaign to do everything, the account gave awareness and lead generation distinct roles, so each could be judged against the right KPI.' },
          { title: 'Optimize toward customer intent', body: 'The messaging campaign focused on people willing to take the next step and initiate a conversation — more commercially meaningful than reach alone.' },
          { title: 'Maintain efficient reach', body: 'The awareness campaign delivered reach at approximately ₹5.66 per 1,000 people reached, a cost-efficient top-of-funnel layer.' },
        ],
      },
      {
        type: 'ledger',
        label: 'Results snapshot',
        headline: 'The account,',
        emphasis: 'in numbers.',
        columns: ['Metric', 'Value'],
        rows: [
          ['Total ad spend', '₹1,30,731.72'],
          ['Messaging contacts', '1,087'],
          ['New messaging contacts', '978'],
          ['Reach', '9,306,311'],
          ['Impressions', '21,762,730'],
          ['Cost per messaging conversation', '₹79.15'],
          ['Awareness reach', '9,084,858'],
          ['Awareness cost per 1,000 reached', '₹5.66'],
        ],
        note: 'Meta Ads Manager account-level totals, 8 Sep 2023 – 8 Oct 2026. Messaging contacts are platform-attributed conversations — not qualified leads or customers.',
      },
      {
        type: 'ledger',
        label: 'Campaign breakdown',
        headline: 'An awareness-to-conversation',
        emphasis: 'funnel.',
        columns: ['Campaign', 'Objective', 'Result', 'Spend', 'Efficiency'],
        rows: [
          ['Marble Awareness', 'Reach', '9,084,858 reached', '₹51,424.19', '₹5.66 / 1,000 reached'],
          ['Leads || 18/3/26', 'Messaging conversations', '1,002 conversations', '₹79,307.53', '₹79.15 / conversation'],
        ],
      },
      {
        type: 'engines',
        label: 'Two engines',
        headline: 'Awareness creates the audience.',
        emphasis: 'Conversations create the opportunity.',
        items: [
          {
            kicker: 'The awareness engine',
            title: 'Put the name in front of the market.',
            value: '9.08M',
            unit: 'people reached',
            body: 'The Marble Awareness campaign delivered 9,084,858 people reached and 21,059,698 impressions from ₹51,424.19 in spend — a large visibility layer at ₹5.66 per 1,000 people reached. Its job was familiarity and repeated exposure, not lead generation.',
          },
          {
            kicker: 'The messaging engine',
            title: 'From scrolling to starting a conversation.',
            value: '1,002',
            unit: 'messaging conversations',
            body: 'The Leads || 18/3/26 campaign generated 1,002 messaging conversations started from ₹79,307.53, at ₹79.15 per conversation. Across both campaigns the account records 1,087 messaging contacts, 978 of them new.',
          },
        ],
        line: 'Useful for high-consideration purchases, where customers want to ask about pricing, materials, availability, designs or delivery before they decide.',
      },
      {
        type: 'insights',
        label: 'What the data tells us',
        headline: 'Five',
        emphasis: 'learnings.',
        items: [
          { title: 'Awareness and lead generation should not be judged by the same KPI.', body: 'The awareness campaign succeeded through reach and efficient exposure; the messaging campaign succeeded through conversations.' },
          { title: 'Messaging can create a direct response path for high-consideration businesses.', body: '1,002 messaging conversations came from the dedicated lead campaign, giving interested prospects a direct route to the business.' },
          { title: 'Reach efficiency matters when building a local market.', body: 'The awareness campaign reached more than 9 million people at ₹5.66 per 1,000 reached.' },
          { title: 'Frequency supports repeated brand exposure.', body: 'The awareness campaign recorded a frequency of 2.32 and the messaging campaign 2.81 — people saw the brand more than once on average.' },
          { title: 'The next layer of measurement is lead quality.', body: 'This dataset proves conversations, not qualified sales. A CRM or sales-outcome layer would let future reporting cover qualified leads, appointments, quotations and revenue.' },
        ],
      },
    ],
    closing: {
      headline: 'Conversations are where growth begins.',
      body: 'We built widespread market visibility first, then gave interested prospects a direct path to start a conversation. Let’s build the same acquisition system for your business.',
    },
    tone: 'ink',
  },
]

/** Content Brief §07 — "More work" cards. No metrics are given for these, so none are shown. */
export const MORE_WORK = [
  { id: 'petsway', client: 'Petsway', industry: 'Pet E-commerce', services: 'Performance Marketing, Meta Ads, Content' },
  { id: 'rugs-and-roses', client: 'Rugs & Roses', industry: 'Home Décor & Carpets', services: 'Performance, Social, Creative Strategy' },
  { id: 'omni-infra-heights', client: 'Omni Infra Heights', industry: 'Real Estate', services: 'Lead Gen, Meta Ads, Funnel Strategy' },
  { id: 'global-ayurveda', client: 'Global Ayurveda', industry: 'Wellness / D2C', services: 'Performance, Product Campaigns' },
  { id: 'immigrationpointer', client: 'ImmigrationPointer', industry: 'Immigration Services', services: 'Digital Marketing, SEO, Lead Gen' },
]

/** The address shown in a case's browser frames: 'brand.com' from a real URL, or the brand name. */
export const siteAddress = (project) =>
  project.website && !/^\[.*\]$/.test(project.website.trim())
    ? project.website.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : project.client

export const PUBLISHED_PROJECTS = PROJECTS.filter((p) => p.published)

export const findProject = (slug) => PUBLISHED_PROJECTS.find((p) => p.slug === slug)
