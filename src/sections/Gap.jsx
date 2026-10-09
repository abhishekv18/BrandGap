import { useLayoutEffect, useRef } from 'react'
import { easeInOutCubic, gsap, range } from '../animations/gsap'
import { Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { GapFigure, GapStrip } from '../components/illustrations/GapFigure'
import { GAP_BETWEEN, GAP_PAIRS, GAP_STATEMENT } from '../data/gap'
import { useCapabilities } from '../hooks/useCapabilities'
import { numeralOf } from '../data/navigation'

// Sized so the longest word always fits: stacked below 1024px, side by side above.
const WORD =
  'inline-block font-display leading-[0.95] tracking-[-0.03em] whitespace-nowrap text-[clamp(2.25rem,10vw,5rem)] desk:text-[clamp(2.75rem,0.5rem+5vw,6.5rem)]'

/** The statement, set once and shared by the scroll and still versions. */
function Statement({ className = '' }) {
  return (
    <h2 id="gap-title" className={`mx-auto max-w-[22ch] text-h2 desk:mx-0 ${className}`}>
      {GAP_STATEMENT.lead} <span className="italic text-terracotta">{GAP_STATEMENT.emphasis}</span>
    </h2>
  )
}

/** The four gaps every brand recognises, set as a quiet list under the statement. */
function Between({ className = '' }) {
  return (
    <ul className={`mx-auto flex max-w-xl flex-col gap-2 text-ink-soft desk:mx-0 desk:gap-1.5 ${className}`}>
      {GAP_BETWEEN.map((line) => (
        <li key={line} className="flex items-baseline justify-center gap-3 desk:justify-start">
          <span aria-hidden className="hidden h-px w-3 shrink-0 -translate-y-1 bg-terracotta desk:block" />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  )
}

/** BRAND ← THE GAP → GROWTH (brief §4), drawn as a measured hairline. */
function GapDiagram({ className = '' }) {
  return (
    <p className={`label flex items-center justify-center gap-3 text-ink-muted desk:justify-start ${className}`}>
      <span className="text-terracotta">Brand</span>
      <span aria-hidden className="relative block h-px w-10 bg-terracotta/60 md:w-16">
        <span className="absolute top-1/2 left-0 size-1.5 -translate-y-1/2 rotate-45 border-b border-l border-terracotta" />
      </span>
      <span>The gap</span>
      <span aria-hidden className="relative block h-px w-10 bg-ink/40 md:w-16">
        <span className="absolute top-1/2 right-0 size-1.5 -translate-y-1/2 rotate-45 border-t border-r border-ink" />
      </span>
      <span className="text-ink">Growth</span>
    </p>
  )
}

// Timeline layout (0–1 across the pinned section)
const STATEMENT_OUT = 0.1
const FIRST = 0.15
const STEP = (1 - FIRST - 0.06) / GAP_PAIRS.length
const CLOSE = STEP * 0.62

/**
 * Chapter II — The gap.
 * The hero's gap, generalised: each pair starts apart across a measured
 * hairline and closes as you scroll, ending on brand → growth.
 */
export function Gap() {
  const { reducedMotion } = useCapabilities()
  return reducedMotion ? <GapStatic /> : <GapScroll />
}

function GapScroll() {
  const section = useRef(null)
  const stage = useRef(null)
  const counter = useRef(null)

  useLayoutEffect(() => {
    // Rebuilt whenever the layout switches between stacked and side-by-side.
    const mm = gsap.matchMedia()
    mm.add(
      {
        wide: '(min-width: 1024px) and (orientation: landscape), (min-width: 1280px)',
        narrow: '(max-width: 1023.98px), (max-width: 1279.98px) and (orientation: portrait)',
      },
      ({ conditions }) => {
        const wide = conditions.wide
        const q = gsap.utils.selector(stage)
        const axis = wide ? 'x' : 'y'
        const lineScale = wide ? 'scaleX' : 'scaleY'
        const pairs = q('[data-pair]')
        const readouts = q('[data-readout]')
        // Distance each word travels — capped so both words start fully on screen.
        // The hairline is sized to match, so it always spans exactly the gap.
        const spread = (pair) => {
          const area = pair.querySelector('[data-area]')
          const from = pair.querySelector('[data-from]')
          const to = pair.querySelector('[data-to]')
          if (wide) {
            const room = area.clientWidth / 2 - 24 - Math.max(from.offsetWidth, to.offsetWidth)
            return Math.max(24, Math.min(area.clientWidth * 0.24, room))
          }
          const room = area.clientHeight / 2 - 28 - Math.max(from.offsetHeight, to.offsetHeight)
          return Math.max(16, Math.min(area.clientHeight * 0.3, room))
        }
        const lineBox = (pair) => {
          const area = pair.querySelector('[data-area]')
          const d = spread(pair)
          return wide
            ? { left: area.clientWidth / 2 - d, width: d * 2 }
            : { top: area.clientHeight / 2 - d, height: d * 2 }
        }

        gsap.set(pairs, { autoAlpha: 0 })
        gsap.set(q('[data-dot]'), { scale: 0 })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: ({ progress: p }) => {
              const i = Math.min(GAP_PAIRS.length - 1, Math.max(0, Math.floor((p - FIRST) / STEP)))
              if (counter.current) counter.current.textContent = `0${i + 1}`
              const s = FIRST + i * STEP
              const closed = easeInOutCubic(range(p, s, s + CLOSE))
              const el = readouts[i]
              if (el) el.textContent = String(Math.round(100 * (1 - closed))).padStart(2, '0')
            },
          },
        })
        tl.set({}, {}, 1)

        // The measured drawing beside the statement: lines draw, callouts follow,
        // and brand and growth lean a little closer — before the pairs take over.
        const fig = q('[data-gap-figure]')
        tl.fromTo(fig.flatMap((f) => [...f.querySelectorAll('[data-draw], [data-dim]')]), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.05 }, 0)
        tl.fromTo(fig.flatMap((f) => [...f.querySelectorAll('[data-callout]')]), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02, stagger: 0.008 }, 0.025)
        tl.fromTo(fig.flatMap((f) => [...f.querySelectorAll('[data-obj="brand"]')]), { x: 0 }, { x: 12, duration: 0.06 }, 0.04)
        tl.fromTo(fig.flatMap((f) => [...f.querySelectorAll('[data-obj="growth"]')]), { x: 0 }, { x: -12, duration: 0.06 }, 0.04)
        tl.to(q('[data-statement]'), { autoAlpha: 0, y: -60, duration: 0.08, ease: 'power2.in' }, STATEMENT_OUT)
        tl.fromTo(q('[data-counter]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, FIRST)

        pairs.forEach((pair, i) => {
          const s = FIRST + i * STEP
          const last = i === pairs.length - 1
          tl.to(pair, { autoAlpha: 1, duration: 0.025 }, s)
          tl.fromTo(pair.querySelector('[data-from]'), { [axis]: () => -spread(pair) }, { [axis]: 0, duration: CLOSE, ease: 'power2.inOut' }, s)
          tl.fromTo(pair.querySelector('[data-to]'), { [axis]: () => spread(pair) }, { [axis]: 0, duration: CLOSE, ease: 'power2.inOut' }, s)
          const line = pair.querySelector('[data-line]')
          tl.set(line, wide ? { left: () => lineBox(pair).left, width: () => lineBox(pair).width } : { top: () => lineBox(pair).top, height: () => lineBox(pair).height }, s)
          tl.fromTo(line, { [lineScale]: 1 }, { [lineScale]: 0, duration: CLOSE, ease: 'power2.inOut' }, s)
          tl.to(pair.querySelector('[data-dot]'), { scale: 1, duration: 0.03, ease: 'back.out(3)' }, s + CLOSE - 0.01)
          // Side by side, the joined pair settles centred as one word, whatever the two lengths.
          if (wide) {
            const area = pair.querySelector('[data-area]')
            const from = pair.querySelector('[data-from]')
            const to = pair.querySelector('[data-to]')
            tl.fromTo(area, { x: 0 }, { x: () => (from.offsetWidth - to.offsetWidth) / 2, duration: CLOSE, ease: 'power2.inOut' }, s)
          }
          if (!last) tl.to(pair, { autoAlpha: 0, duration: 0.025 }, s + STEP - 0.03)
        })
      },
      stage,
    )
    return () => mm.revert()
  }, [])

  return (
    <section id="gap" ref={section} aria-labelledby="gap-title" className="relative h-[300svh] md:h-[310svh] desk:h-[400svh]">
      <div ref={stage} className="sticky top-0 h-svh overflow-hidden">
        <SectionLabel numeral={numeralOf('gap')} name="The gap" className="container-page absolute inset-x-0 top-20 md:top-28 md:!justify-center desk:!justify-start" />

        {/* Opening statement */}
        <div data-statement className="container-page absolute inset-0 flex flex-col justify-start pt-32 text-center md:pt-48 desk:justify-center desk:pt-0 desk:text-left">
          <Statement />
          <GapDiagram className="mt-6 md:mt-8" />
          <Between className="mt-6 text-sm md:mt-8 md:text-base" />
          {/* Tablet: the drawing as a short strip under the list (tall enough screens only) */}
          <div data-gap-figure className="mx-auto mt-8 hidden w-full max-w-xl [@media(min-width:768px)_and_(min-height:820px)]:block desk:!hidden">
            <GapStrip className="h-auto w-full" />
          </div>
          {/* Desktop: the measured drawing beside the statement */}
          <div data-gap-figure className="pointer-events-none absolute top-1/2 right-[var(--gap-fig-inset)] hidden w-[min(40%,34rem)] -translate-y-1/2 [--gap-fig-inset:1.25rem] md:[--gap-fig-inset:2rem] xl:[--gap-fig-inset:3rem] desk:block">
            <GapFigure className="h-auto w-full" />
          </div>
        </div>


        {/* The pairs. Layout lives on wrappers; GSAP only moves the inner words,
            so centring never fights the animation. Visual only — the list below
            carries the same content for assistive tech. */}
        {GAP_PAIRS.map((pair, i) => (
          <div key={pair.from} data-pair aria-hidden className="absolute inset-0 flex flex-col justify-center pt-24 pb-10 desk:justify-start desk:pt-40 desk:pb-16">
            <div data-area className="relative h-[46svh] min-h-0 flex-none md:h-[36svh] desk:h-auto desk:flex-1">
              <span
                data-line
                className="absolute top-[20%] left-[calc(50%-0.5px)] block h-[60%] w-px bg-terracotta/60 desk:top-[calc(50%-0.5px)] desk:left-[26%] desk:h-px desk:w-[48%]"
              />
              <span
                data-dot
                className="absolute top-[calc(50%-5px)] left-[calc(50%-5px)] block size-2.5 rounded-full bg-terracotta"
              />
              <div className="absolute inset-x-0 bottom-1/2 flex justify-center pb-5 desk:inset-y-0 desk:right-1/2 desk:bottom-0 desk:items-center desk:justify-end desk:pb-0">
                <span data-from className={`${WORD} text-terracotta desk:pr-[0.22em]`}>
                  {pair.from}
                </span>
              </div>
              <div className="absolute inset-x-0 top-1/2 flex justify-center pt-5 desk:inset-y-0 desk:top-0 desk:left-1/2 desk:items-center desk:justify-start desk:pt-0">
                <span data-to className={`${WORD} text-ink desk:pl-[0.22em]`}>
                  {pair.to}
                </span>
              </div>
            </div>

            <div className="container-page flex flex-col items-center gap-2 pt-6 text-center md:gap-3">
              <span className="flex items-baseline gap-2">
                <span className="label text-[0.6875rem] text-ink-muted">The gap</span>
                <span data-readout className="font-display text-lg tabular-nums text-terracotta">
                  100
                </span>
              </span>
              <p
                className="max-w-[26ch] font-display text-h3 italic text-ink-soft md:max-w-[34ch]"
              >
                {pair.note}
              </p>
            </div>
          </div>
        ))}

        <p data-counter aria-hidden className="container-page absolute inset-x-0 bottom-5 label text-center text-ink-muted opacity-0 md:text-left">
          <span ref={counter} className="text-terracotta">01</span> / 0{GAP_PAIRS.length}
        </p>

        <ul className="sr-only">
          {GAP_PAIRS.map((p) => (
            <li key={p.from}>
              {p.from} {p.to}: {p.note}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Reduced motion: the same story, set as a still editorial list. */
function GapStatic() {
  return (
    <section id="gap" aria-labelledby="gap-title" className="container-page section-y text-center md:text-left">
      <SectionLabel numeral={numeralOf('gap')} name="The gap" />
      <div className="desk:grid desk:grid-cols-12 desk:items-center desk:gap-8">
        <div className="desk:col-span-7">
          <Statement className="mt-8 md:mt-10" />
          <GapDiagram className="mt-8" />
          <Between className="mt-6" />
        </div>
        <GapFigure className="hidden h-auto w-full desk:col-span-5 desk:block" />
      </div>
      <GapStrip className="mx-auto mt-10 hidden h-auto w-full max-w-xl md:block desk:hidden" />
      <ul className="mt-14 border-t border-line md:mt-16">
        {GAP_PAIRS.map((p) => (
          <Reveal as="li" key={p.from} className="grid gap-3 border-b border-line py-8 md:grid-cols-12 md:items-baseline">
            <span className="font-display text-h2 md:col-span-7">
              <span className="text-terracotta">{p.from}</span>
              <span aria-hidden className="mx-[0.3em] inline-block size-2 -translate-y-[0.3em] rounded-full bg-terracotta" />
              {p.to}
            </span>
            <span className="font-display text-xl italic text-ink-soft md:col-span-5">{p.note}</span>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
