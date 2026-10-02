import { LazyMotion, MotionConfig } from 'framer-motion'
import { CustomCursor } from './components/CustomCursor'
import { IntroLoader } from './components/IntroLoader'
import { Marquee } from './components/Marquee'
import { GapRail } from './components/GapRail'
import { Navbar } from './components/Navbar'
import { SmoothScroll } from './components/SmoothScroll'
import { SERVICES, SERVICES_CENTER } from './data/services'
import { useCapabilities } from './hooks/useCapabilities'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'
import { Gap } from './sections/Gap'
import { Growth } from './sections/Growth'
import { Hero } from './sections/Hero'
import { Metrics } from './sections/Metrics'
import { Services } from './sections/Services'
import { Testimonials } from './sections/Testimonials'
import { Work } from './sections/Work'

// The band between Services and Work: the centre of the system, then each service.
const MARQUEE_WORDS = [SERVICES_CENTER, ...SERVICES.map((s) => s.name)]

const loadMotionFeatures = () => import('./utils/motionFeatures').then((mod) => mod.default)

export default function App() {
  const { tier, reducedMotion, finePointer } = useCapabilities()
  const desktop = tier === 'desktop'

  return (
    <LazyMotion features={loadMotionFeatures} strict>
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
      <SmoothScroll enabled={desktop && !reducedMotion}>
        <IntroLoader enabled={!reducedMotion} />
        <a href="#main" className="skip-link">Skip to content</a>
        <Navbar />
        {desktop && finePointer && <CustomCursor />}
        {desktop && <GapRail />}
        <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
          <Hero />
          <Gap />
          <Services />
          {/* <Marquee words={MARQUEE_WORDS} />
          <Work />
          <Growth />
          <Metrics />
          <About />
          <Testimonials />
          <Contact />   */}
        </main>
        {/* <Footer /> */}
      </SmoothScroll>
    </MotionConfig>
    </LazyMotion>
  )
}




