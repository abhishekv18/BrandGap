import { useFrame, useThree } from '@react-three/fiber'
import { memo, useEffect, useMemo, useRef } from 'react'
import { ExtrudeGeometry, MathUtils, Shape, Vector2 } from 'three'
import { easeInOutCubic, range, smoothstep } from '../animations/gsap'
import { MARK_B, MARK_G, MARK_VIEWBOX } from '../data/mark'
import { JOIN_AT, MARK_WORLD_HEIGHT } from './constants'
import { createLetterMaterial, materialColors } from './Materials'

const S = MARK_WORLD_HEIGHT / MARK_VIEWBOX.h
const CX = MARK_VIEWBOX.x + MARK_VIEWBOX.w / 2
const CY = MARK_VIEWBOX.y + MARK_VIEWBOX.h / 2

const DEPTH = 0.2
const BEVEL = { thickness: 0.03, size: 0.024 }

function buildLetter(points) {
  const pts = points.map(([x, y]) => new Vector2((x - CX) * S, -(y - CY) * S))
  const geometry = new ExtrudeGeometry(new Shape(pts), {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: BEVEL.thickness,
    bevelSize: BEVEL.size,
    bevelOffset: -BEVEL.size, // keep the silhouette identical to the flat mark
    bevelSegments: 5,
    curveSegments: 1,
  })
  geometry.computeBoundingBox()
  const bb = geometry.boundingBox
  const center = { x: (bb.min.x + bb.max.x) / 2, y: (bb.min.y + bb.max.y) / 2 }
  // Rotate around the letter's own centre; the front face sits on z = 0.
  geometry.translate(-center.x, -center.y, -bb.max.z)
  return { geometry, center, halfHeight: (bb.max.y - bb.min.y) / 2 }
}

/**
 * The b and the g as two tactile objects. Apart, each is visibly incomplete —
 * each carries the notch where the other passes through it. Scroll brings them
 * together until they lock face-on into the exact flat mark, at which point
 * the page swaps to the SVG so the logo itself is never rotated or shaded.
 */
export const BrandMark3D = memo(function BrandMark3D({ progress, pointer, safeTop }) {
  const b = useMemo(() => buildLetter(MARK_B), [])
  const g = useMemo(() => buildLetter(MARK_G), [])
  const bMat = useMemo(() => createLetterMaterial(materialColors.b), [])
  const gMat = useMemo(() => createLetterMaterial(materialColors.g, { sheen: 0, envMapIntensity: 0.3 }), [])
  const bRef = useRef(null)
  const gRef = useRef(null)
  const eased = useRef(0)
  const tilt = useRef({ x: 0, y: 0 })
  const viewport = useThree((s) => s.viewport)
  const size = useThree((s) => s.size)

  useEffect(
    () => () => {
      b.geometry.dispose()
      g.geometry.dispose()
      bMat.dispose()
      gMat.dispose()
    },
    [b, g, bMat, gMat],
  )

  // Spread scales with the frame so the letters never leave it.
  // Landscape (desktop) values are the approved composition. Portrait frames
  // (tablets held upright) are narrow, so the letters separate more vertically
  // than horizontally and start a little smaller.
  const portrait = viewport.aspect < 1
  const shrink = portrait ? 0.3 : 0.14
  let startB
  let startG
  if (portrait) {
    const sx = viewport.width * 0.2
    startB = { x: -sx, y: viewport.height * 0.13, z: 0.3, rx: 0.12, ry: 0.4, rz: -0.06 }
    startG = { x: sx, y: -viewport.height * 0.15, z: 0.15, rx: -0.1, ry: -0.38, rz: 0.04 }
  } else {
    const spreadX = Math.min(2.3, viewport.width * 0.23)
    const spreadY = Math.min(0.42, viewport.height * 0.08)
    startB = { x: -spreadX, y: spreadY * 0.35, z: 0.5, rx: 0.12, ry: 0.46, rz: -0.06 }
    startG = { x: spreadX, y: -spreadY * 1.2, z: 0.25, rx: -0.1, ry: -0.42, rz: 0.04 }
  }

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30)
    eased.current = MathUtils.damp(eased.current, progress.current ?? 0, 7, dt)
    const p = eased.current

    const sep = 1 - easeInOutCubic(range(p, 0, JOIN_AT))
    const turn = 1 - smoothstep(p, 0.06, JOIN_AT)

    tilt.current.x = MathUtils.damp(tilt.current.x, (pointer.current?.x ?? 0) * 0.1, 4, dt)
    tilt.current.y = MathUtils.damp(tilt.current.y, (pointer.current?.y ?? 0) * 0.08, 4, dt)
    const t = state.clock.elapsedTime

    const apply = (grp, center, s, phase) => {
      if (!grp) return
      const float = Math.sin(t * 0.7 + phase) * 0.04 * turn
      const k = 1 - shrink * sep
      grp.scale.setScalar(k)
      grp.position.set(center.x * k + s.x * sep, center.y * k + s.y * sep + float, s.z * sep)
      grp.rotation.set(
        (s.rx - tilt.current.y) * turn,
        (s.ry + tilt.current.x) * turn,
        s.rz * turn + Math.sin(t * 0.5 + phase) * 0.015 * turn,
      )
    }
    // The b starts high and nearer the camera; on short, wide screens that can
    // reach the eyebrow line. Lower its starting height only as far as needed.
    let poseB = startB
    const safePx = safeTop?.current ?? 0
    if (safePx > 0 && size.height > 0) {
      const worldTop = viewport.height / 2 - (safePx * viewport.height) / size.height
      const k0 = 1 - shrink
      const persp = 10 / (10 - startB.z) // camera at z = 10
      const maxY = worldTop / persp - (b.center.y + b.halfHeight) * k0
      if (startB.y > maxY) poseB = { ...startB, y: maxY }
    }
    apply(bRef.current, b.center, poseB, 0)
    apply(gRef.current, g.center, startG, 1.7)
  })

  return (
    <>
      <group ref={bRef}>
        <mesh geometry={b.geometry} material={bMat} castShadow />
      </group>
      <group ref={gRef}>
        <mesh geometry={g.geometry} material={gMat} castShadow />
      </group>
    </>
  )
})
