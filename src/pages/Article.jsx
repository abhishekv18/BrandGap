import { m } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Copy, isPlaceholder } from '../components/Copy'
import { Ground } from '../components/Ground'
import { NewsletterForm } from '../components/NewsletterForm'
import { Breadcrumb } from '../components/PageHero'
import { ProjectPlate } from '../components/ProjectPlate'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { useSmoothScroll } from '../components/SmoothScroll'
import { findArticle, relatedTo } from '../data/insights'
import { useHrefClick } from '../hooks/useHrefClick'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { absoluteUrl, breadcrumbLd, useSeo } from '../hooks/useSeo'
import { FinalCta } from '../sections/FinalCta'
import { ArticleMeta, formatDate } from './Insights'
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
          <li key={i} className="flex flex-col items-center gap-2 md:flex-row md:items-start md:gap-4">
            <span aria-hidden className="mt-[0.8em] hidden h-px w-3 shrink-0 bg-terracotta md:block" />
            <span aria-hidden className="h-px w-6 bg-terracotta md:hidden" />
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
          <li key={i} className="flex flex-col items-center gap-1 md:flex-row md:items-start md:gap-4">
            <span aria-hidden className="shrink-0 font-display text-lg leading-[1.5] text-terracotta tabular-nums md:w-6">
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
            <div key={r} className="border-t border-line px-4 py-4 text-center first:border-t-0">
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
        <figcaption className="label mt-3 text-center text-[0.625rem] text-ink-muted md:text-left">{caption}</figcaption>
      </figure>
    )
  }
  if (block.example) {
    const { label, title, body } = block.example
    return (
      <aside aria-label={`${label}: ${title}`} className="mt-10 rounded-[0.625rem] border border-line bg-blush/45 px-5 py-6 md:px-8 md:py-8">
        <p className="label flex items-center justify-center gap-3 text-[0.625rem] text-terracotta-deep md:justify-start">
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
            <li key={i} className="flex gap-4 border-t border-line py-3.5 text-left text-ink-soft first:border-t-0 first:pt-0 last:pb-0">
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
      <blockquote className="mx-auto mt-12 border-t-2 border-terracotta pt-6 font-display text-quote italic tracking-[-0.02em] text-ink md:border-t-0 md:border-l-2 md:pt-0 md:pl-8">
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
        {/* Phones: centred. From md: the headline on the left, the article's details as a ledger on the right */}
        <header className="container-page pt-24 pb-8 text-center md:pt-36 md:pb-12 md:text-left">
          <Breadcrumb items={[{ name: 'Insights', path: '/insights' }, { name: article.category, path }]} />
          <div className="mt-5 grid gap-6 md:mt-7 md:grid-cols-12">
            <h1 id="article-title" className="mx-auto max-w-[24ch] text-[clamp(1.75rem,1.15rem+1.7vw,2.75rem)] leading-[1.08] tracking-[-0.015em] md:col-span-8 md:mx-0 md:max-w-[34ch]">
              <MaskReveal>
                <Copy value={article.title} tone="inherit" />
              </MaskReveal>
            </h1>
            <div className="flex flex-col items-center gap-3 md:hidden">
              <ArticleMeta article={article} />
              <p className="label text-ink-muted">
                By <Copy value={article.author} tone="inherit" />
              </p>
            </div>
            <Reveal delay={0.15} className="hidden self-end md:col-span-4 md:block lg:col-span-3 lg:col-start-10">
              <dl className="border-t border-line">
                {[
                  ['Topic', <span className="text-terracotta">{article.category}</span>],
                  ['Published', article.date ? <time dateTime={article.date}>{formatDate(article.date)}</time> : <Copy value={formatDate(null)} tone="inherit" />],
                  ['Reading time', <Copy value={article.readTime} tone="inherit" />],
                  ['Written by', <Copy value={article.author} tone="inherit" />],
                ].map(([term, value]) => (
                  <div key={term} className="flex items-baseline justify-between gap-4 border-b border-line py-3">
                    <dt className="label text-[0.625rem] text-ink-muted">{term}</dt>
                    <dd className="label text-right text-[0.6875rem] text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <Hairline />
        </header>

        <Reveal className="container-page">
          <ProjectPlate project={article} ratio="16 / 9" letter="g" crop="right" label="[Article image]" cursor={undefined} priority />
        </Reveal>

        {/* From lg: a sticky contents rail beside the reading column */}
        <div className="container-page section-y lg:grid lg:grid-cols-12 lg:gap-6">
          <Contents article={article} />
          <div className="mx-auto max-w-[40rem] text-center text-lead md:text-left lg:col-span-8 lg:col-start-5 lg:mx-0 lg:max-w-[46rem]">
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
        <section aria-labelledby="related-title" className="relative isolate section-y">
          <Ground tone="blush" />
          <div className="container-page">
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

      <section aria-label="Newsletter" className={`container-page pb-12 md:pb-16 ${related.length > 0 ? 'pt-12 md:pt-16' : ''}`}>
        <div className={`mx-auto max-w-xl ${related.length > 0 ? '' : 'border-t border-line pt-10'}`}>
          <NewsletterForm id="article-newsletter" />
        </div>
      </section>

      <FinalCta numeral={null} headline={article.cta?.headline} body={article.cta?.body} />
    </>
  )
}

/** The measured hairline under every page header: a b-dot, a line drawing across, a g-dot. */
function Hairline() {
  const reduced = useReducedMotion()
  return (
    <div aria-hidden className="relative mt-8 h-2.5 md:mt-10">
      <m.span
        className="absolute top-1/2 right-1.5 left-1.5 h-px origin-left bg-line"
        initial={reduced ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />
      <span className="absolute top-0 left-0 size-2.5 rounded-full bg-terracotta" />
      <span className="absolute top-0 right-0 size-2.5 rounded-full bg-ink" />
    </div>
  )
}

/** Large screens: the article's sections as a sticky, numbered contents list that follows the reader. */
function Contents({ article }) {
  const { scrollTo } = useSmoothScroll()
  const hrefClick = useHrefClick()
  const sections = article.body.filter((b) => b?.h2).map((b) => ({ id: anchorOf(b.h2), title: b.h2 }))
  const [current, setCurrent] = useState(sections[0]?.id)

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean)
    if (!els.length) return
    // The reader is in the last section whose heading has passed the upper third of the screen.
    const update = () => {
      const line = window.innerHeight * 0.35
      const passed = els.filter((el) => el.getBoundingClientRect().top < line)
      setCurrent((passed.at(-1) ?? els[0]).id)
    }
    const io = new IntersectionObserver(update, { rootMargin: '0px 0px -60% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article.slug])

  if (!sections.length) return null
  return (
    <aside aria-label="In this article" className="hidden lg:col-span-3 lg:block">
      <div className="sticky top-28">
        <p className="label text-[0.625rem] text-ink-muted">In this article</p>
        <ol className="mt-4 border-t border-line">
          {sections.map((s, i) => {
            const on = s.id === current
            return (
              <li key={s.id} className="border-b border-line">
                <a
                  href={`#${s.id}`}
                  aria-current={on ? 'location' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollTo(`#${s.id}`, { offset: -112 })
                  }}
                  className={`flex gap-3 py-3 text-sm leading-snug transition-colors duration-300 ${on ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
                >
                  <span className={`label shrink-0 pt-px text-[0.625rem] tabular-nums transition-colors duration-300 ${on ? 'text-terracotta' : ''}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.title}
                </a>
              </li>
            )
          })}
        </ol>
        <a
          href="/contact"
          onClick={(e) => hrefClick(e, '/contact')}
          data-cursor="start"
          className="group mt-8 block rounded-[0.625rem] bg-ink px-5 py-5 text-cream transition-colors duration-500 hover:bg-terracotta"
        >
          <span className="label block text-[0.625rem] text-cream/60">Working on this?</span>
          <span className="mt-2 flex items-center justify-between gap-3 font-display text-xl">
            Talk to BrandGap
            <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </a>
      </div>
    </aside>
  )
}
