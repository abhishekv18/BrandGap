import { GapRail } from '../components/GapRail'
import { Marquee } from '../components/Marquee'
import { MARQUEE_WORDS } from '../data/services'
import { SITE } from '../data/site'
import { useCapabilities } from '../hooks/useCapabilities'
import { useSeo } from '../hooks/useSeo'
import { About } from '../sections/About'
import { Approach } from '../sections/Approach'
import { Clients } from '../sections/Clients'
import { Dashboard } from '../sections/Dashboard'
import { FinalCta } from '../sections/FinalCta'
import { Gap } from '../sections/Gap'
import { Growth } from '../sections/Growth'
import { Hero } from '../sections/Hero'
import { Services } from '../sections/Services'
import { Work } from '../sections/Work'

/**
 * The homepage, in the order of the Website Development Brief §4:
 * 01 Hero · 02 The Gap · 03 What We Do · 04 Selected Work · 05 Our Approach ·
 * 06 The Growth System · 07 Clients & Testimonials · 08 About · 09 Final CTA ·
 * 10 Footer (in the app shell). Marquees run between sections, alternating.
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
      <Gap />
      <Services />
      <Marquee words={MARQUEE_WORDS} />
      <Work />
      <Approach />
      <Growth />
      <Dashboard />
      <Marquee words={MARQUEE_WORDS} reverse />
      <Clients />
      <About />
      <FinalCta />
    </>
  )
}
