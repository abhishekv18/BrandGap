/**
 * A row of filters (industry on /work, category on /insights). Buttons with
 * aria-pressed; the count makes empty filters honest before they're chosen.
 */
export function FilterChips({ label, options, value, onChange, counts = {} }) {
  const all = [{ id: 'all', label: 'All' }, ...options.map((o) => ({ id: o, label: o }))]
  return (
    <div role="group" aria-label={label} className="flex flex-wrap justify-center gap-2 md:justify-start">
      {all.map((o) => {
        const on = value === o.id
        const count = o.id === 'all' ? counts.all : counts[o.id]
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.id)}
            className={`label inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[0.6875rem] transition-colors duration-300 ${
              on ? 'border-ink bg-ink text-cream' : 'border-line text-ink hover:border-terracotta hover:text-terracotta'
            }`}
          >
            {o.label}
            {count !== undefined && <span className={`tabular-nums ${on ? 'text-cream/70' : 'text-ink-muted'}`}>{count}</span>}
          </button>
        )
      })}
    </div>
  )
}
