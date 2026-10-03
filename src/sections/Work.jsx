import { AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../animations/gsap'
import { CaseCard } from '../components/CaseCard'
import { CaseDrawer } from '../components/CaseDrawer'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { PUBLISHED_PROJECTS, WORK_INTRO } from '../data/projects'
import { useCapabilities } from '../hooks/useCapabilities'
import { useHrefClick } from '../hooks/useHrefClick'
import { useMediaQuery } from '../hooks/useMediaQuery'

// Each card gets its own crop of the mark, so the rail never repeats itself.
const PLATES = [
  { letter: 'b', crop: 'right' },
  { letter: 'g', crop: 'left' },
  { letter: 'b', crop: 'left' },
  { letter: 'g', crop: 'right' },
]

/**
 * Chapter IV — Selected work (brief §4, section 04).
 * Desktop: the reader's scroll becomes a horizontal pass along the cases,
 * with a hairline counting progress. Elsewhere: a vertical stack.
 * Hover previews each case's flow; Expand opens it in a drawer.
 */
export function Work() {
  const { reducedMotion, tier } = useCapabilities()
  const root = useRef(null)
  const progress = useRef(null)
  const counter = useRef(null)
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  // The sideways rail needs a landscape canvas; tall portrait screens read the cases as a stack.
  const portrait = useMediaQuery('(orientation: portrait)')
  const horizontal = tier === 'desktop' && !reducedMotion && !portrait
  const projects = PUBLISHED_PROJECTS

  useLayoutEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      // Frames open from a mask while the image inside settles (stacked layout only).
      gsap.utils.toArray('[data-frame]').forEach((frame) => {
        const inner = frame.querySelector('[data-inner]')
        gsap.fromTo(
          frame,
          { clipPath: 'inset(10% 6% 10% 6%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top 92%', end: 'top 40%', scrub: 0.6 },
          },
        )
        if (inner) {
          gsap.fromTo(
            inner,
            { yPercent: -5, scale: 1.12 },
            {
              yPercent: 5,
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        }
      })

      if (!horizontal) return
      const strip = root.current.querySelector('[data-strip]')
      const track = strip?.querySelector('[data-track]')
      if (!strip || !track) return
      const cards = track.querySelectorAll('[data-card]')
      const distance = () => track.scrollWidth - window.innerWidth
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: strip,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: ({ progress: p }) => {
            if (progress.current) progress.current.style.transform = `scaleX(${p})`
            if (counter.current) {
              const i = Math.min(cards.length, Math.floor(p * cards.length) + 1)
              counter.current.textContent = String(i).padStart(2, '0')
            }
          },
        },
      })
    }, root)
    return () => ctx.revert()
  }, [reducedMotion, horizontal])

  return (
    <section id="work" ref={root} aria-labelledby="work-title" className="section-y">
      <header className="container-page grid gap-6 text-center md:grid-cols-12 md:gap-8 md:text-left">
        <div className="md:col-span-8">
          <SectionLabel numeral="IV" name="Selected work" />
          <h2 id="work-title" className="mt-5 text-h2 md:mt-7">
            <MaskReveal>{WORK_INTRO.title}</MaskReveal>
          </h2>
        </div>
        <Reveal as="p" delay={0.1} className="self-end font-display text-h3 italic text-ink-soft md:col-span-4">
          {WORK_INTRO.line}
        </Reveal>
      </header>

      {horizontal ? (
        <div data-strip className="relative mt-6 h-svh overflow-hidden">
          <div
            data-track
            className="flex h-full w-max items-center gap-[4vw] pt-16 pr-[8vw] pl-[max(3rem,calc((100vw_-_1440px)/2_+_3rem))]"
          >
            {projects.map((project, i) => (
              <div
                key={project.slug}
                data-card
                className={`w-[min(34vw,64svh)] shrink-0 ${i % 2 ? 'translate-y-[4svh]' : '-translate-y-[3svh]'}`}
              >
                <CaseCard project={project} onExpand={setOpen} {...PLATES[i % PLATES.length]} />
              </div>
            ))}
            <AllWorkCard count={projects.length} className="h-[min(56svh,32rem)] w-[min(22vw,40svh)]" />
          </div>

          {/* Progress along the rail */}
          <div aria-hidden className="container-page absolute inset-x-0 bottom-6 flex items-center gap-6 pr-24 xl:pr-28">
            <span className="label tabular-nums text-ink-muted">
              <span ref={counter} className="text-terracotta">01</span> / {String(projects.length).padStart(2, '0')}
            </span>
            <span className="relative h-px flex-1 bg-line">
              <span ref={progress} className="absolute inset-0 origin-left scale-x-0 bg-terracotta" />
            </span>
          </div>
        </div>
      ) : (
        <div className="container-page mt-10 grid gap-12 md:mt-12 md:grid-cols-2 md:gap-x-8 md:gap-y-14">
          {projects.map((project, i) => (
            <CaseCard
              key={project.slug}
              project={project}
              onExpand={setOpen}
              frame={!reducedMotion}
              className={i % 2 ? 'md:mt-16' : ''}
              {...PLATES[i % PLATES.length]}
            />
          ))}
          <AllWorkCard count={projects.length} className={`min-h-48 ${projects.length % 2 ? 'md:mt-16' : ''}`} />
        </div>
      )}

      <AnimatePresence>{open && <CaseDrawer key={open.slug} project={open} onClose={close} />}</AnimatePresence>
    </section>
  )
}

/** The rail ends on the way into the full index. */
function AllWorkCard({ count, className = '' }) {
  const hrefClick = useHrefClick()
  return (
    <a
      href="/work"
      onClick={(e) => hrefClick(e, '/work')}
      data-cursor="explore"
      className={`group flex shrink-0 flex-col justify-between border border-line p-6 transition-colors duration-500 hover:border-terracotta md:p-8 ${className}`}
    >
      <span className="label text-ink-muted">
        Index <span className="text-terracotta">—</span> {String(count).padStart(2, '0')} cases
      </span>
      <span className="mt-10 flex items-end justify-between gap-4">
        <span className="font-display text-h2 leading-none">
          All <span className="italic text-terracotta">work</span>
        </span>
        <ArrowRight
          aria-hidden
          strokeWidth={1.25}
          className="size-8 shrink-0 transition-transform duration-700 ease-(--ease-out-expo) group-hover:translate-x-2"
        />
      </span>
    </a>
  )
}
