import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.defaults({ ease: 'power3.out', duration: 0.9 })

export { gsap, ScrollTrigger }

export const clamp01 = (v) => Math.min(1, Math.max(0, v))
/** Maps v from [a,b] to [0,1], clamped. */
export const range = (v, a, b) => clamp01((v - a) / (b - a))
export const smoothstep = (v, a, b) => {
  const t = range(v, a, b)
  return t * t * (3 - 2 * t)
}
export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
