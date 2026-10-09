import { AnimatePresence, m } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { Fragment, useState } from 'react'
import { MagneticButton } from '../components/MagneticButton'
import { PageHero } from '../components/PageHero'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { whatsappHref } from '../components/WhatsAppButton'
import { CONTACT } from '../data/contact'
import { FAQ, FAQ_GROUPS, FAQ_INTRO } from '../data/faq'
import { useHrefClick } from '../hooks/useHrefClick'
import { breadcrumbLd, useSeo } from '../hooks/useSeo'
import { FinalCta } from '../sections/FinalCta'
import { track } from '../utils/analytics'

const EASE = [0.16, 1, 0.3, 1]
const LINK = /\[([^\]]+)\]\(([^)]+)\)/g
const pad = (n) => String(n).padStart(2, '0')

/** Answer text with [label](/path) links; internal links use the page transition. */
function Answer({ text }) {
  const hrefClick = useHrefClick()
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (!link) return <Fragment key={i}>{part}</Fragment>
    return (
      <a
        key={i}
        href={link[2]}
        onClick={(e) => hrefClick(e, link[2])}
        className="text-ink underline decoration-terracotta/40 underline-offset-4 transition-colors hover:text-terracotta hover:decoration-terracotta"
      >
        {link[1]}
      </a>
    )
  })
}

/** One question: the existing accordion — numbered, serif question, rotating plus. */
function Question({ item, n, open, onToggle }) {
  const id = `faq-${item.id}`
  return (
    <li className="border-b border-line">
      <h3 className="font-sans">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="group flex min-h-11 w-full items-center justify-between gap-5 py-5 text-left md:gap-6 md:py-6"
        >
          <span className="flex items-baseline gap-4 md:gap-6">
            <span className={`label shrink-0 tabular-nums ${open ? 'text-terracotta' : 'text-ink-muted'}`}>{n}</span>
            <span className={`font-display text-xl leading-snug tracking-[-0.01em] transition-colors md:text-2xl ${open ? 'text-terracotta' : 'group-hover:text-terracotta'}`}>
              {item.question}
            </span>
          </span>
          <span
            aria-hidden
            className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-[transform,border-color,color] duration-500 ease-(--ease-out-expo) md:size-11 ${
              open ? 'rotate-45 border-terracotta text-terracotta' : 'border-line group-hover:border-ink'
            }`}
          >
            <Plus strokeWidth={1.5} className="size-4" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={id}
            role="region"
            aria-label={item.question}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 text-ink-soft md:pb-7 md:pl-[3.25rem] md:text-lead">
              <Answer text={item.answer} />
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </li>
  )
}

/** "Still have a question?" — the real ways to reach BrandGap. */
function AskPanel({ className = '' }) {
  const wa = whatsappHref()
  return (
    <div className={`rounded-[0.625rem] border border-line bg-blush/45 p-6 text-center md:p-7 lg:text-left ${className}`}>
      <p className="label text-[0.625rem] text-terracotta-deep">Still have a question?</p>
      <p className="mt-3 font-display text-h3 tracking-[-0.02em]">We’re happy to talk it through.</p>
      <p className="mt-2 text-sm text-ink-soft">Tell us about your brand and we’ll come back with the right next step.</p>
      <div className="mt-5 flex justify-center lg:justify-start">
        <MagneticButton href="/contact" cursor="start" trackAs="faq_start_project">
          Start a conversation
        </MagneticButton>
      </div>
      <ul className="mt-5 flex flex-col items-center gap-1 border-t border-line pt-4 text-sm lg:items-start">
        {wa && (
          <li>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('whatsapp_click', { location: 'faq' })}
              className="group inline-flex min-h-11 items-center gap-2 text-ink transition-colors hover:text-terracotta lg:min-h-9"
            >
              Chat on WhatsApp
              <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </li>
        )}
        {CONTACT.email.href && (
          <li>
            <a href={CONTACT.email.href} className="inline-flex min-h-11 items-center text-ink transition-colors hover:text-terracotta lg:min-h-9">
              {CONTACT.email.label}
            </a>
          </li>
        )}
      </ul>
    </div>
  )
}

/**
 * /faq — questions grouped by topic, with a sticky index and a way to ask
 * directly. Emits FAQPage schema for every answer (links stripped).
 */
export default function Faq() {
  const [open, setOpen] = useState(FAQ[0]?.id ?? null)
  const hrefClick = useHrefClick()

  useSeo({
    title: 'FAQ',
    description: 'What BrandGap does, who we work with, how we measure results and how to start a project — answers to common questions.',
    path: '/faq',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer.replace(LINK, '$1') },
        })),
      },
      breadcrumbLd([{ name: 'FAQ', path: '/faq' }]),
    ],
  })

  let n = 0
  return (
    <>
      <PageHero crumbs={[{ name: 'FAQ', path: '/faq' }]} lead="Questions," emphasis="answered." intro={FAQ_INTRO.intro} />

      <section aria-label="Frequently asked questions" className="container-page pb-12 md:pb-16">
        {/* Phones and tablets: the topics as a quick row of links */}
        <nav aria-label="FAQ topics" className="mb-8 lg:hidden">
          <ul className="flex flex-wrap justify-center gap-2 md:justify-start">
            {FAQ_GROUPS.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  onClick={(e) => hrefClick(e, `#${g.id}`)}
                  className="label inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[0.625rem] text-ink transition-colors hover:border-terracotta hover:text-terracotta"
                >
                  {g.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          {/* Desktop: a sticky index and the way to ask directly */}
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28">
              <nav aria-label="FAQ topics">
                <p className="label text-ink-muted">Topics</p>
                <ol className="mt-4 border-t border-line">
                  {FAQ_GROUPS.map((g, i) => (
                    <li key={g.id} className="border-b border-line">
                      <a
                        href={`#${g.id}`}
                        onClick={(e) => hrefClick(e, `#${g.id}`)}
                        className="group flex min-h-11 items-baseline justify-between gap-3 py-3 transition-colors hover:text-terracotta"
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="label tabular-nums text-ink-muted">{pad(i + 1)}</span>
                          <span className="font-display text-lg">{g.name}</span>
                        </span>
                        <span className="label text-[0.5625rem] tabular-nums text-ink-muted">{pad(g.items.length)}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <AskPanel className="mt-8" />
            </div>
          </aside>

          <div className="lg:col-span-8">
            {FAQ_GROUPS.map((g, gi) => (
              <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="scroll-mt-28 pb-10 last:pb-0 md:pb-14">
                <div className="text-center md:text-left">
                  <SectionLabel numeral={pad(gi + 1)} name={`${g.items.length} questions`} />
                  <h2 id={`${g.id}-title`} className="mt-4 text-h3 tracking-[-0.02em] md:mt-5">
                    <MaskReveal>{g.name}</MaskReveal>
                  </h2>
                </div>
                <Reveal as="ul" className="mt-5 border-t border-line md:mt-6">
                  {g.items.map((item) => {
                    n += 1
                    return (
                      <Question key={item.id} item={item} n={pad(n)} open={open === item.id} onToggle={() => setOpen(open === item.id ? null : item.id)} />
                    )
                  })}
                </Reveal>
              </section>
            ))}

            {/* Phones and tablets: the way to ask sits after the questions */}
            <AskPanel className="mt-10 lg:hidden" />
          </div>
        </div>
      </section>

      <FinalCta numeral={null} />
    </>
  )
}
