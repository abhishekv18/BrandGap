/**
 * A contact detail on a dark or terracotta ground. With an href it is a real
 * link; without one it renders as a clearly marked placeholder.
 */
export function ContactLink({ label, href, placeholder, className = '' }) {
  if (href) {
    const external = /^https?:/.test(href)
    return (
      <a
        href={href}
        className={`underline-offset-4 transition-opacity hover:underline hover:opacity-80 ${className}`}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {label}
      </a>
    )
  }
  return (
    <span className={`underline decoration-dotted decoration-1 underline-offset-4 ${className}`} title={placeholder ? `Placeholder — ${placeholder}` : 'Placeholder — link to be added'}>
      {label}
    </span>
  )
}
