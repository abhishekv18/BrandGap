/** True for "[Like This]" — content still waiting for the client. */
export const isPlaceholder = (value) => typeof value === 'string' && /^\[.*\]$/.test(value.trim())

/**
 * Renders a content value. Placeholders get a quiet dotted underline so they
 * are obvious in review but don't break the composition.
 */
export function Copy({ value, className = '' }) {
  if (!isPlaceholder(value)) return <span className={className}>{value}</span>
  return (
    <span
      className={`text-ink-muted underline decoration-dotted decoration-1 underline-offset-[0.2em] ${className}`}
      title="Placeholder — replace with client content"
    >
      {value}
    </span>
  )
}
