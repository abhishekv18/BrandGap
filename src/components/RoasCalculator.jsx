import { useMemo, useState } from 'react'
import { ROAS_CALCULATOR } from '../data/tools'
import { calculateRoas } from '../utils/roas'

const inr = (v, digits = 0) => v.toLocaleString('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: digits })

/**
 * ROAS / growth calculator (brief §6). Live arithmetic on the visitor's own
 * inputs — clearly framed as an estimate, never as a BrandGap result.
 */
export function RoasCalculator() {
  const [values, setValues] = useState({})
  const out = useMemo(() => calculateRoas(values), [values])
  const set = (id) => (e) => setValues((v) => ({ ...v, [id]: e.target.value }))

  const results = [
    { id: 'revenue', label: 'Estimated revenue', value: out.revenue != null ? `₹${inr(out.revenue)}` : null },
    { id: 'roas', label: 'Estimated ROAS', value: out.roas != null ? `${inr(out.roas, 2)}X` : null },
    { id: 'orders', label: 'Estimated orders', value: out.orders != null ? inr(out.orders) : null },
    { id: 'breakEven', label: 'Break-even ROAS', value: out.breakEvenRoas != null ? `${inr(out.breakEvenRoas, 2)}X` : null },
  ]
  const healthy = out.roas != null && out.breakEvenRoas != null ? out.roas >= out.breakEvenRoas : null

  return (
    <div className="grid gap-px bg-line md:grid-cols-2">
      <form onSubmit={(e) => e.preventDefault()} aria-label="Calculator inputs" className="grid gap-6 bg-cream py-8 md:pr-10">
        {ROAS_CALCULATOR.inputs.map((input) => (
          <div key={input.id} className="flex flex-col text-left">
            <label htmlFor={`roas-${input.id}`} className="label text-[0.6875rem] text-ink-soft">
              {input.label}
            </label>
            <div className="flex items-baseline gap-2 border-b border-ink/25 focus-within:border-terracotta">
              {input.prefix && <span className="text-ink-muted">{input.prefix}</span>}
              <input
                id={`roas-${input.id}`}
                type="number"
                inputMode="decimal"
                min="0"
                step={input.step}
                placeholder={input.placeholder}
                value={values[input.id] ?? ''}
                onChange={set(input.id)}
                className="w-full bg-transparent py-3 text-lg tabular-nums outline-none placeholder:text-ink-muted/60"
              />
              {input.suffix && <span className="text-ink-muted">{input.suffix}</span>}
            </div>
          </div>
        ))}
      </form>

      <div className="flex flex-col bg-ink p-6 text-cream md:p-10" data-theme="dark">
        <p className="label text-[0.6875rem] text-blush">Estimate</p>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8" aria-live="polite">
          {results.map((r) => (
            <div key={r.id} className="flex flex-col-reverse justify-end gap-2">
              <dt className="label text-[0.6875rem] text-cream/65">{r.label}</dt>
              <dd className="font-display text-[clamp(1.5rem,1rem+1.6vw,2.5rem)] leading-none tabular-nums">{r.value ?? '—'}</dd>
            </div>
          ))}
        </dl>
        {healthy !== null && (
          <p className="mt-8 border-t border-line-light pt-5 font-display text-xl italic">
            {healthy ? 'Above break-even on these numbers.' : 'Below break-even on these numbers.'}
          </p>
        )}
        <p className="mt-auto pt-8 text-xs text-cream/65">{ROAS_CALCULATOR.note}</p>
      </div>
    </div>
  )
}
