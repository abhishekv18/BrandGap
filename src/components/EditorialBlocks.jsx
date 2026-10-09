import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Fragment } from 'react'
import { PUBLISHED_PROJECTS } from '../data/projects'
import { useHrefClick } from '../hooks/useHrefClick'
import { Ground } from './Ground'
import { MaskReveal, Reveal } from './Reveal'
import { SectionLabel } from './SectionLabel'

/**
 * Editorial blocks for the case-study and service pages. Content lives in
 * data files (projects.js, servicePages.js) as a list of typed blocks; this
 * renders each one in the BrandGap system — numbered section labels, the
 * serif headline with its terracotta italic, hairline rules, quiet reveals.
 *
 * Block types: intro · pillars · ledger · cards · timeline · insights ·
 * workstreams · proof · engines · loops · groups · grid · proofs · links ·
 * cases. A page can pass `slots` to render its own content for a block type
 * (e.g. the case page's metrics panel).
 *
 * A block can set `ground: 'blush' | 'ink'` to sit on a full-width coloured ground, with the
 * same opening/closing transition as the homepage (components/Ground.jsx). Ink remaps the
 * text tokens to light (global.css); cards that keep their own light surface opt back out
 * with data-ground="paper".
 */

const pad = (n) => String(n).padStart(2, '0')

/** Section heading: numbered label + headline with its italic emphasis. */
function Head({ n, label, headline, emphasis, id, className = '' }) {
  return (
    <div className={`text-center md:text-left ${className}`}>
      <SectionLabel numeral={pad(n)} name={label} />
      {headline && (
        <h2 id={id} className="mt-5 text-h2 md:mt-7">
          <MaskReveal>{headline}</MaskReveal>
          {emphasis && (
            <MaskReveal delay={0.08} className="italic text-terracotta">
              {emphasis}
            </MaskReveal>
          )}
        </h2>
      )}
    </div>
  )
}

/** A core line, set as a quiet pull quote. */
function Line({ children }) {
  if (!children) return null
  return (
    <Reveal as="p" className="space-subblock mx-auto max-w-3xl border-l-2 border-terracotta pl-5 text-left font-display text-h3 italic text-ink md:mx-0 md:pl-7">
      {children}
    </Reveal>
  )
}

function Note({ children }) {
  if (!children) return null
  return <p className="mt-4 text-center text-xs text-ink-muted md:text-left">{children}</p>
}

function Chips({ items }) {
  if (!items?.length) return null
  return (
    <ul className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
      {items.map((c) => (
        <li key={c} className="label rounded-full border border-line px-3.5 py-1.5 text-[0.625rem] text-ink-soft">
          {c}
        </li>
      ))}
    </ul>
  )
}

/** A table: full grid from `sm`, a stack of short blocks on phones. */
function Table({ columns, rows, caption }) {
  if (!rows?.length) return null
  const head = columns ?? []
  return (
    <div className="space-heading-content">
      <dl className="flex flex-col overflow-hidden rounded-[0.625rem] border border-line sm:hidden">
        {rows.map((row, r) => (
          <div key={r} className="border-t border-line px-4 py-4 first:border-t-0">
            <dt className="font-display text-lg text-ink">{row[0]}</dt>
            {row.slice(1).map((cell, c) => (
              <dd key={c} className="mt-2 text-sm text-ink-soft">
                {head[c + 1] && <span className="label mb-0.5 block text-[0.5625rem] text-ink-muted">{head[c + 1]}</span>}
                {cell}
              </dd>
            ))}
          </div>
        ))}
      </dl>
      <div role="region" aria-label={caption} tabIndex={0} className="hidden overflow-x-auto rounded-[0.625rem] border border-line focus-visible:outline-2 focus-visible:outline-terracotta sm:block">
        <table className="w-full border-collapse text-left text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          {head.length > 0 && (
            <thead className="bg-blush/50">
              <tr>
                {head.map((h) => (
                  <th key={h} scope="col" className="label px-5 py-3 align-bottom text-[0.625rem] font-normal text-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className="border-t border-line align-top first:border-t-0">
                {row.map((cell, c) =>
                  c === 0 ? (
                    <th key={c} scope="row" className="px-5 py-4 font-display text-base font-normal whitespace-nowrap text-ink md:text-lg">
                      {cell}
                    </th>
                  ) : (
                    <td key={c} className="px-5 py-4 text-ink-soft">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** A horizontal chain of steps (stacked on phones). */
function Chain({ steps, tone = 'terracotta' }) {
  const accent = tone === 'muted' ? 'text-ink-muted' : 'text-ink'
  return (
    <ol className="flex flex-col items-center gap-2 md:flex-row md:flex-wrap md:items-center md:gap-x-3 md:gap-y-3">
      {steps.map((step, i) => (
        <Fragment key={step}>
          <li className={`flex items-center gap-2 ${accent}`}>
            <span className={`label tabular-nums text-[0.625rem] ${tone === 'muted' ? 'text-ink-muted' : 'text-terracotta'}`}>{pad(i + 1)}</span>
            <span className={`font-display text-xl md:text-2xl ${tone === 'muted' ? 'line-through decoration-ink/30 decoration-1' : ''}`}>{step}</span>
          </li>
          {i < steps.length - 1 && (
            <li aria-hidden className={`rotate-90 md:rotate-0 ${tone === 'muted' ? 'text-ink-muted/60' : 'text-terracotta'}`}>
              <ArrowRight strokeWidth={1.25} className="size-4" />
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  )
}

/* ---------------- Block renderers ---------------- */

function Intro({ b, n }) {
  return (
    <div className="grid gap-heading-row lg:grid-cols-12 lg:gap-6">
      <Head n={n} label={b.label} headline={b.headline} emphasis={b.emphasis} className="lg:col-span-5" />
      <div className="lg:col-span-6 lg:col-start-7 lg:pt-12">
        {b.body?.map((p, i) => (
          <Reveal as="p" key={i} delay={i * 0.06} className="mx-auto mt-5 max-w-2xl text-center text-lead text-ink-soft first:mt-0 md:mx-0 md:text-left">
            {p}
          </Reveal>
        ))}
        <Chips items={b.chips} />
      </div>
      {b.line && (
        <div className="lg:col-span-12">
          <Line>{b.line}</Line>
        </div>
      )}
    </div>
  )
}

function Pillars({ b, n }) {
  return (
    <>
      <Head n={n} label={b.label} headline={b.headline} emphasis={b.emphasis} />
      <ol className="space-heading-content border-b border-line">
        {b.items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={i * 0.04} className="grid gap-2 border-t border-line py-6 text-center md:grid-cols-12 md:items-baseline md:gap-6 md:py-7 md:text-left">
            <span className="font-display text-h3 tabular-nums text-terracotta md:col-span-1">{pad(i + 1)}</span>
            <h3 className="font-display text-h3 tracking-[-0.02em] md:col-span-4">{item.title}</h3>
            <p className="mx-auto max-w-2xl text-ink-soft md:col-span-7 md:mx-0">{item.body}</p>
          </Reveal>
        ))}
      </ol>
      <Line>{b.line}</Line>
    </>
  )
}

function Ledger({ b, n }) {
  return (
    <>
      <div className="grid gap-heading-row lg:grid-cols-12 lg:gap-6">
        <Head n={n} label={b.label} headline={b.headline} emphasis={b.emphasis} className="lg:col-span-7" />
        {b.intro && <p className="mx-auto max-w-xl self-end text-center text-lead text-ink-soft md:mx-0 md:text-left lg:col-span-5">{b.intro}</p>}
      </div>
      <Table columns={b.columns} rows={b.rows} caption={b.label} />
      <Note>{b.note}</Note>
      <Line>{b.line}</Line>
    </>
  )
}

function Cards({ b, n }) {
  return (
    <>
      <div className="grid gap-heading-row lg:grid-cols-12 lg:gap-6">
        <Head n={n} label={b.label} headline={b.headline} emphasis={b.emphasis} className="lg:col-span-7" />
        {b.intro && <p className="mx-auto max-w-xl self-end text-center text-sm text-ink-muted md:mx-0 md:text-left lg:col-span-5">{b.intro}</p>}
      </div>
      <ul className="space-heading-content grid gap-px overflow-hidden rounded-[0.625rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {b.items.map((item, i) => (
          <Reveal as="li" key={`${item.title}-${i}`} delay={(i % 3) * 0.05} className="flex flex-col bg-cream p-6 text-center md:p-7 md:text-left">
            <p className="font-display text-h3 text-terracotta">{item.kicker}</p>
            <h3 className="mt-3 font-display text-xl tracking-[-0.01em] md:text-2xl">{item.title}</h3>
            <p className="label mt-3 text-[0.5625rem] leading-relaxed text-ink-muted">{item.meta}</p>
            <p className="mt-4 text-sm text-ink-soft">{item.body}</p>
          </Reveal>
        ))}
        {/* Fill the last row so the hairline grid never shows an empty grey cell */}
        {b.items.length % 2 === 1 && <li aria-hidden className="hidden bg-cream sm:block lg:hidden" />}
        {Array.from({ length: (3 - (b.items.length % 3)) % 3 }, (_, k) => (
          <li key={`fill-${k}`} aria-hidden className="hidden bg-cream lg:block" />
        ))}
      </ul>
    </>
  )
}

function Timeline({ b, n }) {
  return (
    <>
      <div className="grid gap-heading-row lg:grid-cols-12 lg:gap-6">
        <Head n={n} label={b.label} headline={b.headline} emphasis={b.emphasis} className="lg:col-span-5" />
        {b.body && <p className="mx-auto max-w-2xl text-center text-lead text-ink-soft md:mx-0 md:text-left lg:col-span-6 lg:col-start-7 lg:pt-12">{b.body}</p>}
      </div>
      <Reveal className="space-heading-content border-y border-line py-7 md:py-8">
        <Chain steps={b.steps} />
      </Reveal>
    </>
  )
}

function Insights({ b, n }) {
  return (
    <>
      <Head n={n} label={b.label} headline={b.headline} emphasis={b.emphasis} />
      <ul className="space-heading-content grid gap-x-10 md:grid-cols-2">
        {b.items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={(i % 2) * 0.06} className="border-t border-line py-6 text-center md:text-left">
            <p className="label tabular-nums text-terracotta">{pad(i + 1)}</p>
            <h3 className="mt-3 font-display text-xl tracking-[-0.01em] md:text-2xl">{item.title}</h3>
            <p className="mx-auto mt-3 max-w-xl text-ink-soft md:mx-0">{item.body}</p>
          </Reveal>
        ))}
      </ul>
    </>
  )
}

function Workstreams({ b, n }) {
  return (
    <>
      <Intro b={{ ...b, line: null }} n={n} />
      <Table columns={['Workstream', 'What BrandGap does']} rows={b.rows} caption={b.label} />
      {b.links?.length > 0 && (
        <ul className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start" aria-label="Channels">
          {b.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group label inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/25 px-5 text-[0.6875rem] text-ink transition-colors hover:border-terracotta hover:text-terracotta"
              >
                {l.label}
                <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <Line>{b.line}</Line>
    </>
  )
}

function Proof({ b }) {
  return (
    <figure className="mx-auto max-w-6xl">
      <div data-frame className="overflow-hidden rounded-[0.625rem] border border-line bg-white shadow-[0_30px_60px_-40px_rgba(28,18,22,0.45)]">
        <img
          src={b.image.src}
          srcSet={b.image.srcSet}
          sizes="(min-width: 1200px) 1152px, 100vw"
          alt={b.image.alt}
          width={b.image.width}
          height={b.image.height}
          loading="lazy"
          decoding="async"
          className="h-auto w-full"
        />
      </div>
      <figcaption className="mt-3 text-center text-xs text-ink-muted md:text-left">{b.caption}</figcaption>
    </figure>
  )
}

function Engines({ b, n }) {
  return (
    <>
      <Head n={n} label={b.label} headline={b.headline} emphasis={b.emphasis} />
      <div className="space-heading-content grid gap-px overflow-hidden rounded-[0.625rem] border border-line bg-line md:grid-cols-2">
        {b.items.map((e, i) => (
          <Reveal key={e.kicker} delay={i * 0.08} className={`flex flex-col p-6 text-center md:p-9 md:text-left ${i ? 'bg-ink text-cream' : 'bg-blush'}`}>
            <p className={`label text-[0.6875rem] ${i ? 'text-blush' : 'text-terracotta-deep'}`}>{e.kicker}</p>
            <h3 className="mt-3 font-display text-h3 tracking-[-0.02em]">{e.title}</h3>
            <p className="mt-8 font-display text-[clamp(3rem,2rem+4vw,5.5rem)] leading-none tracking-[-0.03em]">{e.value}</p>
            <p className={`label mt-2 text-[0.625rem] ${i ? 'text-cream/70' : 'text-ink-muted'}`}>{e.unit}</p>
            <p className={`mt-6 text-sm ${i ? 'text-cream/80' : 'text-ink-soft'}`}>{e.body}</p>
          </Reveal>
        ))}
      </div>
      <Line>{b.line}</Line>
    </>
  )
}

function Loops({ b, n }) {
  return (
    <>
      <div className="grid gap-heading-row lg:grid-cols-12 lg:gap-6">
        <Head n={n} label={b.label} headline={b.headline} emphasis={b.emphasis} className="lg:col-span-5" />
        <p className="mx-auto max-w-2xl text-center text-lead text-ink-soft md:mx-0 md:text-left lg:col-span-6 lg:col-start-7 lg:pt-12">{b.body}</p>
      </div>
      <div className="space-heading-content grid gap-px overflow-hidden rounded-[0.625rem] border border-line bg-line">
        <Reveal className="flex flex-col items-center gap-4 bg-cream px-5 py-6 md:flex-row md:gap-8 md:px-8">
          <p className="label w-48 shrink-0 text-center text-[0.625rem] text-ink-muted md:text-left">{b.badLabel ?? 'The bad loop'}</p>
          <Chain steps={b.bad} tone="muted" />
        </Reveal>
        <Reveal delay={0.08} className="flex flex-col items-center gap-4 bg-blush/60 px-5 py-6 md:flex-row md:gap-8 md:px-8">
          <p className="label w-48 shrink-0 text-center text-[0.625rem] text-terracotta-deep md:text-left">{b.goodLabel ?? 'The BrandGap loop'}</p>
          <Chain steps={b.good} />
        </Reveal>
      </div>
    </>
  )
}

function Groups({ b, n }) {
  const cols = 'lg:grid-cols-4'
  return (
    <>
      <Head n={n} label={b.label} headline={b.headline} emphasis={b.emphasis} />
      <ul className={`space-heading-content grid gap-px overflow-hidden rounded-[0.625rem] border border-line bg-line sm:grid-cols-2 ${cols}`}>
        {b.items.map((g, i) => (
          <Reveal as="li" key={g.title} delay={(i % 4) * 0.05} className="bg-cream p-6 text-center md:text-left">
            <p className="label tabular-nums text-[0.625rem] text-terracotta">{pad(i + 1)}</p>
            <h3 className="mt-2 font-display text-xl tracking-[-0.01em] md:text-2xl">{g.title}</h3>
            <ul className="mt-4 flex flex-col gap-1.5 text-sm text-ink-soft">
              {g.items.map((item) => (
                <li key={item} className="flex items-baseline justify-center gap-3 md:justify-start">
                  <span aria-hidden className="hidden h-px w-3 shrink-0 -translate-y-1 bg-terracotta md:block" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ul>
    </>
  )
}

function Grid({ b, n }) {
  const cols = b.items.length === 4 ? 'lg:grid-cols-4' : b.items.length >= 8 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
  return (
    <>
      <Head n={n} label={b.label} headline={b.headline} emphasis={b.emphasis} />
      <ul className={`space-heading-content grid gap-x-8 sm:grid-cols-2 ${cols}`}>
        {b.items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={(i % 4) * 0.04} className="border-t border-line py-5 text-center md:text-left">
            <h3 className="label text-[0.6875rem] text-terracotta">{item.title}</h3>
            <p className="mx-auto mt-2 max-w-sm font-display text-xl leading-snug text-ink md:mx-0">{item.body}</p>
          </Reveal>
        ))}
      </ul>
      <Line>{b.line}</Line>
    </>
  )
}

function Proofs({ b, n }) {
  const hrefClick = useHrefClick()
  return (
    <>
      <Head n={n} label={b.label} headline={b.headline} emphasis={b.emphasis} />
      <div className="space-heading-content flex flex-col gap-6 md:gap-8">
        {b.items.map((p) => {
          const href = `/portfolio/${p.slug}`
          return (
            <Reveal key={p.slug} data-ground="paper" className="overflow-hidden rounded-[0.625rem] border border-line bg-cream">
              <div className="flex flex-col items-center gap-3 border-b border-line bg-blush/50 px-5 py-5 text-center md:flex-row md:items-end md:justify-between md:px-8 md:text-left">
                <div>
                  <p className="label text-[0.625rem] text-ink-muted">Proof</p>
                  <h3 className="mt-2 font-display text-h3 tracking-[-0.02em]">{p.client}</h3>
                  <p className="mt-1 max-w-2xl text-ink-soft">{p.positioning}</p>
                </div>
                <a
                  href={href}
                  onClick={(e) => hrefClick(e, href)}
                  data-cursor="view"
                  className="group label inline-flex min-h-11 shrink-0 items-center gap-2 text-[0.6875rem] text-ink transition-colors hover:text-terracotta"
                >
                  View case study
                  <ArrowRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                </a>
              </div>
              <dl className="grid grid-cols-2 gap-px bg-line md:grid-cols-4">
                {p.stats.map((s) => (
                  <div key={s.label} className="flex flex-col-reverse justify-end gap-1.5 bg-cream px-5 py-5 text-center md:px-8 md:text-left">
                    <dt className="label text-[0.5625rem] text-ink-muted">{s.label}</dt>
                    <dd className="font-display text-[clamp(1.5rem,1rem+1.2vw,2.25rem)] leading-none">{s.value}</dd>
                  </div>
                ))}
              </dl>
              {p.rows?.length > 0 && (
                <div className="border-t border-line px-3 pb-4 md:px-6 [&>.space-heading-content]:mt-4">
                  <Table columns={p.columns} rows={p.rows} caption={`${p.client} — campaign proof`} />
                </div>
              )}
              <p className="border-t border-line px-5 py-3 text-center text-xs text-ink-muted md:px-8 md:text-left">{p.note}</p>
            </Reveal>
          )
        })}
      </div>
    </>
  )
}

function Links({ b, n }) {
  const hrefClick = useHrefClick()
  return (
    <>
      <div className="grid gap-heading-row lg:grid-cols-12 lg:gap-6">
        <Head n={n} label={b.label} headline={b.headline} emphasis={b.emphasis} className="lg:col-span-7" />
        {b.intro && <p className="mx-auto max-w-xl self-end text-center text-ink-soft md:mx-0 md:text-left lg:col-span-5">{b.intro}</p>}
      </div>
      <ul className="space-heading-content grid gap-px overflow-hidden rounded-[0.625rem] border border-line bg-line md:grid-cols-3">
        {b.items.map((item, i) => {
          const body = (
            <>
              <span className="label tabular-nums text-[0.625rem] text-terracotta">{pad(i + 1)}</span>
              <span className="mt-3 block font-display text-h3 tracking-[-0.02em]">{item.title}</span>
              <span className="mt-2 block text-sm text-ink-soft">{item.body}</span>
              {item.href && (
                <span className="label mt-5 inline-flex items-center gap-2 text-[0.625rem] text-ink transition-colors group-hover:text-terracotta">
                  Explore
                  <ArrowRight aria-hidden strokeWidth={1.5} className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              )}
            </>
          )
          return (
            <li key={item.title} className={item.href ? 'bg-cream' : 'bg-blush/60'}>
              {item.href ? (
                <a href={item.href} onClick={(e) => hrefClick(e, item.href)} className="group block h-full p-6 text-center md:p-8 md:text-left">
                  {body}
                </a>
              ) : (
                <div className="h-full p-6 text-center md:p-8 md:text-left">{body}</div>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}

function Cases({ b, n }) {
  const hrefClick = useHrefClick()
  return (
    <>
      <Head n={n} label={b.label} headline={b.headline} emphasis={b.emphasis} />
      <ul className="space-heading-content border-t border-line">
        {b.items.map((c, i) => {
          const project = PUBLISHED_PROJECTS.find((p) => p.slug === c.slug)
          if (!project) return null
          const href = `/portfolio/${c.slug}`
          return (
            <Reveal as="li" key={c.slug} delay={i * 0.05} className="border-b border-line">
              <a
                href={href}
                onClick={(e) => hrefClick(e, href)}
                data-cursor="view"
                className="group flex flex-col items-center gap-2 py-6 text-center md:grid md:grid-cols-12 md:items-baseline md:gap-6 md:text-left"
              >
                <span className="label tabular-nums text-ink-muted md:col-span-1">{pad(i + 1)}</span>
                <span className="font-display text-h3 tracking-[-0.02em] transition-colors group-hover:text-terracotta md:col-span-4">{project.client}</span>
                <span className="text-ink-soft md:col-span-4">{c.title}</span>
                <span className="label flex items-center gap-3 text-[0.625rem] text-terracotta md:col-span-3 md:justify-end">
                  {c.tags}
                  <ArrowRight aria-hidden strokeWidth={1.5} className="size-4 text-ink transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              </a>
            </Reveal>
          )
        })}
      </ul>
    </>
  )
}

/** Brand voice: a statement, the personality words strung on terracotta dots, and the origin line. */
function Traits({ b, n }) {
  return (
    <>
      <div className="grid gap-heading-row lg:grid-cols-12 lg:gap-6">
        <Head n={n} label={b.label} headline={b.headline} emphasis={b.emphasis} className="lg:col-span-6" />
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-12">
          {b.body?.map((p, i) => (
            <Reveal as="p" key={i} delay={i * 0.06} className="mx-auto mt-4 max-w-xl text-center text-lead text-ink-soft first:mt-0 md:mx-0 md:text-left">
              {p}
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal className="space-heading-content flex flex-col items-center gap-5 border-y border-line py-6 md:flex-row md:items-baseline md:justify-between md:py-7">
        <p className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-2 font-display text-h3 md:justify-start">
          {b.words.map((word, i) => (
            <Fragment key={word}>
              {i > 0 && <span aria-hidden className="size-1.5 -translate-y-[0.3em] rounded-full bg-terracotta" />}
              <span>{word}</span>
            </Fragment>
          ))}
        </p>
        {b.origin && <p className="label shrink-0 text-ink-muted">{b.origin}</p>}
      </Reveal>
    </>
  )
}

const RENDER = {
  traits: Traits,
  intro: Intro,
  pillars: Pillars,
  ledger: Ledger,
  cards: Cards,
  timeline: Timeline,
  insights: Insights,
  workstreams: Workstreams,
  proof: Proof,
  engines: Engines,
  loops: Loops,
  groups: Groups,
  grid: Grid,
  proofs: Proofs,
  links: Links,
  cases: Cases,
}

/** Renders a page's blocks in order, numbering the ones with a label. */
export function EditorialBlocks({ blocks, slots = {}, start = 0 }) {
  let n = start
  return blocks.map((b, i) => {
    if (slots[b.type]) return <Fragment key={i}>{slots[b.type]}</Fragment>
    const Block = RENDER[b.type]
    if (!Block) return null
    if (b.label) n += 1
    if (b.ground) {
      return (
        <section
          key={i}
          id={b.id}
          aria-label={b.label ?? undefined}
          {...(b.ground === 'ink' ? { 'data-ground': 'ink' } : {})}
          className="relative isolate scroll-mt-24 section-y"
        >
          <Ground tone={b.ground} />
          <div className="container-page">
            <Block b={b} n={n} />
          </div>
        </section>
      )
    }
    // After a coloured ground the ground itself is the divider, so the hairline gives way to space.
    const afterGround = !!blocks[i - 1]?.ground
    return (
      <section
        key={i}
        id={b.id}
        aria-label={b.label ?? undefined}
        className={`container-page scroll-mt-24 pb-12 md:pb-16 ${afterGround ? 'pt-12 md:pt-16' : ''}`}
      >
        <div className={b.type === 'proof' || afterGround ? '' : 'border-t border-line pt-10 md:pt-12'}>
          <Block b={b} n={n} />
        </div>
      </section>
    )
  })
}
