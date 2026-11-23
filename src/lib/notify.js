import { proposalData } from '../config/proposalData'

// Quietly tells /api/notify what happened. Never shows anything to her, never throws.
const sent = new Set()
export function notify(event, detail = {}, { once = true } = {}) {
  if (!proposalData.notify?.enabled) return
  if (once && sent.has(event)) return
  sent.add(event)
  const body = JSON.stringify({ event, detail })
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/notify', new Blob([body], { type: 'application/json' }))
    } else {
      fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {})
    }
  } catch { /* ignore */ }
}
