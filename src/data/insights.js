/**
 * Insights (blog). Three launch articles, one per category (brief §3, §7).
 *
 *   slug          URL: /insights/[slug]
 *   date          ISO publish date
 *   author        brand attribution — the team writes as "we", no personal bylines
 *   seoTitle      optional <title> override (otherwise `title`)
 *   description   meta description
 *   image         hero { src, srcSet, width, height, alt } — original BrandGap
 *                 artwork in public/insights (made for these articles, no licence needed)
 *   card          the same artwork composed at 4:5, for the smaller cards
 *   ogImage       1200×630 share image
 *   related       slugs of related articles
 *   cta           the closing call to action's headline and line
 *   body          content blocks:
 *                   'text'                    a paragraph (supports **bold** and [label](/path))
 *                   { h2 } | { h3 }           headings
 *                   { ul: [] } | { ol: [] }   lists
 *                   { checklist: { title, items } }
 *                   { table: { caption, head, rows } }
 *                   { example: { label, title, body: [blocks] } }   clearly labelled illustrative examples
 *                   { quote }                 a pull line
 *
 * Every number inside an example is illustrative and labelled as such — none
 * of it is a BrandGap or client result.
 */
export const INSIGHT_CATEGORIES = ['Ad teardowns', 'Meta Ads playbooks', 'Creative breakdowns']

export const INSIGHTS_INTRO = {
  title: 'Ideas from',
  emphasis: 'the gap.',
  line: 'Notes from the gap between brand and growth.',
  intro: 'Ad teardowns, Meta Ads playbooks and creative breakdowns — practical notes on closing the gap between brand and growth.',
}

export const ARTICLE_AUTHOR = 'The BrandGap Team'

const img = (name, alt) => ({
  src: `/insights/${name}-1600.webp`,
  srcSet: `/insights/${name}-800.webp 800w, /insights/${name}-1600.webp 1600w`,
  sizes: '(min-width: 1440px) 1344px, 100vw',
  width: 1600,
  height: 900,
  alt,
})

const card = (name, alt) => ({
  src: `/insights/${name}-card-1200.webp`,
  srcSet: `/insights/${name}-card-600.webp 600w, /insights/${name}-card-1200.webp 1200w`,
  sizes: '(min-width: 768px) 20vw, 40vw',
  width: 1200,
  height: 1500,
  alt,
})

export const ARTICLES = [
  /* ------------------------------------------------------------------ */
  {
    slug: 'meta-ads-stop-working',
    published: true,
    title: 'Why Most Meta Ads Stop Working — And What to Fix Before Increasing Spend',
    seoTitle: 'Why Meta Ads Stop Working — Fix This Before You Increase Spend',
    category: 'Ad teardowns',
    excerpt:
      'An ad that stops performing is rarely a budget problem. Before you raise spend or brief ten new creatives, find out which part of the system actually broke.',
    description:
      'A practical teardown of why Meta ads stop performing — creative fatigue, audience saturation, offer and landing-page gaps — and a diagnostic framework to use before you increase budget.',
    author: ARTICLE_AUTHOR,
    date: '2026-10-08',
    image: img('meta-ads-teardown', 'An illustrated ad teardown: a social ad on a phone, annotated with notes on the hook, offer, click-through rate and landing page.'),
    card: card('meta-ads-teardown', 'An annotated social ad on a phone, marked up at the hook, offer, click-through rate and landing page.'),
    ogImage: '/insights/meta-ads-teardown-og.jpg',
    tone: 'blush',
    related: ['meta-ads-playbook-d2c', 'creative-that-converts'],
    cta: {
      headline: 'Find the gap before you scale the spend.',
      body: 'Tell us which campaigns have slowed down. We’ll help you work out whether it’s the creative, the audience, the offer or the page — and what to fix first.',
    },
    body: [
      'Your ad isn’t always the problem.',
      'When a campaign that was working starts to slide, the usual reaction is one of two moves: increase the budget to “push through it”, or brief a batch of new creatives and hope one sticks. Both feel productive. Both often make things worse — because neither starts with a diagnosis.',
      'We see the same pattern across accounts. Performance drops, and the team treats it as a creative problem when it’s really an offer gap, or treats it as an audience problem when the landing page quietly stopped converting. Spend goes up. The real issue stays where it was.',
      'This teardown is about finding that issue first.',

      { h2: 'Why a working ad stops working' },
      'Ads don’t fail for one reason. They fail because one part of a chain weakens — and the symptom shows up somewhere else. The most common causes:',
      {
        ul: [
          '**Creative fatigue.** The people most likely to respond have already seen the ad, often several times. Attention drops, and the ad starts reaching people who were never going to care.',
          '**A weak hook.** The first second doesn’t earn the second. This is often hidden while an ad is new and the audience is warm, then exposed as delivery widens.',
          '**Audience saturation.** The pool you’re reaching is too small for the spend you’re putting through it. Frequency climbs and costs follow.',
          '**Poor offer positioning.** People are interested in the product but not convinced by the deal — price, bundle, guarantee or reason to buy now.',
          '**Landing-page mismatch.** The ad promises one thing and the page delivers another: a different product, a different price, a slower experience, a generic homepage.',
        ],
      },
      'Each of these leaves a different fingerprint in your numbers. That’s what makes diagnosis possible.',

      { h2: 'Read the signals in order' },
      'Look at your metrics as a sequence, not a scoreboard. Every step in the journey has its own signal, and the first one that breaks usually tells you where the problem lives.',
      {
        table: {
          caption: 'The signal chain — what each metric is really telling you',
          head: ['Signal', 'What it measures', 'If it weakens, look at'],
          rows: [
            ['CPM', 'The cost of reaching people', 'Audience size, competition, saturation, ad quality'],
            ['Thumb-stop / hook rate', 'Whether the first seconds earn attention', 'The opening frame, the first line, the visual'],
            ['CTR', 'Whether the ad creates enough intent to click', 'The message, the offer framing, the call to action'],
            ['CPC', 'The cost of each visit', 'A combination of CPM and CTR'],
            ['Landing-page conversion rate', 'Whether the visit turns into an action', 'The page, the price, trust, speed, the checkout'],
            ['Cost per purchase / ROAS', 'Whether the whole system pays', 'Everything above — this is the result, not the cause'],
          ],
        },
      },
      'The key distinction is **CTR versus conversion rate**. A healthy click-through rate with a weak conversion rate means the ad is doing its job and something after the click is not. A weak click-through rate with a reasonable conversion rate means the people who do click still buy — the ad simply isn’t persuading enough of them. Those are two very different fixes.',

      { h2: 'Where the problem actually lives' },
      { h3: 'When the problem is creative' },
      'Hook rate and CTR fall while CPM stays steady and the landing page still converts the people who arrive. Frequency is usually creeping up. The audience hasn’t changed; their interest in this particular ad has.',
      { h3: 'When the problem is audience' },
      'CPM rises, frequency rises, and the drop shows up across several different creatives at once. If every ad in an ad set declines together, the ads probably aren’t the cause — the pool they’re competing for is.',
      { h3: 'When the problem is the offer' },
      'Clicks are healthy but add-to-carts and purchases are weak, and new creatives don’t move the conversion rate. People like what they see; they don’t like the deal. This is the gap most often misread as a creative problem.',
      { h3: 'When the problem is the landing page' },
      'CTR is fine, the offer is competitive, but sessions don’t become purchases — and the drop is concentrated on mobile, on a specific product, or after a site change. Check the page the ad actually sends people to, on the device they actually use.',

      {
        example: {
          label: 'Illustrative example',
          title: 'A skincare ad that “stopped working”',
          body: [
            'A fictional D2C skincare brand runs a single hero creative for six weeks. In the first two weeks, CTR sits around 1.6% and cost per purchase is comfortably within target. By week six, CTR has fallen to 0.9%, frequency in the core audience has climbed above 4, and cost per purchase is roughly double.',
            'The team’s first instinct is to raise the budget to “find new people”. The signals say otherwise: CPM has risen only slightly, landing-page conversion rate is unchanged for visitors who do click, and the decline is limited to this one creative. That points to **creative fatigue**, not an audience or page problem.',
            'The fix is to refresh the angle — a new hook built around a different customer problem — while keeping the same offer and page. Increasing spend first would have pushed more impressions into a tired creative.',
            'These numbers are invented to show the logic of diagnosis. They are not a BrandGap or client result.',
          ],
        },
      },

      { h2: 'Refresh, retarget, re-offer or stop' },
      'Once you know where the gap is, the next move is usually clear.',
      { h3: 'Refresh the creative when…' },
      'Hook rate and CTR are falling on one creative while others hold, frequency is rising, and the page still converts. Change the angle, not just the colour: a new opening, a different problem, a different format.',
      { h3: 'Change the targeting when…' },
      'Several creatives decline together, CPM keeps rising and frequency is high across the ad set. Broaden the audience, test a new segment, or give the algorithm more room — rather than producing more ads for the same exhausted pool.',
      { h3: 'Change the offer when…' },
      'Clicks are steady but conversion is weak across creatives, and competitors are offering a clearer reason to buy. Test the bundle, the threshold, the guarantee or the framing of value before you touch the creative again.',
      { h3: 'Stop the campaign when…' },
      'It has had a fair test, the signals are weak at every stage, and the fixes above have already been tried. Not every campaign deserves rescuing. Moving budget to what is working is a decision, not a defeat.',

      { h2: 'A diagnostic framework you can run in an hour' },
      {
        ol: [
          '**Confirm the drop is real.** Compare like-for-like periods and check for tracking changes, attribution shifts or a sale period that distorts the baseline.',
          '**Find the first broken signal.** Walk the chain — CPM, hook rate, CTR, CPC, conversion rate, cost per purchase — and note where things first moved.',
          '**Check scope.** Is it one creative, one ad set, one product, one device, or everything? Narrow problems have narrow causes.',
          '**Check frequency and reach.** Rising frequency with flat reach usually means saturation or fatigue.',
          '**Look after the click.** Open the landing page on a phone. Check speed, price, stock, and whether it matches the promise in the ad.',
          '**Name the gap.** Creative, audience, offer, page — or the strategy above them. Write it down before you change anything.',
          '**Change one thing at a time.** If you change the creative, audience and offer together, you’ll never know which one fixed it.',
        ],
      },

      { h2: 'What not to do when results drop' },
      'Panic is expensive. A few reactions we see often — and why they tend to backfire:',
      {
        ul: [
          '**Editing everything at once.** Changing budget, audience and creative in one afternoon resets learning and hides the cause.',
          '**Judging on one bad day.** Daily results swing. Look at a week of data, or at least enough conversions to separate a trend from noise.',
          '**Duplicating the same ad endlessly.** A copy of a tired creative is still a tired creative. New variations need a new angle.',
          '**Discounting by reflex.** A deeper discount can lift conversion rate while quietly eroding margin. Fix the offer’s clarity before you cut its price.',
          '**Blaming the algorithm.** Platform changes happen, but most drops still trace back to something you can see in your own signals.',
        ],
      },
      { h3: 'Give every fix a fair read' },
      'When you change something, decide in advance how you’ll judge it and how long you’ll wait. A fix that is reversed after two days hasn’t been tested; it’s been abandoned. Give changes enough spend and enough conversions to produce a readable signal, compare against a sensible baseline, and only then decide whether to keep, adjust or roll back.',

      { h2: 'Scaling a gap only makes it bigger' },
      'Budget is an amplifier. Put more money behind a working system and it grows; put more money behind a broken one and the break gets more expensive. That’s why the order matters: diagnose, fix, then scale.',
      'Most performance problems aren’t really performance problems. They’re a creative gap, an offer gap, a landing-page gap — or a strategy gap underneath all three. The work is finding which one you’re looking at.',

      {
        checklist: {
          title: 'Before you increase budget',
          items: [
            'Tracking is working and the drop is real, not a reporting change.',
            'You know which signal broke first — and why.',
            'Frequency in your core audience is under control.',
            'The winning creative still has a healthy hook rate and CTR.',
            'The landing page matches the ad’s promise and converts on mobile.',
            'The offer is competitive against what customers see elsewhere.',
            'You have fresh creative angles ready, not just one more variation.',
            'You’ve decided what you’ll measure to judge whether the increase worked.',
          ],
        },
      },
      'If you’d like a second pair of eyes on an account that has stalled, our [performance marketing team](/services/performance-marketing) starts every engagement with exactly this kind of diagnosis.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'meta-ads-playbook-d2c',
    published: true,
    title: 'From Clicks to Customers: A Practical Meta Ads Playbook for D2C Brands',
    seoTitle: 'A Practical Meta Ads Playbook for D2C Brands — From Clicks to Customers',
    category: 'Meta Ads playbooks',
    excerpt:
      'Traffic is easy to buy. Customers are not. A working playbook for structuring Meta Ads around the full funnel — and the numbers that tell you it’s actually growing the business.',
    description:
      'A practical Meta Ads playbook for D2C and e-commerce brands: funnel structure, creative and offer strategy, audience testing, retargeting, CAC, ROAS, scaling and a weekly review checklist.',
    author: ARTICLE_AUTHOR,
    date: '2026-10-05',
    image: img('meta-ads-playbook', 'An illustrated playbook: a product on a phone screen beside a three-stage funnel moving from discovery to consideration to purchase.'),
    card: card('meta-ads-playbook', 'A product ad on a phone leading into a three-stage funnel: discover, consider, convert.'),
    ogImage: '/insights/meta-ads-playbook-og.jpg',
    tone: 'terracotta',
    related: ['meta-ads-stop-working', 'creative-that-converts'],
    cta: {
      headline: 'Build the system before you scale the spend.',
      body: 'Tell us where your account is today. We’ll help you build a funnel, a testing rhythm and a reporting view that connect ad spend to real business growth.',
    },
    body: [
      'Traffic is not growth.',
      'It’s possible to run Meta Ads that look busy — cheap clicks, rising reach, a steady flow of sessions — and still not build a profitable business. Clicks are an input. Customers who come back are the outcome.',
      'This playbook is how we think about getting from one to the other for D2C and e-commerce brands. It’s not a list of “best settings”. Those don’t exist in any useful sense: what works depends on your product, price, margins, audience, creative and funnel. What does carry across brands is the structure — and the discipline of reading it honestly.',

      { h2: 'Start with the business, not the campaign manager' },
      'Before a single campaign goes live, three numbers should be clear:',
      {
        ul: [
          '**What a customer is worth.** First-order value, and — if you have repeat purchase data — what a customer is typically worth over time.',
          '**What you can afford to pay for one.** Your target cost per acquisition (CAC), set from margins, not from what the account happens to deliver.',
          '**What “working” means.** A ROAS or CAC target the business can actually live with, agreed before the results come in.',
        ],
      },
      'Without these, every report becomes an argument about whether a number is good. With them, it becomes a decision.',

      { h2: 'Get measurement right first' },
      'Every decision in this playbook depends on data you can trust. Before scaling anything, check the basics:',
      {
        ul: [
          'The Meta Pixel fires correctly on key events — view content, add to cart, initiate checkout and purchase.',
          'Server-side tracking (the Conversions API) is set up where your platform supports it, so fewer conversions go unrecorded.',
          'UTM parameters are consistent, so you can compare Meta’s numbers with your store and analytics data.',
          'Purchase values match what your store records, including discounts and currency.',
        ],
      },
      'Measurement doesn’t have to be perfect. It does have to be consistent enough that a change in the numbers means a change in the business.',

      { h2: 'Structure the funnel' },
      'A D2C account works best when each stage of the journey has a clear job. We think in four stages:',
      {
        table: {
          caption: 'The full-funnel view',
          head: ['Stage', 'Job', 'Typical campaigns', 'What to watch'],
          rows: [
            ['TOFU — Discover', 'Reach new people who match your customer', 'Video, reach, broad prospecting', 'Hook rate, CPM, cost per engaged view'],
            ['MOFU — Consider', 'Turn attention into interest', 'Product discovery, engagement, traffic to key pages', 'CTR, landing-page views, add-to-carts'],
            ['BOFU — Convert', 'Turn interest into purchases', 'Sales campaigns, catalog, retargeting, offers', 'Conversion rate, cost per purchase, ROAS'],
            ['SCALE — Grow', 'Expand what’s proven', 'Creative testing, audience expansion, budget scaling', 'Blended CAC, contribution margin, repeat rate'],
          ],
        },
      },
      'You don’t need a separate campaign for every stage on day one. Smaller accounts often run a simpler structure: one prospecting campaign and one retargeting campaign. The point is that every pound or rupee of spend has a job you can name.',

      { h2: 'Choose objectives that match the job' },
      'Meta optimises for the outcome you ask for. Ask for clicks and you’ll get people who click; ask for purchases and the system looks for people who buy. For most D2C accounts, sales objectives do the heavy lifting once there is enough purchase data to learn from. Awareness and engagement objectives earn their place when they feed the rest of the funnel — not as a way to buy cheap metrics.',

      { h2: 'Creative is the targeting' },
      'With broad audiences, the creative does much of the work targeting used to do: it decides who stops, who watches and who clicks. That makes creative strategy a performance variable, not a design task.',
      { h3: 'Hooks' },
      'The first one to three seconds decide whether anything else gets seen. Lead with the problem, the result, the surprise or the product in use — not the logo.',
      { h3: 'Offers' },
      'A clear reason to buy now: a bundle, a threshold, a guarantee, a first-order incentive. Offers aren’t only discounts — they’re the shape of the deal.',
      { h3: 'Product positioning' },
      'Who is this for, and why this over the alternative? Different angles — gifting, everyday use, a specific problem — often find different customers for the same product.',
      'For a deeper look at how to build creative that earns attention, see [Creative That Converts](/insights/creative-that-converts).',

      { h2: 'Test audiences without fragmenting the account' },
      'Testing matters, but splitting a modest budget across many small ad sets usually starves all of them. A sensible approach:',
      {
        ul: [
          'Keep prospecting broad enough for the system to learn, and let creative define the segment.',
          'Test new audiences as a deliberate experiment with a clear question, not as permanent clutter.',
          'Exclude recent purchasers from prospecting where it makes sense, so you’re paying to reach new customers.',
          'Give each test enough spend and time to produce a readable signal before calling it.',
        ],
      },

      { h2: 'Retargeting: the quiet profit centre' },
      'People who viewed a product, added to cart or started checkout are telling you something. Retargeting should answer the reason they didn’t buy — a reminder of the product, social proof, an answer to a common objection, or the offer they hesitated on. Watch frequency closely here: small audiences tire quickly, and an annoyed visitor is worse than a forgotten one.',

      { h2: 'The click is only half the journey' },
      'Many “ad problems” are landing-page problems. If the ad shows one product and the page shows twenty, if the price changes between ad and checkout, or if the page is slow on mobile, conversion rate will fall regardless of how good the creative is. Send each ad to the most relevant page, keep the message continuous, and check the experience on the phone your customer is actually using.',
      'If an ad that was working has started to slip, our [Meta ads teardown](/insights/meta-ads-stop-working) walks through how to find which part of this chain broke.',

      { h2: 'Read the numbers that matter' },
      {
        table: {
          caption: 'Metrics that connect ads to the business',
          head: ['Metric', 'What it tells you', 'Watch out for'],
          rows: [
            ['CTR', 'Whether the ad creates intent', 'High CTR on curiosity alone — clicks that never buy'],
            ['Conversion rate', 'Whether the visit becomes a sale', 'Comparing pages or devices that aren’t like-for-like'],
            ['CAC', 'What a new customer really costs', 'Platform-only CAC that ignores returning customers'],
            ['ROAS', 'Revenue returned per unit of ad spend', 'Attribution overlap, and ROAS that ignores margin'],
            ['Customer value', 'What a customer is worth over time', 'Judging acquisition on first order alone when repeat is strong'],
          ],
        },
      },
      'ROAS is useful, but it isn’t profit. A high ROAS on a low-margin product can lose money; a modest ROAS on a product people re-order can build a business. Read the platform numbers alongside your own store data, not instead of it.',

      { h2: 'Test creative on a rhythm' },
      'Creative fatigue is not a possibility; it’s a schedule. Build a testing rhythm so fresh angles are ready before the current winners tire:',
      {
        ol: [
          'Pick one question per test — a new hook, a new angle, a new format or a new offer.',
          'Launch a small set of variations that differ on that one thing.',
          'Judge on the metric that matches the question: hook rate for openings, CTR for messages, conversion rate for offers.',
          'Move winners into your main campaigns and retire what didn’t work.',
          'Write down what you learned, so the next brief starts smarter.',
        ],
      },

      { h2: 'Scale what’s proven, not what’s hoped' },
      'Scaling is about increasing spend without breaking what made it work. Increase budgets gradually on campaigns with stable results, widen audiences as creative proves itself, and add fresh creative as you grow — more spend means faster fatigue. If efficiency drops sharply after an increase, step back and diagnose before pushing further. We scale proven growth, not spend.',

      { h2: 'Plan for seasons and promotions' },
      'Sale periods, festivals and launches change how people buy — and how much it costs to reach them. Build creative and offers for these moments in advance, warm up audiences before the peak, and expect costs to rise when competition does. Afterwards, judge results against the same period last year or a comparable promotion, not against an ordinary week.',

      { h2: 'Common mistakes we see' },
      {
        ul: [
          'Optimising for clicks or traffic and calling it growth.',
          'Splitting budgets across so many ad sets that none can learn.',
          'Running the same two creatives for months.',
          'Sending every ad to the homepage.',
          'Judging results on platform ROAS alone, without margins or store data.',
          'Scaling quickly on a few good days, then panicking when results normalise.',
        ],
      },

      {
        example: {
          label: 'Example scenario',
          title: 'A simple starting structure for a single-product D2C brand',
          body: [
            'Imagine a fictional brand selling one hero product with a couple of bundles, starting with a modest monthly budget.',
            {
              ul: [
                '**Prospecting (most of the budget):** one sales campaign with broad targeting and four to six creatives built on different angles.',
                '**Retargeting (a smaller share):** one campaign reaching recent visitors and add-to-carts, with proof-led creative and the bundle offer.',
                '**Testing:** a small, ring-fenced budget for new hooks and angles each fortnight, with winners promoted into prospecting.',
              ],
            },
            'The split between these isn’t fixed — it depends on audience size, purchase volume and how much new creative the team can produce. This is a starting point to adapt, not a formula.',
          ],
        },
      },

      { h2: 'Growth is a system' },
      'Strong accounts aren’t built on one clever campaign. They’re built on a funnel with clear jobs, creative that keeps evolving, offers that give people a reason, pages that keep the promise, and numbers read against the business — week after week.',

      {
        checklist: {
          title: 'A simple weekly Meta Ads review',
          items: [
            'Spend, purchases, CAC and ROAS against target — and against your own store data.',
            'Which creatives are winning, and which show rising frequency or a falling hook rate.',
            'Conversion rate by landing page and device.',
            'Retargeting frequency and performance.',
            'Results of this week’s creative tests — and what you learned.',
            'Any stock, pricing, site or offer changes that could explain movement.',
            'Budget decisions for next week: what to scale, hold, fix or stop.',
            'The next round of creative angles to brief.',
          ],
        },
      },
      'If you want help building this system, our [performance marketing](/services/performance-marketing) and [e-commerce growth](/services#ecommerce-growth) teams work on exactly this — from funnel structure to the weekly review.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'creative-that-converts',
    published: true,
    title: 'Creative That Converts: How to Build Ads People Actually Notice',
    seoTitle: 'Creative That Converts — How to Build Ads People Actually Notice',
    category: 'Creative breakdowns',
    excerpt:
      'Beautiful content can still fail. A practical framework — hook, problem, desire, proof, offer, CTA — for building creative that earns attention and moves people to act.',
    description:
      'How to build ad creative that converts: hooks, the first three seconds, product demonstration, social proof, offers and CTAs — plus a practical HOOK → PROBLEM → DESIRE → PROOF → OFFER → CTA framework.',
    author: ARTICLE_AUTHOR,
    date: '2026-10-01',
    image: img('creative-that-converts', 'An illustrated storyboard of six ad frames — hook, problem, desire, proof, offer and call to action — laid out in sequence.'),
    card: card('creative-that-converts', 'A six-frame storyboard: hook, problem, desire, proof, offer and call to action.'),
    ogImage: '/insights/creative-that-converts-og.jpg',
    tone: 'ink',
    related: ['meta-ads-playbook-d2c', 'meta-ads-stop-working'],
    cta: {
      headline: 'Close the gap between creative and performance.',
      body: 'Tell us about your product and the ads you’re running today. We’ll help you build creative with a clear angle, a clear job in the funnel, and a way to learn from every test.',
    },
    body: [
      'Good-looking content can still fail.',
      'We’ve all seen it: the polished shoot, the carefully graded video, the ad everyone internally loved — and the numbers barely move. Meanwhile a rough phone video with a sharp opening line outperforms it for weeks.',
      'That isn’t an argument against craft. It’s a reminder of what an ad is for. On a feed, creative has one job before any other: earn the next second of attention. Then it has to turn that attention into a reason to act.',

      { h2: 'Creative is now a performance variable' },
      'As targeting has become broader and more automated, the ad itself does more of the work of finding the right people. The opening frame filters who watches. The message filters who clicks. The offer filters who buys. That makes creative one of the biggest levers in a performance account — and one of the easiest to treat as an afterthought.',
      'Creativity gets attention. Strategy gives it direction. Performance data tells you what to improve.',

      { h2: 'The framework: hook → problem → desire → proof → offer → CTA' },
      'Most ads that convert move a person through the same sequence of decisions, even if the format looks completely different. Each step answers a question in the viewer’s head.',
      {
        table: {
          caption: 'Six steps, six questions',
          head: ['Step', 'The viewer is asking', 'The ad’s job'],
          rows: [
            ['Hook', '“Is this worth my attention?”', 'Stop the scroll in the first one to three seconds'],
            ['Problem', '“Is this about me?”', 'Name a tension the viewer recognises'],
            ['Desire', '“What would be better?”', 'Show the outcome, not just the feature'],
            ['Proof', '“Should I believe it?”', 'Demonstrate, show reviews, show it working'],
            ['Offer', '“Why now, and is it worth it?”', 'Make the deal clear and easy to accept'],
            ['CTA', '“What do I do next?”', 'Tell them, plainly'],
          ],
        },
      },

      { h3: 'Hook — the first one to three seconds' },
      'The hook decides whether the rest of the ad exists. Strong openings usually do one of a few things: show the result, name the problem, show the product doing something unexpected, or say something the viewer agrees with immediately. Logos, slow fades and scene-setting rarely survive the first second.',
      { h3: 'Problem' },
      'Name the tension in the viewer’s language. Not “premium hydration technology”, but “skin that feels tight by 4 pm”. Recognition creates relevance.',
      { h3: 'Desire' },
      'Show what life looks like with the problem solved. People buy outcomes — the feeling, the time saved, the compliment — more readily than specifications.',
      { h3: 'Proof' },
      'Make it believable. Demonstrate the product in use, show real reviews and ratings, show before-and-after where it’s honest and appropriate, or let a creator explain it in their own words.',
      { h3: 'Offer' },
      'Give people a reason to act now: a bundle, a first-order incentive, free shipping above a threshold, a guarantee. The offer doesn’t have to be a discount; it has to be clear.',
      { h3: 'CTA' },
      'Tell people what to do — “Shop the starter kit”, “See the colours” — and make sure the page they land on continues the same story.',

      { h2: 'Hook patterns worth testing' },
      'There’s no single best hook, but some patterns reliably earn a second look. Use them as starting points, not templates:',
      {
        ul: [
          '**The result first.** Open on the outcome, then show how you got there.',
          '**The familiar frustration.** Show the moment your customer knows too well.',
          '**The unexpected demonstration.** The product doing something the viewer didn’t expect.',
          '**The direct question.** “Still using the same … ?” — when it’s genuinely relevant, not clickbait.',
          '**The comparison.** Before and after, this versus that, old way versus new way.',
        ],
      },

      { h2: 'Visual hierarchy: one idea per frame' },
      'On a phone, at scrolling speed, people take in one thing at a time. Each frame should have one dominant element: the product, the face, the headline, or the result. Text should be short enough to read in the time it’s on screen, with enough contrast to survive bright screens and small sizes. If everything is emphasised, nothing is.',

      { h2: 'Formats and when they earn their place' },
      {
        ul: [
          '**UGC and creator-led video** feels native to the feed and carries built-in proof. It works well for demonstration and objection-handling, as long as the creator genuinely uses and explains the product.',
          '**Reels and short-form video** suit hooks, demonstrations and before-and-after stories. Design for sound-off with captions, and for sound-on as a bonus.',
          '**Static ads** are fast to produce and test. They work well for a clear offer, a single strong benefit, social proof or a recognisable product.',
          '**Product-focused creative** — close-ups, texture, use in context — carries more weight than lifestyle mood when the product itself is the reason to buy.',
          '**Founder- or team-led creative** can build trust when there’s a genuine story behind the product. It’s an option, not a requirement.',
        ],
      },

      { h2: 'Match creative to the funnel stage' },
      'The same ad rarely works for a stranger and for someone who abandoned their cart yesterday. Prospecting creative needs to hook and explain. Consideration creative needs to deepen interest and show proof. Retargeting creative needs to answer the objection that stopped the purchase and make the offer clear. Briefing creative by funnel stage — not just by product — is one of the simplest ways to make it work harder.',

      {
        example: {
          label: 'Illustrative example',
          title: 'Breaking down an ad for a fictional travel mug',
          body: [
            'The product is invented for this example: an insulated travel mug that keeps coffee hot for hours. It is not a BrandGap client.',
            {
              ol: [
                '**Hook (0–2s):** A cup of coffee steams on a car dashboard. On-screen text: “Poured at 7 am. Still hot at noon.”',
                '**Problem:** Quick cuts of lukewarm coffee left on desks and car seats — the half-drunk cup everyone recognises.',
                '**Desire:** The same person, mid-afternoon, taking a sip of still-hot coffee between meetings.',
                '**Proof:** A thermometer reading at intervals, a close-up of the seal, and two short customer reviews on screen.',
                '**Offer:** “Buy two, get a free cleaning brush” — a reason to buy for a partner or the office.',
                '**CTA:** “Shop the mug” — landing on the product page with the same visual and the bundle already selected.',
              ],
            },
            'Notice that the ad never opens with the brand name or the specification. The specification shows up as proof, where it supports a belief the viewer already wants to hold.',
          ],
        },
      },

      { h2: 'Test angles, not just colours' },
      'Changing a button colour or a background is a variation. Changing the reason someone should care is an angle. Angles move results far more often. For a single product you might test:',
      {
        ul: [
          'Different problems it solves for different people.',
          'Different outcomes — practical, emotional, social.',
          'Different formats — demonstration, creator review, static offer.',
          'Different offers — single, bundle, gift.',
        ],
      },
      'Keep each test focused on one question so the result teaches you something.',

      { h2: 'Fatigue is a schedule, not a surprise' },
      'Even the best creative wears out as the same audience sees it repeatedly. Plan for it: keep a pipeline of new angles, iterate on winners with fresh hooks and edits before they decline, and retire ads when hook rate and click-through rate trend down while frequency climbs. Iteration on a proven idea is often faster and more reliable than starting from scratch.',
      'If an ad has already slowed down, our [Meta ads teardown](/insights/meta-ads-stop-working) shows how to tell whether it’s really the creative — or the audience, the offer or the page.',

      { h2: 'Why good-looking content can still fail' },
      {
        ul: [
          'The opening is beautiful but slow, so nobody sees the message.',
          'It shows the brand’s world but not the viewer’s problem.',
          'It explains features instead of outcomes.',
          'There’s no proof, so the claim feels like an advertisement.',
          'The offer is unclear — or missing.',
          'The landing page tells a different story from the ad.',
        ],
      },

      { h2: 'Creative and performance teams should share a brief' },
      'The gap between creative and performance usually starts in the brief. Creative teams are asked for “content”; performance teams are judged on results neither side planned together. Close it by sharing one brief — the audience, the funnel stage, the angle, the hook, the offer and the metric that will judge success — and by reviewing results together, so the data informs the next idea instead of just grading the last one.',
      'For how creative fits into the wider account structure, see our [Meta Ads playbook for D2C brands](/insights/meta-ads-playbook-d2c).',

      { h3: 'A one-page creative brief' },
      'A short brief, shared by both teams, does more than a long one nobody reads. Ours usually fits on a page:',
      {
        ul: [
          '**Audience:** who this is for, and what they already know.',
          '**Funnel stage:** discover, consider or convert.',
          '**Angle:** the one reason this person should care.',
          '**Hook:** the first one to three seconds, written out.',
          '**Proof and offer:** what makes it believable, and why act now.',
          '**Success metric:** hook rate, CTR or conversion — chosen before launch.',
        ],
      },

      {
        checklist: {
          title: 'Before you launch a new ad',
          items: [
            'The first one to three seconds would stop you mid-scroll.',
            'It names a problem the viewer recognises, in their words.',
            'It shows the outcome, not just the product.',
            'There’s proof — a demonstration, reviews, or someone credible.',
            'The offer is clear and easy to understand.',
            'The CTA and the landing page continue the same story.',
            'You know which funnel stage it’s for and which metric will judge it.',
          ],
        },
      },
      { quote: 'Creative should earn attention. Strategy should give it direction. Performance should tell you what to improve.' },
      'That’s how our [brand and creative strategy](/services#brand-creative-strategy) work connects with performance — one brief, one system, one set of numbers.',
    ],
  },
]

export const PUBLISHED_ARTICLES = ARTICLES.filter((a) => a.published)

/** Related articles for a post, in the order listed. */
export const relatedTo = (article) => (article.related ?? []).map(findArticleBySlug).filter(Boolean)
function findArticleBySlug(slug) {
  return PUBLISHED_ARTICLES.find((a) => a.slug === slug)
}

export const findArticle = (slug) => PUBLISHED_ARTICLES.find((a) => a.slug === slug)

/** Plain text of an article body, for word counts and reading time. */
const textOf = (blocks) =>
  blocks
    .map((b) => {
      if (typeof b === 'string') return b
      if (b.h2 || b.h3 || b.quote) return b.h2 || b.h3 || b.quote
      if (b.ul || b.ol) return (b.ul || b.ol).join(' ')
      if (b.checklist) return `${b.checklist.title} ${b.checklist.items.join(' ')}`
      if (b.table) return [b.table.caption, ...b.table.head, ...b.table.rows.flat()].join(' ')
      if (b.example) return `${b.example.title} ${textOf(b.example.body)}`
      return ''
    })
    .join(' ')

export const wordCount = (article) => textOf([article.excerpt, ...article.body]).split(/\s+/).filter(Boolean).length

/** Reading time at roughly 220 words a minute. */
export const readTimeOf = (article) => `${Math.max(1, Math.round(wordCount(article) / 220))} min read`

// Reading time comes from the text itself, so it stays right when an article is edited.
ARTICLES.forEach((a) => {
  a.readTime = readTimeOf(a)
})
