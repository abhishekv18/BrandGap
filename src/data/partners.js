/**
 * Homepage partner sections. Logos are the platforms' own marks in public/partners/tech.
 * Before listing a platform as a partner, check its brand rules allow it.
 */
export const TECH_INTRO = {
  title: 'Built on platforms',
  emphasis: 'the world trusts.',
  body: 'The hosting, checkout, payment and growth platforms behind the stores and sites we work on, chosen for speed, security and scale.',
}

const logo = (file) => `/partners/tech/${file}-color.webp`

// width is the file's real width (all are 120px tall), so the row holds its space while loading.
export const TECH_PARTNERS = [
  { name: 'Shopify', role: 'Storefronts', src: logo('shopify'), width: 420 },
  { name: 'Cloudflare', role: 'CDN and security', src: logo('cloudflare'), width: 970 },
  { name: 'Razorpay', role: 'Payments', src: logo('razorpay'), width: 578 },
  { name: 'Amazon Web Services', role: 'Cloud infrastructure', src: logo('aws'), width: 206 },
  { name: 'GoKwik', role: 'Checkout', src: logo('gokwik'), width: 438 },
  { name: 'Hostinger', role: 'Web hosting', src: logo('hostinger'), width: 600 },
  { name: 'PayU', role: 'Payments', src: logo('payu'), width: 221 },
  { name: 'Judge.me', role: 'Product reviews', src: logo('judgeme'), width: 644 },
  { name: 'ReelUp', role: 'Shoppable video', src: logo('reelup'), width: 477 },
]

/** KY Creatives: wording from the studio's own site. */
export const DEV_PARTNER = {
  name: 'KY Creatives',
  logo: { src: '/partners/ky-creatives-logo.png', width: 285, height: 79 },
  href: 'https://kycreatives.com/',
  tagline: 'What we create is business.',
  body: [
    'Ads can only sell as well as the website they lead to. KY Creatives is the design-led studio we work with to build it: software, web apps and mobile apps, with a special focus on D2C brands.',
    'Good media and a good store, planned together from the first conversation.',
  ],
  services: ['Websites and web apps', 'D2C and Shopify stores', 'Mobile apps', 'Portals and dashboards'],
}
