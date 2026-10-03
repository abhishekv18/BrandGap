/** True for "[Like This]" — content still waiting for the client. */
export const isPlaceholder = (value) => typeof value === 'string' && /^\[.*\]$/.test(value.trim())

const TONES = {
  dark: 'text-ink-muted',
  light: 'text-cream/75',
  inherit: '',
}

/**
 * Renders a content value. Placeholders get a quiet dotted underline so they
 * are obvious in review but don't break the composition.
 * tone: 'dark' on cream grounds, 'light' on ink/terracotta, 'inherit' to keep the parent colour.
 */
export function Copy({ value, className = '', tone = 'dark' }) {
  if (!isPlaceholder(value)) return <span className={className}>{value}</span>
  return (
    <span
      className={`${TONES[tone]} underline decoration-dotted decoration-1 underline-offset-[0.2em] ${className}`}
      title="Placeholder — replace with client content"
    >
      {value}
    </span>
  )
}
