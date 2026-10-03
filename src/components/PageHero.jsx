import { m } from 'framer-motion'
import { Fragment } from 'react'
import { useHrefClick } from '../hooks/useHrefClick'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { MaskReveal, Reveal } from './Reveal'

const EASE = [0.16, 1, 0.3, 1]

/** "BrandGap / Work / …" — the page's place in the site, as a quiet label. */
export function Breadcrumb({ items }) {
  const hrefClick = useHrefClick()
  const all = [{ name: 'BrandGap', path: '/' }, ...items]
  return (
    <nav aria-label="Breadcrumb">
      <ol className="label flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-ink-muted md:justify-start">
        {all.map((item, i) => {
          const last = i === all.length - 1
          return (
            <Fragment key={item.path}>
              {i > 0 && (
                <li aria-hidden className="text-terracotta">
                  /
                </li>
              )}
              <li>
                {last ? (
                  <span aria-current="page" className="text-ink">
                    {item.name}
                  </span>
                ) : (
                  <a href={item.path} onClick={(e) => hrefClick(e, item.path)} className="inline-flex min-h-11 items-center transition-colors hover:text-terracotta md:min-h-0">
                    {item.name}
                  </a>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * The opening of every inner page, in the homepage's language: breadcrumb,
 * a display headline that rises from its mask (lead + italic terracotta
 * emphasis), an intro set against it, and the measured hairline — a b-dot and
 * a g-dot — drawing across beneath.
 */
export function PageHero({ crumbs, lead, emphasis, intro, children, className = '' }) {
  const reduced = useReducedMotion()
  return (
    <header className={`container-page pt-24 pb-8 text-center md:pt-36 md:pb-12 md:text-left ${className}`}>
      <Breadcrumb items={crumbs} />
      <div className="mt-5 grid gap-6 md:mt-8 md:grid-cols-12 md:gap-6">
        <h1 className="text-display md:col-span-8">
          <MaskReveal>{lead}</MaskReveal>
          {emphasis && (
            <MaskReveal delay={0.08} className="italic text-terracotta">
              {emphasis}
            </MaskReveal>
          )}
        </h1>
        {intro && (
          <Reveal as="p" delay={0.2} className="mx-auto max-w-md self-end text-lead text-ink-soft md:col-span-4 md:mx-0">
            {intro}
          </Reveal>
        )}
      </div>
      {children}
      <div aria-hidden className="relative mt-8 h-2.5 md:mt-10">
        <m.span
          className="absolute top-1/2 right-1.5 left-1.5 h-px origin-left bg-line"
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
        />
        <span className="absolute top-0 left-0 size-2.5 rounded-full bg-terracotta" />
        <m.span
          className="absolute top-0 right-0 size-2.5 rounded-full bg-ink"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.4 }}
        />
      </div>
    </header>
  )
}
