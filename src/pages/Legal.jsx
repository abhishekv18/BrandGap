import { Copy } from '../components/Copy'
import { PageHero } from '../components/PageHero'
import { LEGAL } from '../data/legal'
import { breadcrumbLd, useSeo } from '../hooks/useSeo'

/** /privacy and /terms (brief §9.8) — structure ready for the supplied text. */
export default function Legal({ kind }) {
  const doc = LEGAL[kind]
  const path = `/${kind}`
  useSeo({
    title: doc.title,
    description: `${doc.title} — BrandGap.`,
    path,
    jsonLd: breadcrumbLd([{ name: doc.title, path }]),
  })

  return (
    <>
      <PageHero crumbs={[{ name: doc.title, path }]} lead={doc.title} />
      <section aria-label={doc.title} className="container-page pb-12 md:pb-16">
        <div className="mx-auto max-w-[38rem] text-lead md:mx-0 md:ml-[33.333%]">
          <p className="label text-ink-muted">
            Last updated <Copy value={doc.updated} tone="inherit" />
          </p>
          {doc.body.map((p, i) => (
            <p key={i} className="mt-6 text-ink-soft">
              <Copy value={p} />
            </p>
          ))}
        </div>
      </section>
    </>
  )
}
