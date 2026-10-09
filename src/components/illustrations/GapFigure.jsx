import { C, CropMarks, Label, NumLabel, Shadow } from './parts'

const ALT = 'Illustration: a product jar on a terracotta plinth (brand) and a phone showing a confirmed order (growth), with the measured space between them marked as the gap — positioning, creative, media and conversion.'

/** The jar on its plinth — the brand, as a premium object. (cx = jar centre, floor = plinth base.) */
function BrandObject({ cx, floor, scale = 1, id }) {
  const s = scale
  const pw = 140 * s
  const ph = 100 * s
  const top = floor - ph
  return (
    <g data-obj="brand">
      <circle cx={cx} cy={top - 40 * s} r={92 * s} fill={C.blush} opacity={0.55} />
      {/* plinth: a lit top edge, the face, a darker return */}
      <rect x={cx - pw / 2} y={top} width={pw} height={ph} fill={C.terra} />
      <rect x={cx - pw / 2} y={top} width={pw} height={9 * s} fill={C.terraL} />
      <rect x={cx + pw / 2 - 16 * s} y={top + 9 * s} width={16 * s} height={ph - 9 * s} fill={C.terraD} />
      <Shadow id={`${id}-jar`} cx={cx} cy={top + 1} rx={40 * s} ry={4 * s} opacity={0.22} />
      {/* the jar */}
      <rect x={cx - 36 * s} y={top - 60 * s} width={72 * s} height={60 * s} rx={9 * s} fill={C.paper} />
      <rect x={cx - 36 * s} y={top - 60 * s} width={72 * s} height={60 * s} rx={9 * s} fill="none" stroke={C.beige} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <rect x={cx - 40 * s} y={top - 84 * s} width={80 * s} height={26 * s} rx={6 * s} fill={C.ink} />
      <rect x={cx - 40 * s} y={top - 84 * s} width={80 * s} height={4 * s} rx={2 * s} fill="#3a2a2e" />
      <rect x={cx - 36 * s} y={top - 40 * s} width={72 * s} height={20 * s} fill={C.blush2} />
      <circle cx={cx - 20 * s} cy={top - 30 * s} r={3.5 * s} fill={C.terra} />
      <rect x={cx - 11 * s} y={top - 32 * s} width={34 * s} height={4 * s} rx={2 * s} fill={C.ink} opacity={0.75} />
      <rect x={cx - 30 * s} y={top - 56 * s} width={5 * s} height={44 * s} rx={2.5 * s} fill="#ffffff" opacity={0.45} />
    </g>
  )
}

/** The phone with a confirmed order — growth. (x = left edge, floor = base.) */
function GrowthObject({ x, floor, scale = 1, id }) {
  const s = scale
  const w = 104 * s
  const h = 204 * s
  const y = floor - h
  const cx = x + w / 2
  return (
    <g data-obj="growth">
      <circle cx={cx} cy={y + h * 0.45} r={98 * s} fill={C.blush} opacity={0.55} />
      <Shadow id={`${id}-phone`} cx={cx + 4 * s} cy={floor} rx={58 * s} ry={5 * s} opacity={0.24} />
      <rect x={x} y={y} width={w} height={h} rx={16 * s} fill={C.ink} />
      <rect x={x + 5 * s} y={y + 5 * s} width={w - 10 * s} height={h - 10 * s} rx={12 * s} fill={C.paper} />
      <rect x={cx - 15 * s} y={y + 11 * s} width={30 * s} height={7 * s} rx={3.5 * s} fill={C.ink} />
      {/* confirmation */}
      <circle cx={cx} cy={y + 64 * s} r={20 * s} fill={C.terra} />
      <path d={`M${cx - 8 * s} ${y + 64 * s} l${6 * s} ${6 * s} l${11 * s} ${-12 * s}`} stroke={C.paper} strokeWidth={2.4 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x={x + 20 * s} y={y + 98 * s} width={w - 40 * s} height={6 * s} rx={3 * s} fill={C.ink} />
      <rect x={x + 28 * s} y={y + 111 * s} width={w - 56 * s} height={4 * s} rx={2 * s} fill={C.line} />
      <rect x={x + 16 * s} y={y + 130 * s} width={w - 32 * s} height={1} fill={C.beige} />
      <rect x={x + 16 * s} y={y + 140 * s} width={30 * s} height={4 * s} rx={2 * s} fill={C.line} />
      <rect x={x + w - 46 * s} y={y + 140 * s} width={30 * s} height={4 * s} rx={2 * s} fill={C.line} />
      <rect x={x + 14 * s} y={y + h - 42 * s} width={w - 28 * s} height={20 * s} rx={10 * s} fill={C.ink} />
    </g>
  )
}

/** The architect's dimension line across the gap, with end ticks. */
function Dimension({ x1, x2, y, ext1, ext2, label, size }) {
  return (
    <g>
      <path data-draw d={`M${x1} ${ext1} L${x1} ${y - 14}`} pathLength={1} stroke={C.ink} strokeWidth={1} opacity={0.45} vectorEffect="non-scaling-stroke" fill="none" />
      <path data-draw d={`M${x2} ${ext2} L${x2} ${y - 14}`} pathLength={1} stroke={C.ink} strokeWidth={1} opacity={0.45} vectorEffect="non-scaling-stroke" fill="none" />
      <path data-dim d={`M${x1} ${y} L${x2} ${y}`} pathLength={1} stroke={C.terra} strokeWidth={1.25} vectorEffect="non-scaling-stroke" fill="none" />
      <path d={`M${x1 - 6} ${y + 6} L${x1 + 6} ${y - 6} M${x2 - 6} ${y + 6} L${x2 + 6} ${y - 6}`} stroke={C.terra} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      {label && (
        <Label data-callout x={(x1 + x2) / 2} y={y - 14} anchor="middle" size={size} fill={C.terra}>
          {label}
        </Label>
      )}
    </g>
  )
}

const GAPS = ['Positioning', 'Creative', 'Media', 'Conversion']

/**
 * The Gap, desktop: a measured drawing — BRAND, the gap, GROWTH — with the
 * four gaps called out along the dimension line. 4:3.
 */
export function GapFigure({ className = '' }) {
  const floor = 400
  const jarRight = 145
  const phoneLeft = 512
  const dimY = 116
  const step = (phoneLeft - jarRight) / 5
  const legendX = 232
  return (
    <svg viewBox="0 0 640 480" role="img" aria-label={ALT} className={className}>
      <CropMarks w={640} h={480} />
      <path d={`M24 ${floor} L616 ${floor}`} stroke={C.line} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <BrandObject cx={105} floor={floor} id="gapfig" />
      <GrowthObject x={phoneLeft} floor={floor} id="gapfig" />
      <Dimension x1={jarRight} x2={phoneLeft} y={dimY} ext1={floor - 186} ext2={floor - 210} />
      {/* numbered ticks along the gap, and their legend beneath */}
      {GAPS.map((_, i) => {
        const x = jarRight + step * (i + 1)
        return (
          <g key={i} data-callout>
            <path d={`M${x} ${dimY - 7} L${x} ${dimY + 7}`} stroke={C.terra} strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
            <Label x={x} y={dimY - 16} anchor="middle" size={16} fill={C.terra}>{`0${i + 1}`}</Label>
          </g>
        )
      })}
      <Label data-callout x={(jarRight + phoneLeft) / 2} y={dimY + 40} anchor="middle" size={17} fill={C.terra}>
        The gap
      </Label>
      <g data-callout>
        <path d={`M${legendX} ${dimY + 62} L${legendX + 190} ${dimY + 62}`} stroke={C.line} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        {GAPS.map((name, i) => (
          <NumLabel key={name} x={legendX} y={dimY + 92 + i * 27} num={`0${i + 1}`} name={name} size={16} />
        ))}
      </g>
      <Label x={105} y={438} anchor="middle" size={16} fill={C.ink}>
        Brand
      </Label>
      <Label x={phoneLeft + 52} y={438} anchor="middle" size={16} fill={C.ink}>
        Growth
      </Label>
    </svg>
  )
}

/** The Gap, tablet: the same drawing as a short strip — objects and the measured gap only. 21:9. */
export function GapStrip({ className = '' }) {
  const floor = 300
  const s = 0.78
  const jarRight = 150 + 36 * s
  const phoneLeft = 640
  return (
    <svg viewBox="0 0 840 360" role="img" aria-label={ALT} className={className}>
      <path d={`M40 ${floor} L800 ${floor}`} stroke={C.line} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <BrandObject cx={150} floor={floor} scale={s} id="gapstrip" />
      <GrowthObject x={phoneLeft} floor={floor} scale={s} id="gapstrip" />
      <Dimension x1={jarRight} x2={phoneLeft} y={120} ext1={floor - 150} ext2={floor - 166} label="The gap" size={17} />
      <Label x={150} y={336} anchor="middle" size={16} fill={C.ink}>
        Brand
      </Label>
      <Label x={phoneLeft + 52 * s} y={336} anchor="middle" size={16} fill={C.ink}>
        Growth
      </Label>
    </svg>
  )
}
