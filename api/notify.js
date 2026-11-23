// Vercel serverless function: forwards what Mahi does on the site to your Telegram.
// Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel → Project → Settings → Environment Variables.
const MESSAGES = {
  opened: () => '👀 Mahi opened the website and pressed the heart.',
  question: () => '💍 She reached the question page. Any second now...',
  think: () => '🤔 She tapped "Let me think..."',
  no: (d) => `🙈 She tried to press No (${d.tries} ${d.tries === 1 ? 'try' : 'tries'}). The button ran away.`,
  yes: (d) => `❤️ SHE SAID YES! ❤️${d.noTries ? `\n(after trying No ${d.noTries} times 😄)` : ''}`,
  whatsapp: () => '💌 She tapped "Send him my answer" on WhatsApp.',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false })
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return res.status(200).json({ ok: false, reason: 'not configured' })

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  const { event, detail = {} } = body || {}
  const make = MESSAGES[event]
  if (!make) return res.status(400).json({ ok: false })

  const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })
  const device = String(req.headers['user-agent'] || '').match(/iPhone|Android|iPad|Windows|Macintosh/)?.[0] || 'unknown device'
  const text = `${make(detail)}\n\n🕒 ${time} · 📱 ${device}`

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })
    return res.status(200).json({ ok: r.ok })
  } catch {
    return res.status(200).json({ ok: false })
  }
}
