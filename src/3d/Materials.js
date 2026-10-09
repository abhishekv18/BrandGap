import { Color, MeshPhysicalMaterial } from 'three'
import { MARK_COLORS } from '../data/mark'

/**
 * Glazed-ceramic finish: matte body, a faint clearcoat that catches the key
 * light along the bevels. Tactile, like premium packaging — never glossy.
 * `lift` adds a touch of the letter's own colour as glow, so its lit face
 * reads at the true brand colour instead of shading darker.
 */
export function createLetterMaterial(
  hex,
  { sheen = 0.2, envMapIntensity = 0.8, roughness = 0.55, clearcoat = 0.28, lift = 0, depth = 1 } = {},
) {
  // `depth` < 1 deepens the base so the lit result lands on the brand colour.
  const color = new Color(hex).multiplyScalar(depth)
  return new MeshPhysicalMaterial({
    color,
    roughness,
    metalness: 0,
    clearcoat,
    clearcoatRoughness: 0.38,
    sheen,
    envMapIntensity,
    sheenRoughness: 0.8,
    sheenColor: new Color('#F7E4DA'),
    emissive: color,
    emissiveIntensity: lift,
    transparent: false,
  })
}

export const materialColors = {
  b: MARK_COLORS.b,
  g: MARK_COLORS.g,
}

/**
 * Tuned so the 3D letters match the flat mark they join into:
 * the b keeps true terracotta on its lit face; the g reads as the brand's
 * deep ink rather than a charcoal grey (less sheen, fewer reflections).
 */
export const letterFinish = {
  b: { sheen: 0.1, envMapIntensity: 0.55, lift: 0.3 },
  g: { sheen: 0, envMapIntensity: 0.05, roughness: 0.8, clearcoat: 0.08, depth: 0.55 },
}
