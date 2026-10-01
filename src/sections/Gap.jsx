import { useLayoutEffect, useRef } from 'react'
import { easeInOutCubic, gsap, range } from '../animations/gsap'
import { Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { GAP_PAIRS, GAP_STATEMENT, GAP_STORY } from '../data/gap'
import { useCapabilities } from '../hooks/useCapabilities'

// Sized so the longest word always fits: stacked below 1024px, side by side above.
const WORD =
  'inline-block font-display leading-[0.95] tracking-[-0.03em] whitespace-nowrap text-[clamp(2.25rem,11vw,5rem)] lg:text-[clamp(3rem,0.5rem+6vw,8.5rem)]'

// Timeline layout (0–1 across the pinned section)
const STATEMENT_OUT = 0.12
const FIRST = 0.18
const STEP = (1 - FIRST - 0.06) / GAP_PAIRS.length
const CLOSE = STEP * 0.62

/**
 * Chapter II — Tension.
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
      { wide: '(min-width: 1024px)', narrow: '(max-width: 1023.98px)' },
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
          if (!last) tl.to(pair, { autoAlpha: 0, duration: 0.025 }, s + STEP - 0.03)
        })
      },
      stage,
    )
    return () => mm.revert()
  }, [])

  return (
    <section id="gap" ref={section} aria-labelledby="gap-title" className="relative h-[340svh] md:h-[420svh]">
      <div ref={stage} className="sticky top-0 h-svh overflow-hidden">
        <SectionLabel numeral="II" name="Tension" className="container-page absolute inset-x-0 top-20 md:top-28" />

        {/* Opening statement */}
        <div data-statement className="container-page absolute inset-0 flex flex-col justify-start pt-32 text-center md:pt-48 md:text-left lg:justify-center lg:pt-0">
          <h2 id="gap-title" className="mx-auto max-w-[12ch] text-display md:mx-0">
            {GAP_STATEMENT}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lead text-ink-soft md:mt-12 md:ml-[42%]">{GAP_STORY}</p>
        </div>

        {/* The pairs. Layout lives on wrappers; GSAP only moves the inner words,
            so centring never fights the animation. Visual only — the list below
            carries the same content for assistive tech. */}
        {GAP_PAIRS.map((pair, i) => (
          <div key={pair.from} data-pair aria-hidden className="absolute inset-0 flex flex-col pt-36 pb-14 md:pt-40 md:pb-16">
            <div data-area className="relative min-h-0 flex-1">
              <span
                data-line
                className="absolute top-[20%] left-[calc(50%-0.5px)] block h-[60%] w-px bg-terracotta/60 lg:top-[calc(50%-0.5px)] lg:left-[26%] lg:h-px lg:w-[48%]"
              />
              <span
                data-dot
                className="absolute top-[calc(50%-5px)] left-[calc(50%-5px)] block size-2.5 rounded-full bg-terracotta"
              />
              <div className="absolute inset-x-0 bottom-1/2 flex justify-center pb-5 lg:inset-y-0 lg:right-1/2 lg:bottom-0 lg:items-center lg:justify-end lg:pb-0">
                <span data-from className={`${WORD} text-terracotta lg:pr-[0.22em]`}>
                  {pair.from}
                </span>
              </div>
              <div className="absolute inset-x-0 top-1/2 flex justify-center pt-5 lg:inset-y-0 lg:top-0 lg:left-1/2 lg:items-center lg:justify-start lg:pt-0">
                <span data-to className={`${WORD} text-ink lg:pl-[0.22em]`}>
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
                className={`max-w-[26ch] font-display text-h3 italic md:max-w-none ${
                  i === GAP_PAIRS.length - 1 ? 'text-ink' : 'text-ink-soft'
                }`}
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
              {p.from} to {p.to}: {p.note}
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
      <SectionLabel numeral="II" name="Tension" />
      <h2 id="gap-title" className="mx-auto mt-8 max-w-[12ch] text-display md:mx-0 md:mt-10">
        {GAP_STATEMENT}
      </h2>
      <p className="mx-auto mt-8 max-w-md text-lead text-ink-soft md:ml-[42%]">{GAP_STORY}</p>
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
