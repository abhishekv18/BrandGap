import { AnimatePresence, LazyMotion, MotionConfig } from 'framer-motion'
import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import { CookieConsent } from './components/CookieConsent'
import { CustomCursor } from './components/CustomCursor'
import { ExitIntent } from './components/ExitIntent'
import { IntroLoader } from './components/IntroLoader'
import { Navbar } from './components/Navbar'
import { PageShell } from './components/PageShell'
import { SmoothScroll, useSmoothScroll } from './components/SmoothScroll'
import { WhatsAppButton } from './components/WhatsAppButton'
import { useCapabilities } from './hooks/useCapabilities'
import Home from './pages/Home'
import { Footer } from './sections/Footer'
import { captureUtm } from './utils/analytics'

// The homepage ships in the main bundle (it is the LCP); every other page is its own chunk.
const pages = {
  WorkIndex: () => import('./pages/WorkIndex'),
  CaseStudy: () => import('./pages/CaseStudy'),
  ServicesPage: () => import('./pages/ServicesPage'),
  AboutPage: () => import('./pages/AboutPage'),
  Insights: () => import('./pages/Insights'),
  Article: () => import('./pages/Article'),
  GapScore: () => import('./pages/GapScore'),
  FreeAudit: () => import('./pages/FreeAudit'),
  ContactPage: () => import('./pages/ContactPage'),
  Faq: () => import('./pages/Faq'),
  Legal: () => import('./pages/Legal'),
  NotFound: () => import('./pages/NotFound'),
}
const WorkIndex = lazy(pages.WorkIndex)
const CaseStudy = lazy(pages.CaseStudy)
const ServicesPage = lazy(pages.ServicesPage)
const AboutPage = lazy(pages.AboutPage)
const Insights = lazy(pages.Insights)
const Article = lazy(pages.Article)
const GapScore = lazy(pages.GapScore)
const FreeAudit = lazy(pages.FreeAudit)
const ContactPage = lazy(pages.ContactPage)
const Faq = lazy(pages.Faq)
const Legal = lazy(pages.Legal)
const NotFound = lazy(pages.NotFound)

const loadMotionFeatures = () => import('./utils/motionFeatures').then((mod) => mod.default)

/** Holds the page's height while a page chunk loads, under the curtain. */
const PageFallback = () => <div className="min-h-svh" />

function AppRoutes() {
  const location = useLocation()
  return (
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/work" element={<WorkIndex />} />
      <Route path="/work/:slug" element={<CaseStudy />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/about" element={<AboutPage />} />
     {/* <Route path="/insights" element={<Insights />} />
      <Route path="/insights/:slug" element={<Article />} />
      <Route path="/gap-score" element={<GapScore />} />
      <Route path="/free-audit" element={<FreeAudit />} /> */}
      <Route path="/contact" element={<ContactPage />} />
      {/* <Route path="/faq" element={<Faq />} />
      <Route path="/privacy" element={<Legal kind="privacy" />} />
      <Route path="/terms" element={<Legal kind="terms" />} />
      <Route path="*" element={<NotFound />} /> */}
    </Routes>
  )
}

/** Pages swap under the transition curtain; the shell is keyed by path, not hash. */
function Pages() {
  const location = useLocation()
  // Under the closed curtain: jump to the top before the next page mounts.
  const { reset } = useSmoothScroll()
  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={reset}>
      <PageShell key={location.pathname}>
        <Suspense fallback={<PageFallback />}>
          <AppRoutes />
        </Suspense>
      </PageShell>
    </AnimatePresence>
  )
}

function Shell() {
  const { tier, reducedMotion, finePointer } = useCapabilities()
  const desktop = tier === 'desktop'

  useEffect(() => {
    captureUtm()
    // Warm the other pages once the homepage has settled, so route changes feel instant.
    const warm = () => Object.values(pages).forEach((load) => load())
    const id = 'requestIdleCallback' in window ? requestIdleCallback(warm, { timeout: 4000 }) : setTimeout(warm, 3000)
    return () => ('cancelIdleCallback' in window ? cancelIdleCallback(id) : clearTimeout(id))
  }, [])

  return (
    <SmoothScroll enabled={desktop && !reducedMotion}>
      <IntroLoader enabled={!reducedMotion} />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      {desktop && finePointer && <CustomCursor />}
      <Pages />
      <Footer />
      <WhatsAppButton />
      {/* {desktop && finePointer && <ExitIntent />} */}
       {desktop && finePointer}
      <CookieConsent />
    </SmoothScroll>
  )
}

export default function App() {
  const { reducedMotion } = useCapabilities()
  return (
    <BrowserRouter>
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
          <Shell />
        </MotionConfig>
      </LazyMotion>
    </BrowserRouter>
  )
}
