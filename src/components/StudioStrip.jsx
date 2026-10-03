import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { ABOUT_IMAGES } from '../data/about'
import { useCapabilities } from '../hooks/useCapabilities'
import { ProjectPlate } from './ProjectPlate'

// Staggered heights give the strip an editorial rhythm rather than a grid.
const PLATE_LAYOUT = [
  'w-[68vw] md:w-[30vw] self-start',
  'w-[56vw] md:w-[22vw] self-end md:mb-16',
  'w-[78vw] md:w-[36vw] self-center',
  'w-[60vw] md:w-[24vw] self-start md:mt-20',
]

/** Studio imagery that drifts sideways as you scroll, each image settling in its frame. */
export function StudioStrip({ className = '' }) {
  const { reducedMotion } = useCapabilities()
  const root = useRef(null)

  useLayoutEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-about-strip]',
        { xPercent: 4 },
        {
          xPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: '[data-about-strip]', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      gsap.utils.toArray('[data-about-strip] [data-inner]').forEach((inner) => {
        gsap.fromTo(
          inner,
          { yPercent: -6, scale: 1.1 },
          {
            yPercent: 6,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: inner.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <div ref={root} className={`overflow-hidden ${className}`}>
      <div
        data-about-strip
        className={`flex gap-4 px-4 md:gap-8 md:px-12 ${
          reducedMotion ? 'flex-wrap justify-center' : 'w-max items-stretch md:min-h-[42vw]'
        }`}
      >
        {ABOUT_IMAGES.map((img, i) => (
          <ProjectPlate
            key={img.id}
            project={img}
            tone={img.tone}
            ratio={img.ratio}
            letter={img.letter}
            crop={i % 2 ? 'left' : 'right'}
            label={img.label}
            cursor="explore"
            className={`shrink-0 ${reducedMotion ? 'w-[44vw] md:w-[22vw]' : PLATE_LAYOUT[i % PLATE_LAYOUT.length]}`}
          />
        ))}
      </div>
    </div>
  )
}
