

import { AnimatePresence, m, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { ProjectPlate } from './ProjectPlate'

const EASE = [0.16, 1, 0.3, 1]
const TONES = ['blush', 'terracotta', 'ink']
const EDGE = 16

export const HoverPreview = forwardRef(function HoverPreview({ items, active, visible }, ref) {
  const card = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 260, damping: 30, mass: 0.6 })
  const y = useSpring(my, { stiffness: 220, damping: 28, mass: 0.6 })
  const vy = useVelocity(y)
  const rotate = useTransform(vy, [-1800, 0, 1800], [-1.5, 0, 1.5], { clamp: true })

  useImperativeHandle(ref, () => ({
    move(e) {
      const list = e.currentTarget.getBoundingClientRect()
      const w = card.current?.offsetWidth ?? 208
      const h = card.current?.offsetHeight ?? 300
      // Align the card's right edge with the list edge (no overlap with the side rail)
      mx.set(list.right - w)
      const half = h / 2
      my.set(Math.min(Math.max(e.clientY, half + EDGE), window.innerHeight - half - EDGE))
    },
  }))

  const item = items[active]

  return (
    <m.div
      ref={card}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-30 hidden w-[12.5rem] md:block xl:w-[14rem] 2xl:w-[15.5rem]"
      style={{ x, y, rotate, translateY: '-50%' }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.94 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {/* Frame: slim cream mat, hairline border, soft shadow */}
      <div className="border border-line bg-cream p-2 shadow-[0_18px_36px_-22px_rgba(26,26,26,0.4)]">
        {/* Image, 4:5, graded to the brand palette */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: '4 / 5', filter: 'saturate(0.8) contrast(0.95) sepia(0.15)' }}
        >
          <AnimatePresence initial={false}>
            <m.div
              key={item.id}
              className="absolute inset-0"
              initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <ProjectPlate
                project={{ image: item.image, tone: TONES[active % TONES.length] }}
                ratio="4 / 5"
                letter={active % 2 ? 'g' : 'b'}
                crop={active % 2 ? 'left' : 'right'}
                label="[Service image]"
                cursor={undefined}
                className="h-full w-full"
              />
            </m.div>
          </AnimatePresence>
          {/* Warm tint so every image shares one colour grade */}
          <div className="pointer-events-none absolute inset-0 bg-blush/30 mix-blend-multiply" />
          {/* Inner hairline for a crisp edge */}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/10" />
        </div>

        {/* Caption */}
        <div className="mt-2 flex items-center justify-between pt-1">
          <span className="label tabular-nums text-terracotta">0{active + 1}</span>
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={item.id}
              className="label text-ink-soft"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.25 }}
            >
              {item.short ?? item.name}
            </m.span>
          </AnimatePresence>
        </div>
      </div>
    </m.div>
  )
})
