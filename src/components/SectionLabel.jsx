/** Chapter marker used at the top of each section: "II — The gap". tone="light" for dark grounds. */
export function SectionLabel({ numeral, name, tone = 'dark', className = '', ...rest }) {
  const light = tone === 'light'
  return (
    <p {...rest} className={`label flex items-center justify-center gap-4 md:justify-start ${light ? 'text-cream' : 'text-ink-muted'} ${className}`}>
      {numeral && <span className={light ? 'text-cream' : 'text-terracotta'}>{numeral}</span>}
      <span aria-hidden className="h-px w-10 bg-current opacity-40" />
      {name}
    </p>
  )
}
