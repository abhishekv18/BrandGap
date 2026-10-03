import { getUtm, newEventId, track } from './analytics'

/**
 * Lead handling (brief §9.6). Form, quiz, audit and newsletter submissions are
 * POSTed as JSON to VITE_LEADS_ENDPOINT — e.g. a Google Apps Script web app
 * writing to a Sheet, or a CRM webhook — which should also send the
 * email/WhatsApp notification. The body is sent as text/plain so Apps Script
 * accepts it without a CORS preflight.
 *
 * While no endpoint is set, nothing is sent and the UI says so.
 */
const ENDPOINT = import.meta.env.VITE_LEADS_ENDPOINT || ''

export const leadsConnected = Boolean(ENDPOINT)

/** @returns {Promise<{ ok: boolean, pending?: boolean }>} */
export async function submitLead(type, data) {
  const eventId = newEventId()
  if (!ENDPOINT) {
    track('form_submit', { form: type, status: 'not_connected', event_id: eventId })
    return { ok: false, pending: true }
  }
  const body = {
    type,
    data,
    utm: getUtm(),
    page: window.location.pathname,
    eventId,
    submittedAt: new Date().toISOString(),
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
    })
    track('form_submit', { form: type, status: res.ok ? 'ok' : 'error', event_id: eventId })
    return { ok: res.ok }
  } catch {
    track('form_submit', { form: type, status: 'error', event_id: eventId })
    return { ok: false }
  }
}
