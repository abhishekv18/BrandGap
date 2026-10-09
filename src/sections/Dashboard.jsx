import { MetricsPanel } from '../components/MetricsPanel'
import { MaskReveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { NUMBERS } from '../data/growth'
import { numeralOf } from '../data/navigation'

/**
 * Chapter VI — The numbers behind the work (Content Brief §06), set in the
 * site's dark numbers panel (shared with every case study). The figures and
 * the disclaimer are exactly as supplied; the disclaimer is always visible.
 */
export function Dashboard() {
  return (
    <section id="numbers" aria-labelledby="numbers-title" data-grain className="container-page section-y text-center md:text-left">
      <SectionLabel numeral={numeralOf('numbers')} name="The numbers" />
      <h2 id="numbers-title" className="mt-5 text-h2 md:mt-7">
        <MaskReveal>{NUMBERS.lead}</MaskReveal>
        <MaskReveal delay={0.08} className="italic text-terracotta">
          {NUMBERS.emphasis}
        </MaskReveal>
      </h2>

      <MetricsPanel
        className="space-heading-content"
        title={NUMBERS.panelTitle}
        kpis={NUMBERS.kpis}
        graph={NUMBERS.graph}
        caption={NUMBERS.disclaimer}
        summary="Vibha Designs: ₹12.24L+ ad spend, ₹41.68L+ purchase value, 3.41X ROAS. With The Decorshed added: ₹50L+ ad spend, ₹1.68Cr+ purchase value, 3.4X blended ROAS."
      />
    </section>
  )
}
