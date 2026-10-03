import { AnimatePresence, m } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Copy } from '../components/Copy'
import { MaskReveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { CLIENT_LOGOS, CLIENTS_INTRO, TESTIMONIALS } from '../data/testimonials'
import { useReducedMotion } from '../hooks/useMediaQuery'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Chapter VII — Clients & testimonials (brief §4, section 07).
 * Logos arrive one by one; a logo shows only with an asset and permission.
 * Each testimonial is a folded card — name, role and result — that opens to
 * the full quote on click.
 */
export function Clients({ numeral = 'VII' }) {
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(0)
  const [lead, ...rest] = CLIENTS_INTRO.title.split(' building ')

  return (
    <section id="clients" aria-labelledby="clients-title" className="container-page section-y text-center md:text-left">
      <SectionLabel numeral={numeral} name="Clients" />
      <h2 id="clients-title" className="mx-auto mt-5 max-w-[22ch] text-h2 md:mx-0 md:mt-7">
        <MaskReveal>{lead} building</MaskReveal>
        <MaskReveal delay={0.08} className="italic text-terracotta">
          {rest.join(' building ')}
        </MaskReveal>
      </h2>

      {/* Logo wall */}
      <m.ul
        aria-label="Clients"
        className="mt-8 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 md:mt-10 lg:grid-cols-6"
        initial={reduced ? false : 'hidden'}
        whileInView="shown"
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ staggerChildren: 0.12 }}
      >
        {CLIENT_LOGOS.map((logo) => {
          const live = logo.src && logo.permission
          return (
            <m.li
              key={logo.id}
              variants={{ hidden: { opacity: 0, y: 14 }, shown: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex aspect-[2/1] items-center justify-center bg-cream p-4"
            >
              {live ? (
                <img
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  loading="lazy"
                  decoding="async"
                  className="max-h-12 w-auto opacity-80 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0"
                />
              ) : (
                <span className="label text-[0.625rem]">
                  <Copy value={logo.name} />
                </span>
              )}
            </m.li>
          )
        })}
      </m.ul>

      {/* Testimonials */}
      <ul aria-label="Testimonials" className="mt-10 border-t border-line md:mt-14">
        {TESTIMONIALS.map((t, i) => (
          <Testimonial key={t.id} t={t} index={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
        ))}
      </ul>
    </section>
  )
}

function Testimonial({ t, index, open, onToggle }) {
  const panelId = `testimonial-${t.id}`
  return (
    <li className="border-b border-line">
      <h3 className="font-sans">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex min-h-11 w-full flex-col items-center gap-3 py-5 text-center md:grid md:grid-cols-12 md:items-center md:gap-6 md:py-5 md:text-left"
        >
          <span className={`label tabular-nums transition-colors md:col-span-1 ${open ? 'text-terracotta' : 'text-ink-muted'}`}>
            0{index + 1}
          </span>
          <span className="flex flex-col items-center gap-1 md:col-span-6 md:flex-row md:items-baseline md:gap-4">
            <span className="font-display text-h3 transition-colors group-hover:text-terracotta">
              <Copy value={t.name} />
            </span>
            <span className="label text-[0.6875rem] text-ink-muted">
              <Copy value={t.role} tone="inherit" /> <span aria-hidden>·</span> <Copy value={t.company} tone="inherit" />
            </span>
          </span>
          <span
            aria-hidden
            className={`order-last flex size-11 items-center justify-center rounded-full border transition-[transform,border-color,color] duration-500 ease-(--ease-out-expo) md:col-span-1 md:justify-self-end ${
              open ? 'rotate-45 border-terracotta text-terracotta' : 'border-line'
            }`}
          >
            <Plus strokeWidth={1.5} className="size-4" />
          </span>
          <span className="flex items-baseline gap-3 md:col-span-4 md:justify-self-end">
            <span className="label text-[0.625rem] text-ink-muted">Result</span>
            <span className="font-display text-xl text-terracotta">
              <Copy value={t.result} tone="inherit" />
            </span>
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="overflow-hidden"
          >
            <figure className="grid justify-items-center pb-8 text-center md:grid-cols-12 md:justify-items-stretch md:gap-6 md:pb-10 md:text-left">
              <span aria-hidden className="font-display text-[clamp(3.5rem,2.5rem+3.5vw,6rem)] leading-[0.6] text-terracotta md:col-span-1 md:col-start-2">
                &ldquo;
              </span>
              <blockquote className="mt-2 font-display text-quote tracking-[-0.02em] md:col-span-9 md:mt-0">
                <Copy value={t.quote} />
              </blockquote>
            </figure>
          </m.div>
        )}
      </AnimatePresence>
    </li>
  )
}
