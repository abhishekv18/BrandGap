import { useMemo } from 'react'
import { useMediaQuery, useReducedMotion } from './useMediaQuery'

let webglSupport = null
function hasWebGL() {
  if (webglSupport !== null) return webglSupport
  try {
    const canvas = document.createElement('canvas')
    webglSupport = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    webglSupport = false
  }
  return webglSupport
}

/**
 * One place that decides how rich the experience is allowed to be.
 * desktop: full 3D + custom cursor + smooth scroll
 * tablet:  lighter 3D, native pointer
 * mobile:  SVG storytelling, no WebGL
 */
export function useCapabilities() {
  const reducedMotion = useReducedMotion()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const wide = useMediaQuery('(min-width: 1024px)')
  const medium = useMediaQuery('(min-width: 768px)')

  return useMemo(() => {
    const tier = wide && finePointer ? 'desktop' : medium ? 'tablet' : 'mobile'
    const webgl = tier !== 'mobile' && !reducedMotion && hasWebGL()
    return { tier, reducedMotion, finePointer, webgl }
  }, [reducedMotion, finePointer, wide, medium])
}
