/**
 * ROAS / growth calculator — standard arithmetic on the visitor's own inputs.
 * Not a forecast and not a BrandGap result; confirm the formula with the
 * BrandGap team before launch (data/tools.js → ROAS_CALCULATOR.confirmed).
 *
 *   clicks          = ad spend ÷ cost per click
 *   orders          = clicks × conversion rate
 *   revenue         = orders × AOV
 *   ROAS            = revenue ÷ ad spend
 *   break-even ROAS = 1 ÷ gross margin
 *
 * Each output is null until the inputs it needs are present and positive.
 */
export function calculateRoas({ adSpend, aov, conversionRate, cpc, margin }) {
  const n = (v) => {
    const x = Number(v)
    return Number.isFinite(x) && x > 0 ? x : null
  }
  const spend = n(adSpend)
  const value = n(aov)
  const rate = n(conversionRate)
  const click = n(cpc)
  const gm = n(margin)

  const orders = spend && click && rate ? (spend / click) * (rate / 100) : null
  const revenue = orders && value ? orders * value : null
  return {
    orders,
    revenue,
    roas: revenue && spend ? revenue / spend : null,
    breakEvenRoas: gm && gm <= 100 ? 100 / gm : null,
  }
}
