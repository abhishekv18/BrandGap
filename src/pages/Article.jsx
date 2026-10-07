import { useParams } from 'react-router'
import { Copy, isPlaceholder } from '../components/Copy'
import { NewsletterForm } from '../components/NewsletterForm'
import { Breadcrumb } from '../components/PageHero'
import { ProjectPlate } from '../components/ProjectPlate'
import { MaskReveal, Reveal } from '../components/Reveal'
import { findArticle } from '../data/insights'
import { absoluteUrl, breadcrumbLd, useSeo } from '../hooks/useSeo'
import { FinalCta } from '../sections/FinalCta'
import { ArticleMeta } from './Insights'
import NotFound from './NotFound'

/** /insights/[slug] — one article, with Article schema (brief §9.7). */
export default function Article() {
  const { slug } = useParams()
  const article = findArticle(slug)
  return article ? <Post article={article} /> : <NotFound />
}

function Post({ article }) {
  const path = `/insights/${article.slug}`
  const title = isPlaceholder(article.title) ? 'Insight' : article.title

  useSeo({
    title,
    description: isPlaceholder(article.excerpt) ? `${article.category} — BrandGap Insights.` : article.excerpt,
    path,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        articleSection: article.category,
        ...(article.date ? { datePublished: article.date } : {}),
        ...(isPlaceholder(article.author) ? {} : { author: { '@type': 'Person', name: article.author } }),
        publisher: { '@type': 'Organization', name: 'BrandGap', logo: { '@type': 'ImageObject', url: absoluteUrl('/favicon.svg') } },
        mainEntityOfPage: absoluteUrl(path),
        ...(article.image ? { image: absoluteUrl(article.image.src) } : {}),
      },
      breadcrumbLd([
        { name: 'Insights', path: '/insights' },
        { name: title, path },
      ]),
    ],
  })

  return (
    <>
      <article aria-labelledby="article-title">
        <header className="container-page pt-24 text-center md:pt-36">
          <div className="flex justify-center">
            <Breadcrumb items={[{ name: 'Insights', path: '/insights' }, { name: article.category, path }]} />
          </div>
          <h1 id="article-title" className="mx-auto mt-5 max-w-[22ch] text-h2 md:mt-7">
            <MaskReveal>
              <Copy value={article.title} tone="inherit" />
            </MaskReveal>
          </h1>
          <div className="mt-6 flex justify-center">
            <ArticleMeta article={article} />
          </div>
          <p className="label mt-3 text-ink-muted">
            By <Copy value={article.author} tone="inherit" />
          </p>
        </header>

        <Reveal className="container-page mt-8 md:mt-12">
          <ProjectPlate project={article} ratio="16 / 8" letter="g" crop="right" label="[Article image]" cursor={undefined} />
        </Reveal>

        <div className="container-page section-y">
          <div className="mx-auto max-w-[38rem] text-lead">
            <p className="font-display text-h3 italic">
              <Copy value={article.excerpt} />
            </p>
            {article.body.map((para, i) => (
              <Reveal as="p" key={i} className="mt-6 text-ink-soft">
                <Copy value={para} />
              </Reveal>
            ))}
          </div>
        </div>
      </article>

      <section aria-label="Newsletter" className="container-page pb-12 md:pb-16">
        <div className="mx-auto max-w-xl border-t border-line pt-10">
          <NewsletterForm id="article-newsletter" />
        </div>
      </section>

      <FinalCta numeral={null} />
    </>
  )
}
