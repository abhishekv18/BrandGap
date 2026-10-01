import { MARK_B_D, MARK_COLORS, MARK_G_D, MARK_VIEWBOX } from '../data/mark'

/** The flat bg mark. Never recolour beyond these tones, never rotate or stretch. */
export function BrandMark({ tone = 'light', title, ref, bRef, gRef, ...rest }) {
  const { x, y, w, h } = MARK_VIEWBOX
  return (
    <svg
      ref={ref}
      viewBox={`${x} ${y} ${w} ${h}`}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title && <title>{title}</title>}
      <g ref={bRef}>
        <path d={MARK_B_D} fill={MARK_COLORS.b} />
      </g>
      <g ref={gRef}>
        <path d={MARK_G_D} fill={tone === 'dark' ? MARK_COLORS.gOnDark : MARK_COLORS.g} />
      </g>
    </svg>
  )
}

export function Wordmark({ className = '', tone = 'light' }) {
  return (
    <span className={`font-display tracking-[-0.01em] ${className}`}>
      <span className={tone === 'dark' ? 'text-cream' : 'text-ink'}>Brand</span>
      <span className="text-terracotta">Gap</span>
    </span>
  )
}
