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

// On phones the last two swap so the tones alternate diagonally across the two columns.
const PHONE_ORDER = [0, 1, 3, 2]

/** Studio imagery that drifts sideways as you scroll, each image settling in its frame. */
export function StudioStrip({ className = '' }) {
  const { reducedMotion, tier } = useCapabilities()
  // Phones get a still, staggered two-column sheet; the sideways drift needs a wider screen.
  const phone = tier === 'mobile'
  const still = reducedMotion || phone
  const root = useRef(null)

  useLayoutEffect(() => {
    if (still) return
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
  }, [still])

  return (
    <div ref={root} className={`overflow-hidden ${className}`}>
      <div
        data-about-strip
        className={
          phone
            ? 'grid grid-cols-2 gap-x-3 gap-y-4 px-4 pb-12 [&>*:nth-child(even)]:translate-y-12'
            : `flex gap-4 px-4 md:gap-8 md:px-12 ${still ? 'flex-wrap items-start justify-center' : 'w-max items-stretch md:min-h-[42vw]'}`
        }
      >
        {(phone ? PHONE_ORDER.map((n) => ABOUT_IMAGES[n]).filter(Boolean) : ABOUT_IMAGES).map((img, i) => (
          <ProjectPlate
            key={img.id}
            project={img}
            tone={img.tone}
            ratio={phone ? '4 / 5' : img.ratio}
            letter={img.letter}
            crop={i % 2 ? 'left' : 'right'}
            label={img.label}
            cursor="explore"
            className={phone ? '' : `shrink-0 ${still ? 'md:w-[22vw]' : PLATE_LAYOUT[i % PLATE_LAYOUT.length]}`}
          />
        ))}
      </div>
    </div>
  )
}
