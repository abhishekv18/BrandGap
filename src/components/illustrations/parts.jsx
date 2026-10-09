/**
 * Shared drawing parts for the homepage's editorial figures — the same
 * visual family as the Insights artwork: cream paper, terracotta, near-black,
 * hairline pointers, numbered callouts and small tracked labels.
 *
 * Everything is vector, so it stays crisp at every size and costs a few KB.
 * Lines meant to draw on scroll carry `data-draw` and pathLength="1", so one
 * dash-offset tween (0 → 1) works for any length.
 */

export const C = {
  cream: '#f4e9e1',
  paper: '#f9f2ed',
  blush: '#efd6cc',
  blush2: '#e6c4b7',
  beige: '#dccbbf',
  terra: '#a8483a',
  terraD: '#93392c',
  terraL: '#b85a4b',
  ink: '#1c1216',
  muted: '#665953',
  line: '#c4b2a8',
}

const SANS = { fontFamily: 'var(--font-sans)', letterSpacing: '0.16em' }
const SERIF = { fontFamily: 'var(--font-display)' }

/** A small uppercase tracked label, like the site's `.label`. */
export function Label({ x, y, size = 13, fill = C.muted, anchor = 'start', children, ...rest }) {
  return (
    <text x={x} y={y} fontSize={size} fill={fill} textAnchor={anchor} style={SANS} {...rest}>
      {typeof children === 'string' ? children.toUpperCase() : children}
    </text>
  )
}

/** A numbered label: the numeral in terracotta, the name in ink. */
export function NumLabel({ x, y, num, name, size = 13, anchor = 'start', ...rest }) {
  return (
    <text x={x} y={y} fontSize={size} textAnchor={anchor} style={SANS} {...rest}>
      <tspan fill={C.terra}>{num} — </tspan>
      <tspan fill={C.ink}>{name.toUpperCase()}</tspan>
    </text>
  )
}

/** An editorial note in the display serif. */
export function Note({ x, y, size = 22, fill = C.ink, italic = false, anchor = 'start', children, ...rest }) {
  return (
    <text x={x} y={y} fontSize={size} fill={fill} textAnchor={anchor} fontStyle={italic ? 'italic' : undefined} style={SERIF} {...rest}>
      {children}
    </text>
  )
}

/** A hairline pointer ending in a terracotta dot (at `from`). */
export function Pointer({ from, to, width = 1, dot = 4, draw = true }) {
  return (
    <g>
      <path
        d={`M${from[0]} ${from[1]} L${to[0]} ${to[1]}`}
        stroke={C.ink}
        strokeWidth={width}
        fill="none"
        pathLength={1}
        vectorEffect="non-scaling-stroke"
        {...(draw ? { 'data-draw': '' } : {})}
      />
      <circle cx={from[0]} cy={from[1]} r={dot} fill={C.terra} />
    </g>
  )
}

/** Print-style crop marks in the four corners, as on the Insights plates. */
export function CropMarks({ w, h, m = 14, l = 22, width = 1 }) {
  const corners = [
    [m, m, 1, 1],
    [w - m, m, -1, 1],
    [m, h - m, 1, -1],
    [w - m, h - m, -1, -1],
  ]
  return (
    <g stroke={C.line} strokeWidth={width} vectorEffect="non-scaling-stroke">
      {corners.map(([x, y, sx, sy]) => (
        <path key={`${x}${y}`} d={`M${x + sx * l} ${y} L${x} ${y} L${x} ${y + sy * l}`} fill="none" vectorEffect="non-scaling-stroke" />
      ))}
    </g>
  )
}

/** A soft contact shadow under an object. */
export function Shadow({ cx, cy, rx, ry, opacity = 0.16, id }) {
  return (
    <g>
      <defs>
        <filter id={id} x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation={ry} />
        </filter>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#5a3228" opacity={opacity} filter={`url(#${id})`} />
    </g>
  )
}

/** A dropper/serum bottle: the fictional product used across the figures. */
export function Bottle({ x, y, h, body = C.paper, cap = C.ink, band = C.blush2, highlight = true }) {
  // (x, y) is the base centre.
  const w = h * 0.44
  return (
    <g>
      <rect x={x - w / 2} y={y - h * 0.7} width={w} height={h * 0.7} rx={w * 0.2} fill={body} />
      <rect x={x - w * 0.22} y={y - h * 0.86} width={w * 0.44} height={h * 0.18} rx={w * 0.06} fill={cap} />
      <ellipse cx={x} cy={y - h * 0.9} rx={w * 0.17} ry={h * 0.07} fill={cap} />
      <rect x={x - w * 0.32} y={y - h * 0.44} width={w * 0.64} height={h * 0.16} rx={w * 0.05} fill={band} />
      {highlight && <rect x={x - w * 0.36} y={y - h * 0.64} width={w * 0.07} height={h * 0.5} rx={w * 0.035} fill="#ffffff" opacity={0.35} />}
    </g>
  )
}
