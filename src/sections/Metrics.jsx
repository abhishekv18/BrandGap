import { Copy } from '../components/Copy'
import { Metric } from '../components/Metric'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { METRICS, METRICS_INTRO } from '../data/metrics'

/**
 * Proof, in numbers. The promise from the guidelines — "accountable to a
 * number" — set as a quiet ledger. Figures live in data/metrics.js.
 */
export function Metrics() {
  const [lead, tail] = METRICS_INTRO.title.split('a number')
  return (
    <section id="metrics" aria-labelledby="metrics-title" className="container-page section-y text-center md:text-left">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <SectionLabel numeral="IV" name="In numbers" />
          <h2 id="metrics-title" className="mt-8 text-h2 md:mt-10">
            <MaskReveal>
              {lead}
              <span className="italic text-terracotta">a number</span>
              {tail}
            </MaskReveal>
          </h2>
        </div>
        <Reveal as="p" delay={0.1} className="text-sm md:col-span-4 md:self-end md:justify-self-end">
          <Copy value={METRICS_INTRO.note} />
        </Reveal>
      </div>

      <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-16 lg:grid-cols-4 lg:gap-x-8">
        {METRICS.map((m, i) => (
          <Metric
            key={m.id}
            label={m.label}
            value={m.value}
            placeholder={m.placeholder}
            suffix={m.suffix}
            delay={i * 0.08}
            className={i % 2 === 1 ? 'lg:mt-14' : ''}
          />
        ))}
      </dl>
    </section>
  )
}
