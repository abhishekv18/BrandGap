import { AnimatePresence, m, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion'
import { forwardRef, useImperativeHandle } from 'react'
import { ProjectPlate } from './ProjectPlate'

const EASE = [0.16, 1, 0.3, 1]
const TONES = ['blush', 'terracotta', 'ink']

/**
 * A small image card that follows the pointer while it is over a list —
 * the editorial "hover reveal". Desktop with a fine pointer only; purely
 * decorative (aria-hidden), the list itself carries the content.
 *
 * The parent calls ref.move(event) from its own pointer handler.
 */
export const HoverPreview = forwardRef(function HoverPreview({ items, active, visible }, ref) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 })
  const y = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 })
  // A slight tilt in the direction of travel — weight, not wobble.
  const vx = useVelocity(x)
  const rotate = useTransform(vx, [-1800, 0, 1800], [-6, 0, 6], { clamp: true })

  useImperativeHandle(ref, () => ({
    move(e) {
      mx.set(e.clientX + 32)
      my.set(e.clientY)
    },
  }))

  const item = items[active]

  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-30 hidden w-[17rem] md:block xl:w-[19rem]"
      style={{ x, y, rotate, translateY: '-50%' }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.86 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
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
      </div>
    </m.div>
  )
})
