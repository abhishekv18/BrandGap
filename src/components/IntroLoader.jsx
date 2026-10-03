import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../animations/gsap'
import { BrandMark, Wordmark } from './BrandMark'
import { useSmoothScroll } from './SmoothScroll'

/**
 * The opening beat: the b and the g travel toward each other while the gap
 * counts down from 100 to 00, lock into the flat mark, and the curtain lifts
 * to reveal the hero. Plays on every page load (~2s), never for
 * reduced-motion users. A safety timer always releases the page.
 */
export function IntroLoader({ enabled }) {
  // A deep link to a section (/page#id) goes straight there — no curtain to wait behind.
  const [show, setShow] = useState(() => enabled && !window.location.hash)
  const root = useRef(null)
  const bRef = useRef(null)
  const gRef = useRef(null)
  const readout = useRef(null)
  const { stop, start } = useSmoothScroll()

  useLayoutEffect(() => {
    if (!show) return
    stop()
    document.documentElement.style.overflow = 'hidden'

    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      document.documentElement.style.overflow = ''
      start()
      setShow(false)
    }

    const ctx = gsap.context(() => {
      const gap = { value: 100 }
      const tl = gsap.timeline({ onComplete: finish })
      tl.fromTo('[data-intro-fade]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'power1.out' }, 0)
      tl.fromTo(bRef.current, { x: -170 }, { x: 0, duration: 1.1, ease: 'power3.inOut' }, 0.15)
      tl.fromTo(gRef.current, { x: 170 }, { x: 0, duration: 1.1, ease: 'power3.inOut' }, 0.15)
      tl.fromTo('[data-intro-line]', { scaleX: 1 }, { scaleX: 0, duration: 1.1, ease: 'power3.inOut' }, 0.15)
      tl.to(
        gap,
        {
          value: 0,
          duration: 1.1,
          ease: 'power3.inOut',
          onUpdate: () => {
            if (readout.current) readout.current.textContent = String(Math.round(gap.value)).padStart(2, '0')
          },
        },
        0.15,
      )
      tl.fromTo('[data-intro-word]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.1)
      tl.to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.75, ease: 'power3.inOut' }, 1.75)
    }, root)

    const safety = setTimeout(finish, 4000)
    return () => {
      clearTimeout(safety)
      ctx.revert()
      document.documentElement.style.overflow = ''
      start()
    }
  }, [show, start, stop])

  if (!show) return null

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-cream px-6"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <div data-intro-fade className="flex flex-col items-center">
        <BrandMark className="h-[24svh] max-h-56 w-auto overflow-visible md:h-[26svh] md:max-h-72" bRef={bRef} gRef={gRef} />

        <div className="mt-8 flex w-[min(16rem,62vw)] flex-col items-center gap-3 md:mt-10">
          <span data-intro-line className="block h-px w-full origin-center bg-terracotta" />
          <span className="flex items-baseline gap-2">
            <span className="label text-[0.6875rem] text-ink-muted">The gap</span>
            <span ref={readout} className="font-display text-lg tabular-nums text-terracotta">
              100
            </span>
          </span>
        </div>

        <span data-intro-word className="mt-6 md:mt-8">
          <Wordmark className="text-2xl md:text-3xl" />
        </span>
      </div>
    </div>
  )
}
