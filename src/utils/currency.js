/**
 * Money shown in the visitor's currency.
 *
 * Every figure on the site is recorded in Indian rupees (Meta Ads Manager accounts are billed
 * in INR). Visitors in India see them exactly as recorded. Elsewhere they are converted at the
 * fixed reference rates below and shown in USD, EUR or GBP, with a note in the footer saying so.
 *
 * The currency is chosen once, from the browser's time zone (a good proxy for region that needs
 * no permission). `?currency=usd|eur|gbp|inr` overrides it, and is remembered for the visit.
 */

/** Rupees per unit of each currency. Reference rates — update here when they drift. */
export const RATES = { INR: 1, USD: 88, EUR: 102, GBP: 117 }
export const RATES_NOTE = 'reference rates: $1 = ₹88, €1 = ₹102, £1 = ₹117'

const SYMBOL = { INR: '₹', USD: '$', EUR: '€', GBP: '£' }

function detect() {
  if (typeof window === 'undefined') return 'INR'
  try {
    const forced = new URLSearchParams(window.location.search).get('currency')?.toUpperCase()
    if (forced && RATES[forced]) {
      sessionStorage.setItem('bg-currency', forced)
      return forced
    }
    const kept = sessionStorage.getItem('bg-currency')
    if (kept && RATES[kept]) return kept
  } catch {
    /* storage unavailable: fall through to the time zone */
  }
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
  if (zone === 'Asia/Kolkata' || zone === 'Asia/Calcutta') return 'INR'
  if (zone === 'Europe/London') return 'GBP'
  if (zone.startsWith('Europe/')) return 'EUR'
  if (!zone) return 'INR'
  return 'USD'
}

export const CURRENCY = detect()
export const SYMBOL_NOW = SYMBOL[CURRENCY]
export const isLocal = CURRENCY === 'INR'

const trim = (n, d) => Number(n.toFixed(d)).toLocaleString('en-US', { maximumFractionDigits: d })

/**
 * A rupee amount in the visitor's currency.
 * exact: a precise figure (tables, e.g. ₹37,64,141.80) — shown in full, with cents if it had paise.
 * Otherwise compact, like the source's L/Cr shorthand: $42.8K, $1.91M.
 */
export function fromRupees(rupees, { exact = false, decimals = 2 } = {}) {
  const v = rupees / RATES[CURRENCY]
  const s = SYMBOL[CURRENCY]
  if (exact) return s + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  if (v >= 1e6) return `${s}${trim(v / 1e6, 2)}M`
  if (v >= 1e3) return `${s}${trim(v / 1e3, v >= 1e5 ? 0 : 1)}K`
  return `${s}${trim(v, v < 10 ? 2 : 0)}`
}

const UNIT = { Cr: 1e7, L: 1e5, K: 1e3 }
const AMOUNT = /₹\s?(\d[\d,]*(?:\.\d+)?)(\s?(?:Cr|L|K)(?![a-z]))?/g

/** Rewrites every rupee amount inside a piece of text ("₹37.64L+ spend") for the visitor. */
export function localize(text) {
  if (isLocal || typeof text !== 'string' || !text.includes('₹')) return text
  return text.replace(AMOUNT, (_, num, unit) => {
    const n = Number(num.replace(/,/g, ''))
    if (unit) return fromRupees(n * UNIT[unit.trim()])
    const decimals = num.includes('.') ? 2 : 0
    // Indian-grouped or precise figures are exact; small plain ones (₹130.28 CPM) read best exact too.
    return fromRupees(n, { exact: true, decimals })
  })
}

/** Localizes every string in a data structure (objects and arrays), leaving everything else as is. */
export function localizeDeep(data) {
  if (isLocal) return data
  if (typeof data === 'string') return localize(data)
  if (Array.isArray(data)) return data.map(localizeDeep)
  if (data && typeof data === 'object' && Object.getPrototypeOf(data) === Object.prototype) {
    return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, localizeDeep(v)]))
  }
  return data
}

/** A count-up figure { value, prefix, suffix, decimals } recorded in rupees, in the visitor's currency. */
export function localizeKpi(k) {
  if (isLocal || k.prefix !== '₹') return k
  const m = localize(`₹${k.value}${(k.suffix || '').replace(/\+$/, '')}`).match(/^(\D*)([\d,]*\.?\d+)(.*)$/)
  if (!m) return k
  const [, prefix, num, unit] = m
  return { ...k, prefix, value: Number(num.replace(/,/g, '')), suffix: unit + (k.suffix?.endsWith('+') ? '+' : ''), decimals: num.includes('.') ? num.split('.')[1].length : 0 }
}
