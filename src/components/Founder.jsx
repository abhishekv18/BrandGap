import { FOUNDER } from '../data/about'
import { Copy } from './Copy'
import { ProjectPlate } from './ProjectPlate'
import { Reveal } from './Reveal'

/**
 * "Meet the strategist" (brief §7): photo, two-line point of view, the
 * fractional CMO angle. Placeholders until BrandGap supplies the details.
 */
export function Founder({ heading: H = 'h3', className = '' }) {
  return (
    <div className={`grid items-end gap-8 text-center md:grid-cols-12 md:gap-6 md:text-left ${className}`}>
      <Reveal className="mx-auto w-1/2 max-w-[14rem] md:col-span-3 md:mx-0 md:w-full md:max-w-none">
        <ProjectPlate
          project={{ image: FOUNDER.photo, tone: 'blush' }}
          ratio="4 / 5"
          letter="g"
          crop="left"
          label="[Founder Photo]"
          cursor={undefined}
        />
      </Reveal>
      <Reveal delay={0.1} className="md:col-span-8 md:col-start-5 md:pb-2">
        <p className="label text-ink-muted">
          Meet the strategist <span className="text-terracotta">—</span> {FOUNDER.role}
        </p>
        <blockquote className="mt-4 font-display text-quote italic">
          <Copy value={FOUNDER.pointOfView} />
        </blockquote>
        <H className="mt-5 font-display text-h3">
          <Copy value={FOUNDER.name} />
        </H>
      </Reveal>
    </div>
  )
}
