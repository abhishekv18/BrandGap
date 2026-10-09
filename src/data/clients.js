/**
 * Client logos for the strip under the hero. Files are single-ink versions
 * (public/clients/mono) made from the originals in public/clients, so every
 * logo sits in the same tone. `height` is each logo's optical size in px at
 * desktop — tuned so dense, wide and icon-only marks carry equal weight.
 * Show a logo only with the client's permission (`permission: true`).
 */
export const LOGO_STRIP = {
  title: 'Trusted by growing brands',
}

export const CLIENT_LOGOS = [
  { id: 'the-decorshed', name: 'The Decorshed', src: '/clients/mono/the-decorshed.webp', width: 364, height: 107, size: 34, permission: true },
  { id: 'vibha-designs', name: 'Vibha Designs', src: '/clients/mono/vibha-designs.webp', width: 91, height: 94, size: 40, permission: true },
  { id: 'petsway', name: 'Petsway', src: '/clients/mono/petsway.webp', width: 588, height: 120, size: 24, permission: true },
  { id: 'global-ayurveda', name: 'Global Ayurveda', src: '/clients/mono/global-ayurveda.webp', width: 358, height: 200, size: 46, permission: true },
  { id: 'dudle', name: 'Dudle', src: '/clients/mono/dudle.webp', width: 615, height: 200, size: 30, permission: true },
  { id: 'immigrationpointer', name: 'ImmigrationPointer', src: '/clients/mono/immigrationpointer.webp', width: 790, height: 192, size: 36, permission: true },
].filter((logo) => logo.permission)
