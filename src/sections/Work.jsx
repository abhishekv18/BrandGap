import { AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../animations/gsap'
import { CaseCard } from '../components/CaseCard'
import { CaseDrawer } from '../components/CaseDrawer'
import { Ground } from '../components/Ground'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { HOME_CASES, MORE_WORK, PUBLISHED_PROJECTS, WORK_INTRO } from '../data/projects'
import { useCapabilities } from '../hooks/useCapabilities'
import { useHrefClick } from '../hooks/useHrefClick'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { numeralOf } from '../data/navigation'

// Each card gets its own crop of the mark, so the rail never repeats itself.
// From this many cases the sideways rail has room to travel; fewer sit in a still row on large screens.
const RAIL_MIN = 3

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
  // The homepage shows the first three cases; the full set (and the count on the card) is on /portfolio.
  const projects = PUBLISHED_PROJECTS.slice(0, HOME_CASES)
  const landscapeDesktop = tier === 'desktop' && !portrait
  // With only a few cases the rail would barely move, so they sit in an editorial row instead.
  const horizontal = landscapeDesktop && !reducedMotion && projects.length >= RAIL_MIN
  const row = landscapeDesktop && !horizontal

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
    // On the homepage the work sits on blush: a warm change after the numbers' dark chart panel.
    <section id="work" ref={root} aria-labelledby="work-title" className="isolate section-y">
      <Ground tone="blush" />
      <header className="container-page grid gap-heading-row text-center md:text-left lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SectionLabel numeral={numeralOf('work')} name="Case studies" />
          <h2 id="work-title" className="mt-5 text-h2 md:mt-7">
            <MaskReveal>{WORK_INTRO.title}</MaskReveal>
            <MaskReveal delay={0.08} className="italic text-terracotta">
              {WORK_INTRO.emphasis}
            </MaskReveal>
          </h2>
        </div>
        {WORK_INTRO.line && (
          <Reveal as="p" delay={0.1} className="self-end font-display text-h3 italic text-ink-soft md:max-w-xl lg:col-span-4">
            {WORK_INTRO.line}
          </Reveal>
        )}
      </header>

      {horizontal ? (
        <div data-strip className="relative mt-6 h-svh overflow-hidden">
          <div
            data-track
            className="flex h-full w-max items-center gap-[4vw] pt-16 pb-20 pr-[8vw] pl-[max(3rem,calc((100vw_-_90rem)/2_+_3rem))]"
          >
            {projects.map((project, i) => (
              <div
                key={project.slug}
                data-card
                className={`w-[min(34vw,56svh)] shrink-0 ${i % 2 ? 'translate-y-[4svh]' : '-translate-y-[3svh]'}`}
              >
                <CaseCard project={project} onExpand={setOpen} {...PLATES[i % PLATES.length]} />
              </div>
            ))}
            <AllWorkCard count={PUBLISHED_PROJECTS.length} className="h-[min(56svh,32rem)] w-[min(22vw,40svh)]" />
          </div>

          {/* Progress along the rail */}
          <div aria-hidden className="container-page absolute inset-x-0 bottom-4 flex items-center gap-6 pr-24 xl:pr-28">
            <span className="label tabular-nums text-ink-muted">
              <span ref={counter} className="text-terracotta">01</span> / {String(projects.length).padStart(2, '0')}
            </span>
            <span className="relative h-px flex-1 bg-line">
              <span ref={progress} className="absolute inset-0 origin-left scale-x-0 bg-terracotta" />
            </span>
          </div>
        </div>
      ) : row ? (
        /* 1–3 cases: three equal columns; the "All portfolio" card fills the next free column,
           or becomes a full-width link once all three are cases. */
        <div className="container-page space-heading-content">
          <div className={`grid items-start gap-x-8 xl:gap-x-10 ${projects.length === 2 ? 'grid-cols-[1.18fr_1.18fr_0.64fr]' : 'grid-cols-3'}`}>
            {projects.map((project, i) => (
              <CaseCard
                key={project.slug}
                project={project}
                onExpand={setOpen}
                frame={!reducedMotion}
                className={i % 2 ? 'mt-16' : ''}
                {...PLATES[i % PLATES.length]}
              />
            ))}
            {projects.length < 3 && (
              <AllWorkCard
                count={projects.length}
                className={projects.length === 1 ? 'col-span-2 mt-16 min-h-72' : 'aspect-[4/3]'}
              />
            )}
          </div>
          {projects.length >= 3 && <AllWorkLink count={PUBLISHED_PROJECTS.length} className="mt-14" />}
        </div>
      ) : (
        <div className="container-page space-heading-content grid gap-12 md:grid-cols-2 md:gap-x-8 md:gap-y-14">
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
          <AllWorkCard count={PUBLISHED_PROJECTS.length} className={`min-h-48 ${projects.length % 2 ? 'md:mt-16' : ''}`} />
        </div>
      )}

      <MoreWork start={PUBLISHED_PROJECTS.length} />

      <AnimatePresence>{open && <CaseDrawer key={open.slug} project={open} onClose={close} />}</AnimatePresence>
    </section>
  )
}

/**
 * More work (Content Brief §07): the brands behind the rest of the work,
 * set as an editorial index — client, industry and what we did. No metrics
 * are published for these, so none are shown.
 */
export function MoreWork({ start, className = 'space-subblock' }) {
  return (
    <div className={`container-page text-center md:text-left ${className}`}>
      <p className="label text-ink-muted">
        More work <span className="text-terracotta">—</span> {String(MORE_WORK.length).padStart(2, '0')} brands
      </p>
      <ul className="mt-5 border-t border-line md:mt-6">
        {MORE_WORK.map((item, i) => (
          <Reveal
            as="li"
            key={item.id}
            delay={i * 0.05}
            className="group flex flex-col items-center gap-1.5 border-b border-line py-5 md:grid md:grid-cols-12 md:items-baseline md:gap-6"
          >
            <span className="label tabular-nums text-ink-muted transition-colors duration-500 group-hover:text-terracotta md:col-span-1">
              {String(start + i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-display text-h3 tracking-[-0.02em] transition-transform duration-700 ease-(--ease-out-expo) md:col-span-4 md:group-hover:translate-x-1">
              {item.client}
            </h3>
            <span className="label text-[0.6875rem] text-terracotta md:col-span-3">{item.industry}</span>
            <span className="text-sm text-ink-soft md:col-span-4">{item.services}</span>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}

/** The rail ends on the way into the full index. */
/** The full-width way into the index, for a full row of cases. */
function AllWorkLink({ count, className = '' }) {
  const hrefClick = useHrefClick()
  return (
    <a
      href="/portfolio"
      onClick={(e) => hrefClick(e, '/portfolio')}
      data-cursor="explore"
      className={`group flex items-center justify-between gap-6 border-y border-line py-6 transition-colors duration-500 hover:border-terracotta ${className}`}
    >
      <span className="label text-ink-muted">
        Index <span className="text-terracotta">—</span> {String(count).padStart(2, '0')} cases
      </span>
      <span className="flex items-center gap-5">
        <span className="font-display text-h3 leading-none">
          All <span className="italic text-terracotta">portfolio</span>
        </span>
        <ArrowRight
          aria-hidden
          strokeWidth={1.25}
          className="size-7 shrink-0 transition-transform duration-700 ease-(--ease-out-expo) group-hover:translate-x-2"
        />
      </span>
    </a>
  )
}

function AllWorkCard({ count, className = '' }) {
  const hrefClick = useHrefClick()
  return (
    <a
      href="/portfolio"
      onClick={(e) => hrefClick(e, '/portfolio')}
      data-cursor="explore"
      className={`group flex shrink-0 flex-col justify-between border border-line p-6 transition-colors duration-500 hover:border-terracotta md:p-8 ${className}`}
    >
      <span className="label text-ink-muted">
        Index <span className="text-terracotta">—</span> {String(count).padStart(2, '0')} cases
      </span>
      <span className="mt-10 flex flex-wrap items-end justify-between gap-x-4 gap-y-5">
        <span className="font-display text-h2 leading-none">
          All <span className="italic text-terracotta">portfolio</span>
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
