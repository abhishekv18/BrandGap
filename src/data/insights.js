/**
 * Insights (blog). Categories from the brief §3; every article is a
 * placeholder until BrandGap publishes real ones (brief §7 suggests
 * launching with one or two strong articles).
 *
 *   slug       URL: /insights/[slug]
 *   date       ISO date string, e.g. '2026-11-01' — or null
 *   body       array of paragraphs
 *   image      { src, alt, width, height } or null
 */
export const INSIGHT_CATEGORIES = ['Ad teardowns', 'Meta Ads playbooks', 'Creative breakdowns']

export const INSIGHTS_INTRO = {
  title: 'Insights.',
  line: 'Notes from the gap between brand and growth.',
}

const placeholderBody = () => ['[Article body]', '[Article body]', '[Article body]']

export const ARTICLES = [
  {
    slug: 'article-01',
    published: true,
    title: '[Article Title]',
    category: 'Ad teardowns',
    excerpt: '[Article Excerpt]',
    author: '[Author]',
    date: null,
    readTime: '[Read time]',
    body: placeholderBody(),
    image: null,
    tone: 'blush',
  },
  {
    slug: 'article-02',
    published: true,
    title: '[Article Title]',
    category: 'Meta Ads playbooks',
    excerpt: '[Article Excerpt]',
    author: '[Author]',
    date: null,
    readTime: '[Read time]',
    body: placeholderBody(),
    image: null,
    tone: 'terracotta',
  },
  {
    slug: 'article-03',
    published: true,
    title: '[Article Title]',
    category: 'Creative breakdowns',
    excerpt: '[Article Excerpt]',
    author: '[Author]',
    date: null,
    readTime: '[Read time]',
    body: placeholderBody(),
    image: null,
    tone: 'ink',
  },
]

export const PUBLISHED_ARTICLES = ARTICLES.filter((a) => a.published)

export const findArticle = (slug) => PUBLISHED_ARTICLES.find((a) => a.slug === slug)
