import { m } from 'framer-motion'
import { useReducedMotion } from '../hooks/useMediaQuery'

const EASE = [0.16, 1, 0.3, 1]

/** Fades and lifts content in once as it enters the viewport. */
export function Reveal({ children, as = 'div', delay = 0, y = 28, className = '', ...rest }) {
  const Tag = m[as]
  const reduced = useReducedMotion()
  return (
    <Tag
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/**
 * Slides a heading up from behind a mask, the same motion as the hero wordmark.
 * Visibility is tracked on the mask itself: the text starts clipped out of
 * view, so observing the text directly would never report it as visible.
 */
export function MaskReveal({ children, as = 'span', delay = 0, className = '' }) {
  const Tag = m[as]
  const reduced = useReducedMotion()
  return (
    <m.span
      className="line-mask"
      initial={reduced ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      <Tag
        className={`block ${className}`}
        variants={{ hidden: { y: '105%' }, shown: { y: '0%' } }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </Tag>
    </m.span>
  )
}
