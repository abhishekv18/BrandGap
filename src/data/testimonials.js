/**
 * VII — Clients & testimonials. Placeholders only.
 * Brief §4/§7: logos only with permission; testimonial results must come
 * from real client information.
 */
export const CLIENTS_INTRO = {
  title: "Trusted by brands building what's next.",
}

/**
 * Client logos. A logo renders only when it has a `src` AND `permission: true`;
 * otherwise its slot shows a labelled placeholder.
 *   { id, name, src: '/clients/name.svg', width, height, permission: true }
 */
export const CLIENT_LOGOS = Array.from({ length: 6 }, (_, i) => ({
  id: `logo-${i + 1}`,
  name: '[Client Logo]',
  src: null,
  permission: false,
}))

export const TESTIMONIALS = [
  { id: 't-01', quote: '[Testimonial Quote]', name: '[Client Name]', role: '[Role]', company: '[Company]', result: '[Result]' },
  { id: 't-02', quote: '[Testimonial Quote]', name: '[Client Name]', role: '[Role]', company: '[Company]', result: '[Result]' },
  { id: 't-03', quote: '[Testimonial Quote]', name: '[Client Name]', role: '[Role]', company: '[Company]', result: '[Result]' },
]
