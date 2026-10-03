/**
 * Analytics & tracking (brief §9.5): GA4, Meta Pixel, Microsoft Clarity and
 * UTM handling. Nothing loads until
 *   1. an ID is set in .env (VITE_GA4_ID, VITE_META_PIXEL_ID, VITE_CLARITY_ID), and
 *   2. the visitor accepts analytics cookies (components/CookieConsent.jsx).
 *
 * Meta Conversions API runs server-side: every tracked event carries an
 * `event_id`, and lead submissions send the same id to the lead endpoint, so
 * the server can forward it to CAPI and Meta can de-duplicate pixel + server events.
 */
const IDS = {
  ga4: import.meta.env.VITE_GA4_ID || '',
  metaPixel: import.meta.env.VITE_META_PIXEL_ID || '',
  clarity: import.meta.env.VITE_CLARITY_ID || '',
}

export const analyticsConfigured = Object.values(IDS).some(Boolean)

const CONSENT_KEY = 'bg-consent'
const UTM_KEY = 'bg-utm'
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']

// Meta standard events for the conversions that matter; everything else is custom.
const META_STANDARD = { form_submit: 'Lead', calendar_booking: 'Schedule', whatsapp_click: 'Contact' }

const store = (kind) => {
  try {
    return kind === 'session' ? window.sessionStorage : window.localStorage
  } catch {
    return null
  }
}

/* ---------- Consent ---------- */

export function getConsent() {
  try {
    return store('local')?.getItem(CONSENT_KEY) ?? null
  } catch {
    return null
  }
}

export function setConsent(value) {
  try {
    store('local')?.setItem(CONSENT_KEY, value)
  } catch {
    /* storage blocked — the choice simply isn't remembered */
  }
  if (value === 'granted') initAnalytics()
}

/* ---------- UTM (first touch, per session) ---------- */

export function captureUtm() {
  const params = new URLSearchParams(window.location.search)
  const found = {}
  UTM_PARAMS.forEach((key) => {
    const value = params.get(key)
    if (value) found[key] = value
  })
  if (!Object.keys(found).length) return
  try {
    const s = store('session')
    if (s && !s.getItem(UTM_KEY)) s.setItem(UTM_KEY, JSON.stringify({ ...found, landing_page: window.location.pathname }))
  } catch {
    /* ignore */
  }
}

export function getUtm() {
  try {
    return JSON.parse(store('session')?.getItem(UTM_KEY) ?? 'null') ?? {}
  } catch {
    return {}
  }
}

/* ---------- Loading ---------- */

let started = false

function addScript(src) {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

export function initAnalytics() {
  if (started || !analyticsConfigured || getConsent() !== 'granted') return
  started = true
  window.dataLayer = window.dataLayer || []

  if (IDS.ga4) {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    // Page views are sent on route change (see trackPageView).
    window.gtag('config', IDS.ga4, { send_page_view: false })
    addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(IDS.ga4)}`)
  }

  if (IDS.metaPixel) {
    const fbq = function fbq() {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments)
    }
    fbq.push = fbq
    fbq.loaded = true
    fbq.version = '2.0'
    fbq.queue = []
    window.fbq = window._fbq = fbq
    addScript('https://connect.facebook.net/en_US/fbevents.js')
    window.fbq('init', IDS.metaPixel)
  }

  if (IDS.clarity) {
    window.clarity =
      window.clarity ||
      function clarity() {
        ;(window.clarity.q = window.clarity.q || []).push(arguments)
      }
    addScript(`https://www.clarity.ms/tag/${encodeURIComponent(IDS.clarity)}`)
  }

  trackPageView(window.location.pathname)
}

/* ---------- Events ---------- */

export const newEventId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`

export function trackPageView(path) {
  if (!started) return
  window.gtag?.('event', 'page_view', { page_path: path, page_location: window.location.href })
  window.fbq?.('track', 'PageView')
}

/**
 * Track a conversion event. Names used across the site:
 * cta_click, form_submit, quiz_start, quiz_complete, whatsapp_click,
 * calendar_booking, case_study_view, newsletter_signup, exit_intent_shown.
 */
export function track(event, params = {}) {
  const payload = { ...params, ...getUtm(), event_id: params.event_id ?? newEventId() }
  window.dataLayer?.push({ event, ...payload })
  if (!started) return
  window.gtag?.('event', event, payload)
  const standard = META_STANDARD[event]
  if (standard) window.fbq?.('track', standard, payload, { eventID: payload.event_id })
  else window.fbq?.('trackCustom', event, payload, { eventID: payload.event_id })
  window.clarity?.('event', event)
}
