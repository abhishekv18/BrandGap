import { ComingSoon } from '../components/ComingSoon'
import { PageHero } from '../components/PageHero'
import { RoasCalculator } from '../components/RoasCalculator'
import { COMING_SOON, ROAS_CALCULATOR } from '../data/tools'
import { breadcrumbLd, useSeo } from '../hooks/useSeo'
import { FinalCta } from '../sections/FinalCta'

/*
 * LAUNCH SWITCH — the ROAS calculator is built (components/RoasCalculator.jsx)
 * but hidden until launch. While LAUNCHED is false the route shows a "Coming
 * soon" page. Set to true to go live, and add '/roas-calculator' to the
 * sitemap list in vite.config.js.
 */
const LAUNCHED = false

/** /roas-calculator — the growth calculator on its own page. */
export default function RoasCalculatorPage() {
  return LAUNCHED ? <RoasCalculatorLive /> : <ComingSoon page={COMING_SOON.roasCalculator} />
}

// eslint-disable-next-line no-unused-vars -- kept for launch, see LAUNCHED above
function RoasCalculatorLive() {
  const page = COMING_SOON.roasCalculator
  useSeo({
    title: 'ROAS calculator',
    description: page.intro,
    path: page.path,
    jsonLd: breadcrumbLd([{ name: page.name, path: page.path }]),
  })

  return (
    <>
      <PageHero crumbs={[{ name: page.name, path: page.path }]} lead={page.lead} emphasis={page.emphasis} intro={ROAS_CALCULATOR.note} />
      <section aria-label="Calculator" className="container-page pb-12 md:pb-16">
        <div className="bg-cream md:pl-8">
          <RoasCalculator />
        </div>
      </section>
      <FinalCta numeral={null} />
    </>
  )
}
