import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react'
import { easeInOutCubic, gsap, range } from '../animations/gsap'
import { JOIN_AT } from '../3d/constants'
import { BrandMark } from '../components/BrandMark'
import { MagneticButton } from '../components/MagneticButton'
import { MARK_B_D, MARK_COLORS, MARK_G_D, MARK_VIEWBOX } from '../data/mark'
import { HERO } from '../data/site'
import { useCapabilities } from '../hooks/useCapabilities'

// Brand guidelines p.14.
const HeroScene = lazy(() => import('../3d/Scene'))

const VB = `${MARK_VIEWBOX.x} ${MARK_VIEWBOX.y} ${MARK_VIEWBOX.w} ${MARK_VIEWBOX.h}`

// The split message: the display serif in italic, kept well below the letters' scale
// (phones ~18–22px, tablets ~24–32px, desktop ~28–40px).
const SPLIT =
  'block font-display italic leading-[1.12] tracking-[-0.015em] text-ink-soft text-[clamp(1.125rem,0.85rem+1.1vw,1.375rem)] md:text-[clamp(1.5rem,0.75rem+1.6vw,2rem)] desk:text-[clamp(1.75rem,0.9rem+1.35vw,2.5rem)]'

/**
 * Chapter I — Discovery.
 * The b and the g start apart. Scroll closes the gap until they lock into
 * the mark, which then settles beside the wordmark as the primary lockup.
 */
export function Hero() {
  const { tier, reducedMotion, webgl } = useCapabilities()
  const mode = reducedMotion ? 'static' : webgl ? '3d' : 'svg'

  const section = useRef(null)
  const stage = useRef(null)
  const canvasWrap = useRef(null)
  const flat = useRef(null)
  const bGroup = useRef(null)
  const gGroup = useRef(null)
  const markTarget = useRef(null)
  const gapLine = useRef(null)
  const gapReadout = useRef(null)

  const progress = useRef(0)
  const eyebrow = useRef(null)
  // Pixels from the top of the stage that the letters must stay below (the eyebrow line + a margin).
  const safeTop = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  const [sceneActive, setSceneActive] = useState(true)
  const [sceneReady, setSceneReady] = useState(false)

  // Keep the eyebrow line clear on short, wide screens.
  useLayoutEffect(() => {
    if (mode !== '3d') return
    const measure = () => {
      if (!eyebrow.current || !stage.current) return
      const e = eyebrow.current.getBoundingClientRect()
      const st = stage.current.getBoundingClientRect()
      safeTop.current = e.bottom - st.top + 24
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [mode])

  // Pointer, normalised to -1…1, for the letters' tilt.
  useLayoutEffect(() => {
    if (mode !== '3d') return
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [mode])

  useLayoutEffect(() => {
    if (mode === 'static') return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(stage)
      const stageEl = stage.current
      const flatEl = flat.current

      // The split message settles in once on arrival (its own wrapper, so the scroll tweens never fight it).
      gsap.fromTo(q('[data-split-intro]'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 1.2, delay: 0.5, stagger: 0.15, ease: 'power3.out' })

      // Initial (pre-scroll) state. Without JS the lockup simply shows.
      gsap.set(q('[data-hero-line]'), { yPercent: 110 })
      gsap.set(q('[data-hero-fade]'), { autoAlpha: 0, y: 24 })
      gsap.set(flatEl, { autoAlpha: mode === '3d' ? 0 : 1 })

      /** Letter separation for the SVG fallback, in the mark's own viewBox units. */
      const spread = () => {
        const w = stageEl.clientWidth
        const h = stageEl.clientHeight
        const portrait = h > w
        const px = { x: portrait ? w * 0.12 : Math.min(w * 0.2, 340), y: portrait ? h * 0.15 : h * 0.07 }
        const units = MARK_VIEWBOX.h / flatEl.offsetHeight
        return { x: px.x * units, y: px.y * units }
      }
      /** Offset from the mark's resting place to the lockup slot — independent of scroll state. */
      const toTarget = () => {
        const s = flatEl.getBoundingClientRect()
        const t = markTarget.current.getBoundingClientRect()
        const cx = Number(gsap.getProperty(flatEl, 'x'))
        const cy = Number(gsap.getProperty(flatEl, 'y'))
        return {
          x: t.left + t.width / 2 - (s.left + s.width / 2 - cx),
          y: t.top + t.height / 2 - (s.top + s.height / 2 - cy),
          scale: t.height / flatEl.offsetHeight,
        }
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress
            progress.current = p
            if (gapReadout.current) {
              gapReadout.current.textContent = String(
                Math.round(100 * (1 - easeInOutCubic(range(p, 0, JOIN_AT)))),
              ).padStart(2, '0')
            }
            const shouldRun = p < 0.76
            setSceneActive((prev) => (prev === shouldRun ? prev : shouldRun))
          },
        },
      })
      tl.set({}, {}, 1) // timeline spans exactly 0 → 1

      tl.to(q('[data-scroll-cue]'), { autoAlpha: 0, duration: 0.06 }, 0)
      // The split message leans toward the gap as it closes, and is gone well before the lockup's h1 (0.78).
      tl.to(q('[data-split="a"]'), { x: -24, y: 10, autoAlpha: 0, duration: 0.22, ease: 'power1.in' }, 0.04)
      tl.to(q('[data-split="b"]'), { x: 24, y: -10, autoAlpha: 0, duration: 0.22, ease: 'power1.in' }, 0.04)
      tl.to(q('[data-gap-ends]'), { autoAlpha: 0, duration: 0.08 }, 0.06)
      tl.to(gapLine.current, { scaleX: 0, duration: JOIN_AT, ease: 'power2.inOut' }, 0)
      tl.to(q('[data-gap-label]'), { autoAlpha: 0, duration: 0.1 }, 0.34)

      if (mode === 'svg') {
        tl.fromTo(
          bGroup.current,
          { x: () => -spread().x, y: () => -spread().y },
          { x: 0, y: 0, duration: JOIN_AT, ease: 'power2.inOut' },
          0,
        )
        tl.fromTo(
          gGroup.current,
          { x: () => spread().x, y: () => spread().y },
          { x: 0, y: 0, duration: JOIN_AT, ease: 'power2.inOut' },
          0,
        )
      } else {
        // The swap: the flat SVG fades in over the face-on 3D, then the canvas leaves.
        tl.to(flatEl, { autoAlpha: 1, duration: 0.04 }, JOIN_AT + 0.02)
        tl.to(canvasWrap.current, { autoAlpha: 0, duration: 0.04 }, JOIN_AT + 0.05)
      }

      // The joined mark settles into the lockup.
      tl.to(
        flatEl,
        {
          x: () => toTarget().x,
          y: () => toTarget().y,
          scale: () => toTarget().scale,
          duration: 0.16,
          ease: 'power3.inOut',
        },
        0.72,
      )
      tl.to(q('[data-eyebrow], [data-hero-frame]'), { autoAlpha: 0, duration: 0.06 }, 0.7)
      // The gap's terracotta haze warms as the letters close in, then settles as the mark locks.
      tl.fromTo(q('[data-hero-light]'), { '--haze': 0.07 }, { '--haze': 0.12, duration: JOIN_AT * 0.9, ease: 'power1.in' }, 0)
      tl.to(q('[data-hero-light]'), { '--haze': 0.05, duration: 0.14, ease: 'power2.out' }, 0.72)
      tl.to(q('[data-hero-line]'), { yPercent: 0, duration: 0.12, stagger: 0.03, ease: 'power3.out' }, 0.78)
      tl.to(
        q('[data-hero-fade]'),
        { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.025, ease: 'power2.out' },
        0.84,
      )
    }, stage)
    return () => ctx.revert()
  }, [mode])

  const isStatic = mode === 'static'

  return (
    <section
      id="top"
      ref={section}
      aria-label="Introduction"
      className={isStatic ? 'relative' : 'relative h-[240svh] md:h-[300svh]'}
    >
      <div
        ref={stage}
        className={`${isStatic ? 'relative min-h-svh' : 'sticky top-0 h-svh'} overflow-hidden`}
      >
        {/* Soft studio light behind the composition — tone only, no image */}
        <div aria-hidden data-hero-light className="hero-light pointer-events-none absolute inset-0" />

        {/* Eyebrow */}
        {!isStatic && (
          <p ref={eyebrow} data-eyebrow className="container-page absolute inset-x-0 top-24 label text-center text-[0.8125rem] text-ink [-webkit-text-stroke:0.35px_currentColor] md:top-28 wide:text-left">
            {HERO.label}
          </p>
        )}

        {/* 3D letters */}
        {mode === '3d' && (
          <div ref={canvasWrap} className="absolute inset-0">
            {/* Poster shown until the scene is ready */}
            <div
              aria-hidden
              className="absolute inset-0 transition-opacity duration-500"
              style={{ opacity: sceneReady ? 0 : 1 }}
            >
              <svg
                viewBox={VB}
                className="absolute top-[max(18%,10.5rem)] left-1/2 h-[min(56%,calc(100%-15rem))] -translate-x-[calc(50%+min(20vw,340px))] portrait:top-[17%] portrait:h-[27%] portrait:-translate-x-[calc(50%+24vw)]"
              >
                <path d={MARK_B_D} fill={MARK_COLORS.b} />
              </svg>
              <svg
                viewBox={VB}
                className="absolute top-[max(26%,13rem)] left-1/2 h-[min(56%,calc(100%-15rem))] -translate-x-[calc(50%-min(20vw,340px))] portrait:top-[54%] portrait:h-[27%] portrait:-translate-x-[calc(50%-24vw)]"
              >
                <path d={MARK_G_D} fill={MARK_COLORS.g} />
              </svg>
            </div>
            <Suspense fallback={null}>
              <div
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: sceneReady ? 1 : 0 }}
              >
                <HeroScene
                  progress={progress}
                  pointer={pointer}
                  safeTop={safeTop}
                  quality={tier === 'desktop' ? 'high' : 'medium'}
                  active={sceneActive}
                  onReady={() => setSceneReady(true)}
                />
              </div>
            </Suspense>
          </div>
        )}

        {/* The flat mark — the only version of the logo that is ever shown joined */}
        {!isStatic && (
          <div
            ref={flat}
            className={`pointer-events-none absolute top-1/2 left-1/2 h-[30%] -translate-x-1/2 -translate-y-1/2 ${mode === 'svg' ? 'md:h-[34%] wide:h-[56%]' : 'md:h-[56%]'}`}
            style={{ aspectRatio: `${MARK_VIEWBOX.w} / ${MARK_VIEWBOX.h}` }}
          >
            <BrandMark className="h-full w-full overflow-visible" bRef={bGroup} gRef={gGroup} />
          </div>
        )}

        {/* The gap, measured */}
        {!isStatic && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 flex flex-col items-center"
          >
            <span className="relative block w-[min(40vw,560px)]">
              <span ref={gapLine} className="block h-px w-full bg-terracotta/70" />
              {/* Measured ends: ticks with Brand and Growth — desktop only */}
              <span data-gap-ends className="hidden desk:block">
                <span className="absolute top-[-5px] left-0 h-[11px] w-px bg-terracotta/70" />
                <span className="absolute top-[-5px] right-0 h-[11px] w-px bg-terracotta/70" />
                <span className="label absolute top-4 left-0 text-[0.5625rem] text-terracotta">Brand</span>
                <span className="label absolute top-4 right-12 text-[0.5625rem] text-ink">Growth</span>
              </span>
            </span>
            <span data-gap-label className="mt-3 flex items-baseline gap-2">
              <span className="label text-[0.6875rem] text-ink-muted">The gap</span>
              <span ref={gapReadout} className="font-display text-lg tabular-nums text-terracotta">
                100
              </span>
            </span>
          </div>
        )}

        {/* The core message, split across the gap — one half in each empty corner of the
            diagonal. Visual only: the h1 in the lockup carries the same sentence for
            assistive tech, so it is never announced twice. */}
        {!isStatic && (
          <div aria-hidden className="pointer-events-none absolute inset-0 [@media(max-height:540px)]:hidden">
            <div className="container-page absolute inset-x-0 top-[23%] flex justify-end landscape:top-[27%]">
              <div data-split-intro className="xl:mr-10">
                <span data-split="a" className="flex flex-col items-end text-right">
                  {/* <span className="label mb-3 hidden text-[0.625rem] text-ink-muted md:block">
                    Fig. 01 <span className="text-terracotta">—</span> The gap
                  </span> */}
                  <span className={SPLIT}>
                    We bridge
                    <br />
                    the gap
                  </span>
                </span>
              </div>
            </div>
            <div className="container-page absolute inset-x-0 top-[61%] landscape:top-[64%]">
              <div data-split-intro className="w-fit">
                <span data-split="b" className={SPLIT}>
                  between your brand
                  <br />
                  and growth.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Editorial frame: print crop marks and two quiet captions — tablet and up */}
        {!isStatic && (
          <div data-hero-frame aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
            {/* Corner arms sit just outside the content edge, so they frame the page without touching type */}
            <div className="container-page absolute inset-x-0 top-24 bottom-5">
              <div className="relative h-full">
                {[
                  'top-0 -left-3 border-t border-l',
                  'top-0 -right-3 border-t border-r',
                  'bottom-0 -left-3 border-b border-l',
                  'bottom-0 -right-3 border-b border-r',
                ].map((pos) => (
                  <span key={pos} className={`absolute size-7 border-ink/30 lg:size-9 xl:size-10 ${pos}`} />
                ))}
              </div>
            </div>
            <p className="container-page absolute inset-x-0 bottom-8 flex items-end justify-end">
              <span className="label text-[0.6875rem] text-ink-soft">{HERO.line}</span>
            </p>
          </div>
        )}

        {!isStatic && (
          <div data-scroll-cue className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3">
            <span className="label text-[0.6875rem] text-ink-muted">Scroll to close the gap</span>
            <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_2.2s_cubic-bezier(0.76,0,0.24,1)_infinite] bg-terracotta" />
            </span>
          </div>
        )}

        {/* Lockup: mark beside the wordmark, as the guidelines specify */}
        <div
          className={`${isStatic ? 'relative pt-28 pb-16' : 'absolute inset-0 pt-16 wide:pt-0'} container-page flex flex-col justify-center gap-8 md:gap-10 wide:flex-row wide:items-center wide:gap-[clamp(2.5rem,5vw,6rem)]`}
        >
          <div
            ref={markTarget}
            className="h-[clamp(4.5rem,100svh-34rem,20svh)] self-center md:h-[24svh] wide:h-[min(38svh,24vw)] wide:shrink-0 wide:self-center"
            style={{ aspectRatio: `${MARK_VIEWBOX.w} / ${MARK_VIEWBOX.h}` }}
          >
            {isStatic && <BrandMark className="h-full w-full" />}
          </div>
          <div className="text-center wide:max-w-[38rem] wide:text-left xl:max-w-[44rem]">
            {/* The wordmark leads the lockup; the page's one h1 is the core message beneath it. */}
            <div className="font-display text-[clamp(2.75rem,0.9rem+5.4vw,6.5rem)] leading-[0.92] tracking-[-0.02em] md:text-[4.5rem] wide:text-[clamp(2.75rem,0.9rem+5.4vw,6.5rem)]">
              <p aria-hidden className="line-mask">
                <span data-hero-line className="block">
                  Brand<span className="text-terracotta">Gap</span>
                </span>
              </p>
              <h1 className="line-mask mx-auto mt-3 max-w-[22rem] md:mt-5 md:max-w-[26rem] wide:mx-0 xl:max-w-[30rem]">
                <span data-hero-line className="block text-[clamp(1.375rem,1.05rem+1.2vw,2.125rem)] leading-[1.1] italic text-ink-soft">
                  {HERO.title}
                </span>
              </h1>
            </div>
            <p data-hero-fade className="mx-auto mt-5 max-w-md text-lead text-ink-soft md:mt-7 wide:mx-0 xl:max-w-lg">
              {HERO.body}
            </p>
            <div
              data-hero-fade
              className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-8 md:mt-10 wide:justify-start"
            >
              <MagneticButton href="/contact" cursor="start" trackAs="hero_start_project">
                {HERO.primary}
              </MagneticButton>
              <MagneticButton href="#work" variant="text" trackAs="hero_explore_work">
                {HERO.secondary}
              </MagneticButton>
            </div>
            <p data-hero-fade className="label mt-5 text-[0.75rem] text-ink [-webkit-text-stroke:0.35px_currentColor] md:hidden">
              {HERO.line}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
