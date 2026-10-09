import { GapRail } from '../components/GapRail'
import { Ground } from '../components/Ground'
import { LogoStrip } from '../components/LogoStrip'
import { Marquee } from '../components/Marquee'
import { MARQUEE_WORDS } from '../data/services'
import { SITE } from '../data/site'
import { useCapabilities } from '../hooks/useCapabilities'
import { useSeo } from '../hooks/useSeo'
import { About } from '../sections/About'
import { Approach } from '../sections/Approach'
import { Brands } from '../sections/Brands'
import { Capabilities } from '../sections/Capabilities'
import { Clients } from '../sections/Clients'
import { CreativePerformance } from '../sections/CreativePerformance'
import { Dashboard } from '../sections/Dashboard'
import { FinalCta } from '../sections/FinalCta'
import { Gap } from '../sections/Gap'
import { Growth } from '../sections/Growth'
import { Hero } from '../sections/Hero'
import { Performance } from '../sections/Performance'
import { Services } from '../sections/Services'
import { Work } from '../sections/Work'
import { Why } from '../sections/Why'

/**
 * The homepage: the approved flow, with the Website Content Brief's sections
 * woven in (chapter numerals live in data/navigation.js):
 * I Hero · II The Gap · III What We Do · IV The BrandGap Method ·
 * V Performance Marketing · VI The Numbers · VII Case Studies ·
 * VIII Selected Brands · IX Creative × Performance · X Growth System ·
 * XI Why BrandGap · XII About & Values · XIII Capabilities ·
 * XIV Clients · XV Final CTA · Footer (in the app shell).
 * Marquees run between chapters, alternating.
 */
export default function Home() {
  const { tier } = useCapabilities()
  useSeo({
    description: SITE.description,
    path: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.name,
      url: `${SITE.url}/`,
    },
  })

  return (
    <>
      {tier === 'desktop' && <GapRail />}
      <Hero />
      <LogoStrip />
      <Gap />
      <Services />
      <Marquee words={MARQUEE_WORDS} tone="ink" />
      <div className="relative isolate">
        <Ground tone="blush" />
        <Approach />
      </div>
      <Performance />
      <Dashboard />
      <Work />
      <Brands />
      <Marquee words={MARQUEE_WORDS} reverse tone="blush" />
      <CreativePerformance />
      <Growth />
      <Why />
      <div className="relative isolate">
        <Ground tone="blush" />
        <About />
      </div>
      <Capabilities />
      <Clients />
      <FinalCta />
    </>
  )
}
