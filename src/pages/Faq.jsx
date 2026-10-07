import { AnimatePresence, m } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Copy, isPlaceholder } from '../components/Copy'
import { MagneticButton } from '../components/MagneticButton'
import { PageHero } from '../components/PageHero'
import { FAQ, FAQ_INTRO } from '../data/faq'
import { breadcrumbLd, useSeo } from '../hooks/useSeo'
import { FinalCta } from '../sections/FinalCta'

const EASE = [0.16, 1, 0.3, 1]

/**
 * /faq — common pre-sales questions (brief §7). FAQPage schema is emitted
 * only for approved answers; placeholders never reach search results.
 */
export default function Faq() {
  const [open, setOpen] = useState(0)
  const approved = FAQ.filter((f) => !isPlaceholder(f.answer))

  useSeo({
    title: 'FAQ',
    description: 'Minimum ad spend, time to results, contracts and what is included — answers to common questions about working with BrandGap.',
    path: '/faq',
    jsonLd: [
      ...(approved.length
        ? [
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: approved.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
              })),
            },
          ]
        : []),
      breadcrumbLd([{ name: 'FAQ', path: '/faq' }]),
    ],
  })

  return (
    <>
      <PageHero crumbs={[{ name: 'FAQ', path: '/faq' }]} lead="Questions," emphasis="answered." />

      <section aria-label="Frequently asked questions" className="container-page pb-12 md:pb-16">
        <div className="grid gap-8 md:grid-cols-12 md:gap-6">
          <div className="text-center md:col-span-4 md:text-left">
            <p className="font-display text-h3 italic text-ink-soft">{FAQ_INTRO.title}</p>
            <div className="mt-6 flex justify-center md:justify-start">
              <MagneticButton href="/contact" variant="text" trackAs="faq_start_project">
                Ask us directly
              </MagneticButton>
            </div>
          </div>
          <ul className="border-t border-line md:col-span-8">
            {FAQ.map((f, i) => {
              const on = open === i
              const id = `faq-${f.id}`
              return (
                <li key={f.id} className="border-b border-line">
                  <h2 className="font-sans">
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={id}
                      onClick={() => setOpen(on ? -1 : i)}
                      className="group flex min-h-11 w-full items-center justify-between gap-6 py-5 text-left md:py-6"
                    >
                      <span className="flex items-baseline gap-4 md:gap-8">
                        <span className={`label tabular-nums ${on ? 'text-terracotta' : 'text-ink-muted'}`}>0{i + 1}</span>
                        <span className={`font-display text-h3 tracking-[-0.02em] transition-colors ${on ? 'text-terracotta' : 'group-hover:text-terracotta'}`}>
                          {f.question}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={`flex size-11 shrink-0 items-center justify-center rounded-full border transition-[transform,border-color,color] duration-500 ease-(--ease-out-expo) ${
                          on ? 'rotate-45 border-terracotta text-terracotta' : 'border-line'
                        }`}
                      >
                        <Plus strokeWidth={1.5} className="size-4" />
                      </span>
                    </button>
                  </h2>
                  <AnimatePresence initial={false}>
                    {on && (
                      <m.div
                        id={id}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-6 text-lead text-ink-soft md:pl-14">
                          <Copy value={f.answer} />
                        </p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <FinalCta numeral={null} />
    </>
  )
}
