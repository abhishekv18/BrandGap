import { useThree } from '@react-three/fiber'
import { memo, useEffect } from 'react'
import {
  Color,
  CubeCamera,
  DoubleSide,
  HalfFloatType,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  RingGeometry,
  Scene,
  WebGLCubeRenderTarget,
} from 'three'

// The softboxes that the clearcoat reflects. Same values the scene was approved with.
const SOFTBOXES = [
  { geometry: () => new PlaneGeometry(1, 1), intensity: 1.4, color: '#FFF3EA', position: [-3, 3, 5], scale: [6, 3, 1] },
  { geometry: () => new PlaneGeometry(1, 1), intensity: 0.5, color: '#EFD6CC', position: [4, -1, 3], scale: [4, 4, 1] },
  { geometry: () => new RingGeometry(0.5, 1, 64), intensity: 0.6, color: '#FFFFFF', position: [0, 5, -2], scale: [3, 3, 3] },
]

/**
 * Renders the softboxes once into a small cube map and uses it as the scene's
 * environment. Built in code with three.js directly — nothing downloaded, and
 * no helper library needed for a one-off render.
 */
function StudioEnvironment({ resolution = 128 }) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)

  useEffect(() => {
    const studio = new Scene()
    const disposables = []
    for (const box of SOFTBOXES) {
      const geometry = box.geometry()
      const material = new MeshBasicMaterial({
        color: new Color(box.color).multiplyScalar(box.intensity),
        side: DoubleSide,
        toneMapped: false,
      })
      const mesh = new Mesh(geometry, material)
      mesh.position.set(...box.position)
      mesh.scale.set(...box.scale)
      mesh.lookAt(0, 0, 0)
      studio.add(mesh)
      disposables.push(geometry, material)
    }

    const target = new WebGLCubeRenderTarget(resolution)
    target.texture.type = HalfFloatType
    const camera = new CubeCamera(1, 1000, target)
    camera.update(gl, studio)

    const previous = scene.environment
    scene.environment = target.texture
    return () => {
      scene.environment = previous
      target.dispose()
      disposables.forEach((d) => d.dispose())
    }
  }, [gl, scene, resolution])

  return null
}

/**
 * Soft studio light: a warm key from the upper left (the one that casts
 * the shadow on the paper), a cool-neutral fill, and a baked softbox
 * environment for the clearcoat.
 */
export const Lights = memo(function Lights({ shadows }) {
  return (
    <>
      <ambientLight intensity={0.3} color="#FFF4EC" />
      <directionalLight
        position={[-4, 5, 7]}
        intensity={1.8}
        color="#FFF1E6"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-radius={14}
        shadow-blurSamples={16}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[5, -2, 4]} intensity={0.5} color="#F2E6E0" />
      <StudioEnvironment />
    </>
  )
})
