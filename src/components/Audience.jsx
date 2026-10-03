import { AUDIENCE } from '../data/about'
import { Copy } from './Copy'
import { Reveal } from './Reveal'

/** "Who we are for / not for" (brief §7) — a short qualifier, set as two columns. */
export function Audience({ heading: H = 'h3', className = '' }) {
  return (
    <div className={`grid gap-8 border-t border-line pt-7 text-center sm:grid-cols-2 md:gap-6 md:pt-8 md:text-left ${className}`}>
      <Reveal>
        <H className="label text-terracotta">Who we work with</H>
        <ul className="mt-4 flex flex-col gap-1 font-display text-h3">
          {AUDIENCE.for.map((item) => (
            <li key={item}>
              <Copy value={item} />
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-ink-soft">
          From a minimum monthly ad spend of <Copy value={AUDIENCE.minimumSpend} />
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <H className="label text-ink-muted">Who we are not for</H>
        <ul className="mt-4 flex flex-col gap-1 font-display text-h3 text-ink-soft">
          {AUDIENCE.notFor.map((item, i) => (
            <li key={i}>
              <Copy value={item} />
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  )
}
