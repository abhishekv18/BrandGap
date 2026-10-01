import points from '../assets/mark-points.json'

/**
 * The bg interlock, from the client's master SVG (brandgap logo.svg).
 * The master is an auto-trace with stair-stepped edges; these outlines
 * are the same shapes, smoothed. Each letter is one closed contour and
 * already knocks out where the other letter passes over it — so each
 * letter is incomplete on its own and whole only when joined.
 */
export const MARK_VIEWBOX = { x: 69, y: 26, w: 389, h: 505 }
export const MARK_B = points[0]
export const MARK_G = points[1]

export const MARK_COLORS = {
  b: '#A8483A',
  g: '#1C1216',
  gOnDark: '#F4E9E1',
}

export const toPathD = (pts) => 'M' + pts.map(([x, y]) => `${x} ${y}`).join('L') + 'Z'

export const MARK_B_D = toPathD(MARK_B)
export const MARK_G_D = toPathD(MARK_G)
