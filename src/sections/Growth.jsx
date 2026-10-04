import { Fragment, useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { GROWTH_INPUTS, GROWTH_OUTPUT, GROWTH_PROVES, GROWTH_TITLE } from '../data/growth'
import { useCapabilities } from '../hooks/useCapabilities'

const PANEL = 'w-[var(--pw)] h-[calc(var(--pw)*1.3)]'
const PANEL_SIZE = { '--pw': 'clamp(7.75rem, 5rem + 9vw, 14rem)' }
// Tablets: four cards across the container width (the row spans 4.6 card widths at 1.2 spacing).
const PANEL_TABLET = '[--pw:clamp(7.75rem,5rem+9vw,14rem)] md:[--pw:min(15rem,calc((100vw_-_4rem)/4.6))] desk:[--pw:clamp(7.75rem,5rem+9vw,14rem)]'
const DESK = '(min-width: 1024px) and (orientation: landscape), (min-width: 1280px)'

/** Scattered starting poses, as fractions of the viewport (x, y) plus depth and rotation. */
const SCATTER = [
  { x: -0.34, y: -0.15, z: -260, rx: 20, ry: -32, rz: -8 },
  { x: -0.12, y: 0.24, z: 160, rx: -16, ry: 24, rz: 5 },
  { x: 0.14, y: -0.19, z: -90, rx: 24, ry: 18, rz: 9 },
  { x: 0.34, y: 0.19, z: 80, rx: -12, ry: -26, rz: -6 },
]

/**
 * Chapter VI — The growth system (brief §4, section 06).
 * Strategy, Creative, Media and Optimization drift in space, turn to face
 * you, align into one flow, then merge into one: growth. "One team. One
 * growth system." lands with the gap at zero; the dashboard follows.
 */
export function Growth() {
  const { reducedMotion } = useCapabilities()
  return reducedMotion ? <GrowthStatic /> : <GrowthScroll />
}

function Panel({ label, index, className = '', ...rest }) {
  return (
    <div
      className={`flex flex-col justify-between border border-line bg-cream p-3 md:p-5 ${PANEL} ${className}`}
      {...rest}
    >
      <span data-word className="label text-[0.6875rem] text-ink-muted">0{index + 1}</span>
      <span data-word className="font-display text-[clamp(0.9375rem,0.45rem+1.1vw,1.875rem)] leading-none">{label}</span>
    </div>
  )
}

function Promise({ className = '' }) {
  return (
    <h2 id="growth-title" className={`mx-auto max-w-[18ch] text-center text-h2 ${className}`}>
      {GROWTH_TITLE.lead} <span className="italic text-terracotta">{GROWTH_TITLE.emphasis}</span>
    </h2>
  )
}

function GapClosed() {
  return (
    <div className="flex flex-col items-center gap-3">
      <span aria-hidden className="relative block h-px w-[min(40vw,420px)] bg-line">
        <span className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terracotta" />
      </span>
      <span className="flex items-baseline gap-2">
        <span className="label text-[0.6875rem] text-ink-muted">The gap</span>
        <span className="font-display text-lg tabular-nums text-terracotta">00</span>
      </span>
    </div>
  )
}

function GrowthScroll() {
  const section = useRef(null)
  const stage = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(stage)
      const panels = q('[data-input]')
      const pluses = q('[data-plus]')
      const output = q('[data-output]')[0]
      const wide = () => window.matchMedia('(min-width: 768px)').matches
      const pw = () => panels[0].offsetWidth
      const ph = () => panels[0].offsetHeight

      // Aligned: a row on wide screens, a 2×2 grid on phones.
      const aligned = (i) => {
        // Desktop spacing 1.38 card widths; tablets 1.2 so the row fills the container.
        if (wide()) return { x: (i - 1.5) * pw() * (window.matchMedia(DESK).matches ? 1.38 : 1.2), y: 0 }
        const col = i % 2
        const row = Math.floor(i / 2)
        return { x: (col - 0.5) * pw() * 1.16, y: (row - 0.5) * ph() * 1.12 }
      }
      const scatter = (i, key) => {
        const s = SCATTER[i]
        if (key === 'x') return s.x * window.innerWidth * (wide() ? 1 : 0.62)
        if (key === 'y') return s.y * window.innerHeight * (wide() ? 1 : 1.25)
        return s[key]
      }

      panels.forEach((p, i) =>
        gsap.set(p, {
          x: () => scatter(i, 'x'),
          y: () => scatter(i, 'y'),
          z: SCATTER[i].z,
          rotateX: SCATTER[i].rx,
          rotateY: SCATTER[i].ry,
          rotateZ: SCATTER[i].rz,
        }),
      )
      pluses.forEach((p, i) => gsap.set(p, { x: () => (aligned(i).x + aligned(i + 1).x) / 2, autoAlpha: 0 }))
      gsap.set(output, { autoAlpha: 0, scale: 0.82 })
      gsap.set(q('[data-promise]'), { autoAlpha: 0, y: 40 })
      gsap.set(q('[data-proves]'), { autoAlpha: 0, y: 20 })
      gsap.set(q('[data-equation]'), { autoAlpha: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      })
      tl.set({}, {}, 1)

      // Cream → blush: the page warms as brand turns to growth.
      tl.fromTo(stage.current, { backgroundColor: '#F4E9E1' }, { backgroundColor: '#EFD6CC', duration: 0.1 }, 0)

      // Separate → rotate → align
      panels.forEach((p, i) => {
        tl.to(
          p,
          { x: () => aligned(i).x, y: () => aligned(i).y, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, duration: 0.3, ease: 'power2.inOut' },
          0.02 + i * 0.015,
        )
      })
      tl.to(pluses, { autoAlpha: 1, duration: 0.05, stagger: 0.015 }, 0.3)
      tl.to(q('[data-equation]'), { autoAlpha: 1, duration: 0.05 }, 0.32)

      // Merge
      tl.to(pluses, { autoAlpha: 0, duration: 0.04 }, 0.42)
      tl.to(q('[data-equation]'), { autoAlpha: 0, duration: 0.04 }, 0.44)
      panels.forEach((p, i) => {
        tl.to(p, { x: 0, y: 0, z: -i * 14, rotateZ: (i - 1.5) * 2.5, duration: 0.16, ease: 'power3.inOut' }, 0.43)
      })
      tl.to(q('[data-input] [data-word]'), { autoAlpha: 0, duration: 0.05 }, 0.45)
      tl.to(output, { autoAlpha: 1, scale: 1, duration: 0.07, ease: 'power2.out' }, 0.55)
      tl.to(panels, { autoAlpha: 0, duration: 0.03 }, 0.62)

      // The promise
      // Lift the Growth panel so it sits just above the promise, shrinking it if the screen is short.
      const promiseTop = () => q('[data-promise]')[0].offsetTop
      const labelBottom = () => {
        const label = stage.current.querySelector('p.label')
        return label.offsetTop + label.offsetHeight + 28
      }
      const lockScale = () => Math.min(0.78, (promiseTop() - 40 - labelBottom()) / ph())
      const lockY = () => promiseTop() - 40 - stage.current.clientHeight / 2 - (ph() * lockScale()) / 2
      tl.to(q('[data-group]'), { y: lockY, scale: lockScale, duration: 0.12, ease: 'power2.inOut' }, 0.66)
      tl.to(q('[data-promise]'), { autoAlpha: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.72)
      tl.to(q('[data-proves]'), { autoAlpha: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.84)
    }, stage)
    return () => ctx.revert()
  }, [])

  return (
    <section id="growth" ref={section} aria-labelledby="growth-title" className="relative h-[300svh] md:h-[270svh] desk:h-[360svh]">
      <div ref={stage} className={`sticky top-0 h-svh overflow-hidden ${PANEL_TABLET}`}>
        <SectionLabel numeral="VI" name="The growth system" className="container-page absolute inset-x-0 top-24 md:top-28 [&>span:first-child]:text-terracotta-deep" />

        <div data-group className="absolute inset-0 [perspective:1400px]">
          {GROWTH_INPUTS.map((input, i) => (
            <Panel
              key={input.id}
              data-input
              label={input.label}
              index={i}
              className="absolute top-[calc(50%_-_var(--pw)*0.65)] left-[calc(50%_-_var(--pw)/2)] will-change-transform"
            />
          ))}
          {GROWTH_INPUTS.slice(0, -1).map((_, i) => (
            <span
              key={i}
              data-plus
              aria-hidden
              className="absolute top-1/2 left-1/2 -mt-[0.5em] -ml-[0.5em] hidden font-display text-3xl leading-none text-terracotta md:block"
            >
              →
            </span>
          ))}
          <div
            data-output
            className={`absolute top-[calc(50%_-_var(--pw)*0.65)] left-[calc(50%_-_var(--pw)/2)] flex flex-col justify-between bg-terracotta p-4 text-cream md:p-5 ${PANEL}`}
          >
            <span className="label text-[0.6875rem] text-cream/80">=</span>
            <span className="font-display text-[clamp(1.5rem,1rem+1.8vw,2.75rem)] leading-none">{GROWTH_OUTPUT}</span>
          </div>
        </div>

        <p data-equation aria-hidden className="container-page absolute inset-x-0 bottom-[14%] text-center label text-ink-soft">
          {GROWTH_INPUTS.map((g) => g.label).join(' → ')} <span className="text-terracotta-deep">→ {GROWTH_OUTPUT}</span>
        </p>

        {/* Final composition: one column, so nothing can collide at any height */}
        <div
          data-promise
          className="container-page absolute inset-x-0 bottom-[20svh] flex flex-col items-center gap-6 md:bottom-[22svh] md:gap-8 desk:bottom-[max(1.5rem,5svh)]"
        >
          <Promise />
          <GapClosed />
          <p data-proves className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 pt-2">
            <span className="label text-[0.6875rem] text-ink-muted">What it proves</span>
            <span className="font-display text-xl italic">{GROWTH_PROVES}</span>
          </p>
        </div>
      </div>
    </section>
  )
}

/** Reduced motion: the equation, set still. */
function GrowthStatic() {
  return (
    <section id="growth" aria-labelledby="growth-title" className="bg-blush section-y" style={PANEL_SIZE}>
      <div className="container-page">
        <SectionLabel numeral="VI" name="The growth system" className="[&>span:first-child]:text-terracotta-deep" />
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 md:mt-16 md:gap-6">
          {GROWTH_INPUTS.map((input, i) => (
            <Fragment key={input.id}>
              <Panel label={input.label} index={i} />
              {i < GROWTH_INPUTS.length - 1 && (
                <span aria-hidden className="font-display text-3xl text-terracotta">→</span>
              )}
            </Fragment>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <div className={`flex flex-col justify-between bg-terracotta p-5 text-cream ${PANEL}`}>
            <span className="label text-[0.6875rem] text-cream/80">=</span>
            <span className="font-display text-[clamp(1.5rem,1rem+1.8vw,2.75rem)] leading-none">{GROWTH_OUTPUT}</span>
          </div>
        </div>
        <Reveal className="mt-14 flex flex-col items-center gap-8 md:mt-16">
          <Promise />
          <GapClosed />
        </Reveal>
        <p className="mt-12 flex flex-wrap items-baseline justify-center gap-x-4">
          <span className="label text-[0.6875rem] text-ink-muted">What it proves</span>
          <span className="font-display text-xl italic">{GROWTH_PROVES}</span>
        </p>
      </div>
    </section>
  )
}
