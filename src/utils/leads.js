import { getUtm, newEventId, track } from './analytics'

/**
 * Lead handling (brief §9.6). Every form — contact, call requests, newsletter,
 * free audit, Gap Score — goes through submitLead(). Two ways to receive them:
 *
 *   VITE_WEB3FORMS_KEY   → each submission arrives as an email (web3forms.com;
 *                          the key is public by design and only sends to the
 *                          address it was created for).
 *   VITE_LEADS_ENDPOINT  → POSTed as JSON to your own endpoint (Apps Script,
 *                          CRM webhook…), sent as text/plain to avoid a CORS
 *                          preflight.
 *
 * If both are set, email wins. While neither is set, nothing is sent and the UI says so.
 */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || ''
const ENDPOINT = import.meta.env.VITE_LEADS_ENDPOINT || ''

export const leadsConnected = Boolean(WEB3FORMS_KEY || ENDPOINT)

/** Email subject per form. */
const SUBJECTS = {
  'project-enquiry': 'New project enquiry',
  'call-request': 'New call request',
  newsletter: 'New newsletter sign-up',
  'free-audit': 'New free audit request',
  'gap-score': 'New Gap Score lead',
}

/** Readable names for the fields, so the email reads like a note rather than a data dump. */
const LABELS = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone / WhatsApp',
  brand: 'Brand / website',
  stage: 'Brand stage',
  service: 'Service needed',
  budget: 'Monthly budget',
  message: 'Biggest gap to close',
  callName: 'Name',
  callContact: 'Phone or email',
  contact: 'Phone or email',
  day: 'Preferred day',
  time: 'Time of day',
  timezone: 'Time zone',
  company: 'Company / brand',
  website: 'Website',
}

const label = (key) => LABELS[key] ?? key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ').replace(/^./, (c) => c.toUpperCase())

/** One submission as a Web3Forms email: subject, reply-to the lead, then the answers. */
function emailBody(type, data) {
  const fields = {}
  Object.entries(data).forEach(([key, value]) => {
    const text = typeof value === 'object' ? JSON.stringify(value) : String(value ?? '').trim()
    if (text) fields[label(key)] = text
  })
  const utm = getUtm()
  const replyTo = data.email || (/@/.test(data.callContact ?? data.contact ?? '') ? data.callContact ?? data.contact : undefined)
  return {
    access_key: WEB3FORMS_KEY,
    subject: `${SUBJECTS[type] ?? `New ${type}`} — BrandGap website`,
    from_name: 'BrandGap website',
    ...(replyTo ? { replyto: replyTo } : {}),
    ...fields,
    Page: window.location.href,
    ...(utm && Object.keys(utm).length ? { Campaign: Object.entries(utm).map(([k, v]) => `${k}=${v}`).join(' · ') } : {}),
  }
}

/** @returns {Promise<{ ok: boolean, pending?: boolean }>} */
export async function submitLead(type, data) {
  const eventId = newEventId()
  if (!leadsConnected) {
    track('form_submit', { form: type, status: 'not_connected', event_id: eventId })
    return { ok: false, pending: true }
  }
  try {
    const res = WEB3FORMS_KEY
      ? await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(emailBody(type, data)),
        })
      : await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ type, data, utm: getUtm(), page: window.location.pathname, eventId, submittedAt: new Date().toISOString() }),
        })
    // Web3Forms answers 200 with { success: false } when something is wrong (e.g. a bad key).
    const ok = res.ok && (!WEB3FORMS_KEY || (await res.json().catch(() => ({}))).success !== false)
    track('form_submit', { form: type, status: ok ? 'ok' : 'error', event_id: eventId })
    return { ok }
  } catch {
    track('form_submit', { form: type, status: 'error', event_id: eventId })
    return { ok: false }
  }
}
