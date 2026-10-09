import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '../animations/gsap'
import { CHAPTERS } from '../data/navigation'

/**
 * The page's progress indicator, framed as the gap closing:
 * a hairline that fills as you read and a readout counting 100 → 0.
 * Desktop only; purely decorative (aria-hidden).
 */
export function GapRail() {
  const fill = useRef(null)
  const readout = useRef(null)
  const chapter = useRef(null)
  const rail = useRef(null)
  const gauge = useRef(null)

  useEffect(() => {
    const page = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (fill.current) fill.current.style.transform = `scaleY(${self.progress})`
        if (readout.current)
          readout.current.textContent = String(Math.round(100 - self.progress * 100)).padStart(2, '0')
      },
    })
    // The hero carries its own gap readout, so the rail's waits until the hero is done.
    const hero = document.getElementById('top')
    const showGauge = (self) => {
      if (gauge.current) gauge.current.style.opacity = self.isActive ? '0' : '1'
    }
    const heroGauge = hero
      ? ScrollTrigger.create({ trigger: hero, start: 'top bottom', end: 'bottom 60%', onToggle: showGauge, onRefresh: showGauge })
      : null
    // The rail is drawn in multiply, so it steps aside over ink grounds (the work) and the final chapter.
    let onInk = false
    let atEnd = false
    const showRail = () => {
      if (rail.current) rail.current.style.opacity = onInk || atEnd ? '0' : '1'
    }
    const chapters = CHAPTERS.map((c) => {
      const el = document.getElementById(c.id)
      if (!el) return null
      const ink = el.dataset.ground === 'ink'
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive && chapter.current) chapter.current.textContent = `${c.numeral} — ${c.name}`
          if (self.isActive) onInk = ink
          else if (ink) onInk = false
          showRail()
        },
      })
    })
    // The rail steps aside for the final chapter: terracotta and black grounds.
    const exit = document.getElementById('cta')
    const hide = exit
      ? ScrollTrigger.create({
          trigger: exit,
          start: 'top 60%',
          onToggle: (self) => {
            atEnd = self.isActive || self.progress === 1
            showRail()
          },
          end: 'max',
        })
      : null
    return () => {
      hide?.kill()
      heroGauge?.kill()
      page.kill()
      chapters.forEach((t) => t?.kill())
    }
  }, [])

  return (
    <div
      ref={rail}
      aria-hidden
      className="pointer-events-none fixed top-1/2 right-5 transition-opacity duration-500 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 mix-blend-multiply xl:flex"
    >
      <span className="label text-[0.6875rem] text-ink-muted [writing-mode:vertical-rl]" ref={chapter}>
        I — Hero
      </span>
      <span className="relative block h-40 w-px bg-line">
        <span ref={fill} className="absolute inset-0 origin-top scale-y-0 bg-terracotta" />
      </span>
      <span ref={gauge} className="flex flex-col items-center leading-none transition-opacity duration-500">
        <span className="label text-[0.5625rem] text-ink-muted">Gap</span>
        <span ref={readout} className="mt-1 font-display text-lg tabular-nums text-terracotta">
          100
        </span>
      </span>
    </div>
  )
}
