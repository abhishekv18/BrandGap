/** Chapter marker used at the top of each section: "II — The gap". tone="light" for dark grounds. */
export function SectionLabel({ numeral, name, tone = 'dark', className = '', ...rest }) {
  const light = tone === 'light'
  return (
    <p {...rest} className={`label flex items-center justify-center gap-3 text-center xs:gap-4 md:justify-start md:text-left ${light ? 'text-cream' : 'text-ink-muted'} ${className}`}>
      {numeral && <span className={`shrink-0 ${light ? 'text-cream' : 'text-terracotta'}`}>{numeral}</span>}
      {/* Under 375px the rule steps aside so longer names stay on one line */}
      <span aria-hidden className={`h-px w-10 shrink-0 bg-current opacity-40 ${numeral ? 'hidden xs:block' : ''}`} />
      {name}
    </p>
  )
}
