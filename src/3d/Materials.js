import { Color, MeshPhysicalMaterial } from 'three'
import { MARK_COLORS } from '../data/mark'

/**
 * Glazed-ceramic finish: matte body, a faint clearcoat that catches the key
 * light along the bevels. Tactile, like premium packaging — never glossy.
 */
export function createLetterMaterial(hex, { sheen = 0.2, envMapIntensity = 0.8 } = {}) {
  return new MeshPhysicalMaterial({
    color: new Color(hex),
    roughness: 0.55,
    metalness: 0,
    clearcoat: 0.28,
    clearcoatRoughness: 0.38,
    sheen,
    envMapIntensity,
    sheenRoughness: 0.8,
    sheenColor: new Color('#F7E4DA'),
    transparent: false,
  })
}

export const materialColors = {
  b: MARK_COLORS.b,
  g: MARK_COLORS.g,
}
