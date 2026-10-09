import { ArrowRight, Check } from 'lucide-react'
import { Fragment } from 'react'
import { useParams } from 'react-router'
import { Copy, isPlaceholder } from '../components/Copy'
import { NewsletterForm } from '../components/NewsletterForm'
import { Breadcrumb } from '../components/PageHero'
import { ProjectPlate } from '../components/ProjectPlate'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { findArticle, relatedTo } from '../data/insights'
import { useHrefClick } from '../hooks/useHrefClick'
import { absoluteUrl, breadcrumbLd, useSeo } from '../hooks/useSeo'
import { FinalCta } from '../sections/FinalCta'
import { ArticleMeta } from './Insights'
import NotFound from './NotFound'

/** /insights/[slug] — one article, with Article schema (brief §9.7). */
export default function Article() {
  const { slug } = useParams()
  const article = findArticle(slug)
  return article ? <Post key={article.slug} article={article} /> : <NotFound />
}

const anchorOf = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** Inline text: **bold** and [label](/path) links, nothing more. */
function Inline({ text }) {
  const hrefClick = useHrefClick()
  const parts = String(text).split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/)
    if (bold) {
      return (
        <strong key={i} className="font-normal text-ink">
          {bold[1]}
        </strong>
      )
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      return (
        <a
          key={i}
          href={link[2]}
          onClick={(e) => hrefClick(e, link[2])}
          className="text-terracotta underline decoration-terracotta/35 underline-offset-4 transition-colors hover:decoration-terracotta"
        >
          {link[1]}
        </a>
      )
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}

/** One content block. The article's type sizes and colours come from the site's existing scale. */
function Block({ block }) {
  if (typeof block === 'string') {
    return (
      <p className="mt-5 text-ink-soft">
        <Inline text={block} />
      </p>
    )
  }
  if (block.h2) {
    return (
      <Reveal as="h2" id={anchorOf(block.h2)} className="mt-14 scroll-mt-28 font-display text-h3 tracking-[-0.02em] text-ink md:mt-16">
        {block.h2}
      </Reveal>
    )
  }
  if (block.h3) {
    return <h3 className="mt-9 font-display text-xl tracking-[-0.01em] text-ink md:text-2xl">{block.h3}</h3>
  }
  if (block.ul) {
    return (
      <ul className="mt-5 flex flex-col gap-3 text-ink-soft">
        {block.ul.map((item, i) => (
          <li key={i} className="flex gap-4">
            <span aria-hidden className="mt-[0.8em] h-px w-3 shrink-0 bg-terracotta" />
            <span>
              <Inline text={item} />
            </span>
          </li>
        ))}
      </ul>
    )
  }
  if (block.ol) {
    return (
      <ol className="mt-5 flex flex-col gap-4 text-ink-soft">
        {block.ol.map((item, i) => (
          <li key={i} className="flex gap-4">
            <span aria-hidden className="w-6 shrink-0 font-display text-lg leading-[1.5] text-terracotta tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>
              <Inline text={item} />
            </span>
          </li>
        ))}
      </ol>
    )
  }
  if (block.table) {
    const { caption, head, rows } = block.table
    return (
      <figure className="mt-8">
        {/* Phones: each row as a short stacked block, so nothing needs a sideways swipe */}
        <dl className="flex flex-col overflow-hidden rounded-[0.625rem] border border-line sm:hidden">
          {rows.map((row, r) => (
            <div key={r} className="border-t border-line px-4 py-4 first:border-t-0">
              <dt className="font-display text-lg text-ink">{row[0]}</dt>
              {row.slice(1).map((cell, c) => (
                <dd key={c} className="mt-2 text-sm text-ink-soft">
                  <span className="label mb-0.5 block text-[0.5625rem] text-ink-muted">{head[c + 1]}</span>
                  {cell}
                </dd>
              ))}
            </div>
          ))}
        </dl>
        {/* Larger screens: the full table; if it's ever wider than the column it scrolls in its own frame */}
        <div role="region" aria-label={caption} tabIndex={0} className="hidden overflow-x-auto rounded-[0.625rem] border border-line focus-visible:outline-2 focus-visible:outline-terracotta sm:block">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead className="bg-blush/60">
              <tr>
                {head.map((h) => (
                  <th key={h} scope="col" className="label px-4 py-3 align-bottom text-[0.625rem] font-normal text-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r} className="border-t border-line align-top">
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row" className="px-4 py-3 font-display text-base font-normal text-ink">
                        {cell}
                      </th>
                    ) : (
                      <td key={c} className="px-4 py-3 text-ink-soft">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <figcaption className="label mt-3 text-[0.625rem] text-ink-muted">{caption}</figcaption>
      </figure>
    )
  }
  if (block.example) {
    const { label, title, body } = block.example
    return (
      <aside aria-label={`${label}: ${title}`} className="mt-10 rounded-[0.625rem] border border-line bg-blush/45 px-5 py-6 md:px-8 md:py-8">
        <p className="label flex items-center gap-3 text-[0.625rem] text-terracotta-deep">
          <span aria-hidden className="size-1.5 rounded-full bg-terracotta" />
          {label}
        </p>
        <p className="mt-3 font-display text-xl tracking-[-0.01em] text-ink md:text-2xl">{title}</p>
        <div className="[&>*:first-child]:mt-4">
          {body.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </div>
      </aside>
    )
  }
  if (block.checklist) {
    const { title, items } = block.checklist
    return (
      <section aria-labelledby={anchorOf(title)} className="mt-12 rounded-[0.625rem] border border-ink/15 px-5 py-6 md:px-8 md:py-8">
        <p className="label text-[0.625rem] text-terracotta">Checklist</p>
        <h2 id={anchorOf(title)} className="mt-3 font-display text-h3 tracking-[-0.02em] text-ink">
          {title}
        </h2>
        <ul className="mt-6 flex flex-col">
          {items.map((item, i) => (
            <li key={i} className="flex gap-4 border-t border-line py-3.5 text-ink-soft first:border-t-0 first:pt-0 last:pb-0">
              <span aria-hidden className="mt-[0.15em] flex size-5 shrink-0 items-center justify-center rounded-full border border-terracotta text-terracotta">
                <Check strokeWidth={2} className="size-3" />
              </span>
              <span>
                <Inline text={item} />
              </span>
            </li>
          ))}
        </ul>
      </section>
    )
  }
  if (block.quote) {
    return (
      <blockquote className="mt-12 border-l-2 border-terracotta pl-6 font-display text-quote italic tracking-[-0.02em] text-ink md:pl-8">
        {block.quote}
      </blockquote>
    )
  }
  return null
}

function Post({ article }) {
  const path = `/insights/${article.slug}`
  const title = isPlaceholder(article.title) ? 'Insight' : article.title
  const related = relatedTo(article)
  const hrefClick = useHrefClick()

  useSeo({
    title: article.seoTitle ?? title,
    description: article.description ?? article.excerpt,
    path,
    type: 'article',
    image: article.ogImage ?? article.image?.src,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: article.description ?? article.excerpt,
        articleSection: article.category,
        ...(article.date ? { datePublished: article.date, dateModified: article.date } : {}),
        author: { '@type': 'Organization', name: 'BrandGap', url: absoluteUrl('/') },
        publisher: { '@type': 'Organization', name: 'BrandGap', logo: { '@type': 'ImageObject', url: absoluteUrl('/favicon.svg') } },
        mainEntityOfPage: absoluteUrl(path),
        ...(article.image ? { image: absoluteUrl(article.ogImage ?? article.image.src) } : {}),
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
          <ProjectPlate project={article} ratio="16 / 9" letter="g" crop="right" label="[Article image]" cursor={undefined} priority />
        </Reveal>

        <div className="container-page section-y">
          <div className="mx-auto max-w-[40rem] text-lead">
            <p className="font-display text-h3 italic">
              <Copy value={article.excerpt} />
            </p>
            {article.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </div>
      </article>

      {/* Related reading */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="container-page pb-12 md:pb-16">
          <div className="border-t border-line pt-10 md:pt-12">
            <SectionLabel numeral={null} name="Keep reading" />
            <h2 id="related-title" className="sr-only">
              Related articles
            </h2>
            <ul className="mt-6 grid gap-10 md:mt-8 md:grid-cols-2 md:gap-x-8">
              {related.map((a, i) => (
                <li key={a.slug}>
                  <a
                    href={`/insights/${a.slug}`}
                    onClick={(e) => hrefClick(e, `/insights/${a.slug}`)}
                    data-cursor="view"
                    className="group grid gap-6 text-center sm:grid-cols-5 sm:text-left"
                  >
                    <div className="sm:col-span-2">
                      <ProjectPlate project={{ ...a, image: a.card ?? a.image }} ratio="4 / 5" letter={i % 2 ? 'b' : 'g'} crop="left" label="[Article image]" cursor={undefined} />
                    </div>
                    <div className="sm:col-span-3">
                      <ArticleMeta article={a} />
                      <h3 className="mt-3 font-display text-h3 tracking-[-0.02em] transition-colors group-hover:text-terracotta">{a.title}</h3>
                      <span className="label mt-4 inline-flex min-h-11 items-center gap-2 text-ink transition-colors group-hover:text-terracotta">
                        Read
                        <ArrowRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-label="Newsletter" className="container-page pb-12 md:pb-16">
        <div className="mx-auto max-w-xl border-t border-line pt-10">
          <NewsletterForm id="article-newsletter" />
        </div>
      </section>

      <FinalCta numeral={null} headline={article.cta?.headline} body={article.cta?.body} />
    </>
  )
}
