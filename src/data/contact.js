/**
 * Contact & footer details. Everything not supplied by the client is a
 * placeholder: set `href` values to go live — no component changes needed.
 */
export const CONTACT_CTA = {
  // Project brief.
  headline: "What's your gap?",
  subline: "Let's close it.",
  label: 'Start a project',
  // Where "Start a project" leads (mailto:, form URL, booking link). null = not yet connected.
 // href: null,
    // href: 'mailto:agrawalabhishek723@gmail.com',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=agrawalabhishek723@gmail.com&su=Project%20enquiry',
  // Shown when the button is pressed before `href` is set.
  pendingNote: '[Project enquiry link to be connected]',
}

export const CONTACT = {
 // email: { label: '[Contact Email]', href: null },
    email: { label: 'agrawalabhishek723@gmail.com', href: 'mailto:agrawalabhishek723@gmail.com' },
  socials: [
    { id: 'instagram', label: 'Instagram', href: null, placeholder: '[Instagram URL]' },
    { id: 'linkedin', label: 'LinkedIn', href: null, placeholder: '[LinkedIn URL]' },
  ],
}

// Brand guidelines p.1 and p.14.
export const FOOTER = {
  tagline: 'Where brand becomes growth.',
  origin: 'Built in India · Made for the world',
  year: 2026,
}
