import { AUDIENCE } from '../data/about'
import { Reveal } from './Reveal'

/**
 * Who we work with (Content Brief §11): "Built for ambitious brands", five
 * kinds of business. showTitle={false} when the page already gives it a heading.
 */
export function Audience({ heading: H = 'h3', showTitle = true, className = '' }) {
  return (
    <div className={`text-center md:text-left ${className}`}>
      {showTitle && (
        <Reveal>
          <p className="label text-terracotta">Who we work with</p>
          <H className="mt-3 font-display text-h3 tracking-[-0.02em]">
            {AUDIENCE.title.lead} <span className="italic text-terracotta">{AUDIENCE.title.emphasis}</span>
          </H>
        </Reveal>
      )}
      <ul className={`grid gap-x-6 sm:grid-cols-2 lg:grid-cols-5 ${showTitle ? 'mt-6' : ''}`}>
        {AUDIENCE.segments.map((segment, i) => (
          <Reveal as="li" key={segment.id} delay={i * 0.06} className="border-t border-line py-5">
            <p className="font-display text-xl tracking-[-0.02em]">{segment.name}</p>
            <p className="mt-2 text-sm text-ink-soft">{segment.text}</p>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}
