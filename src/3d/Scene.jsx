import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { VSMShadowMap } from 'three'
import { smoothstep } from '../animations/gsap'
import { BrandMark3D } from './BrandMark3D'
import { JOIN_AT } from './constants'
import { Lights } from './Lights'

/**
 * The paper behind the letters: invisible except for the soft shadow
 * they cast. The shadow fades as the letters settle into the flat mark.
 */
function PaperShadow({ progress }) {
  const mat = useRef(null)
  useFrame(() => {
    if (mat.current)
      mat.current.opacity = 0.13 * (1 - smoothstep(progress.current ?? 0, JOIN_AT - 0.16, JOIN_AT))
  })
  return (
    <mesh position={[0, 0, -0.7]} receiveShadow>
      <planeGeometry args={[40, 24]} />
      <shadowMaterial ref={mat} color="#8A3A2E" opacity={0.13} />
    </mesh>
  )
}

export default function HeroScene({ progress, pointer, safeTop, quality, active, onReady }) {
  const high = quality === 'high'

  // R3F sizes the canvas from a ResizeObserver, which never reports while the
  // page is hidden (e.g. opened in a background tab). A re-measure on mount
  // guarantees the canvas has a size the first time it becomes visible.
  useEffect(() => {
    const id = setTimeout(() => window.dispatchEvent(new Event('resize')), 120)
    return () => clearTimeout(id)
  }, [])

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={active ? 'always' : 'never'}
      dpr={high ? [1, 1.75] : [1, 1.25]}
      camera={{ position: [0, 0, 10], fov: 30, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      shadows={high ? { type: VSMShadowMap } : false}
      flat
      onCreated={() => onReady?.()}
      aria-hidden
    >
      <Lights shadows={high} />
      {high && <PaperShadow progress={progress} />}
      <BrandMark3D progress={progress} pointer={pointer} safeTop={safeTop} />
    </Canvas>
  )
}
