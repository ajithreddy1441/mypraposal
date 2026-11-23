import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Heart from './Heart'

/*
  The "No" button that can never be pressed.

  - Mouse / trackpad: it watches the pointer across the whole window and jumps away
    *before* the cursor reaches it (it even predicts where a fast-moving cursor is heading).
  - Touch: it escapes the instant a finger lands on it, so a tap never registers.
  - Keyboard: Enter / Space just make it run too.
  - It never lands on top of the "Yes" button, the music toggle or the bottom nav.
  - Every escape changes its text, it slowly shrinks, and every few tries it teleports
    with a little "poof" instead of sliding.
  - Once it has escaped it is rendered in a portal on <body>, so blurred / transformed
    parents can't trap it inside the card.
*/

const TRIGGER_DIST = 85 // px between cursor and button edge that makes it run
const LOOKAHEAD_MS = 90 // how far ahead we predict a moving cursor
const SAFE_TOP = 76 // keep clear of the music toggle / progress bar
const SAFE_BOTTOM = 100 // keep clear of the bottom navigation
const MARGIN = 14

function distToRect(px, py, r) {
  const dx = Math.max(r.left - px, 0, px - r.right)
  const dy = Math.max(r.top - py, 0, py - r.bottom)
  return Math.hypot(dx, dy)
}

function overlaps(a, b, pad = 0) {
  return !(a.right + pad < b.left || a.left - pad > b.right || a.bottom + pad < b.top || a.top - pad > b.bottom)
}

export default function RunawayButton({ lines, toasts = {}, avoidRef, onAttempt, className = '' }) {
  const slotRef = useRef(null)
  const btnRef = useRef(null)
  const [pos, setPos] = useState(null) // {x, y} once it has escaped (fixed, viewport coords)
  const [start, setStart] = useState(null) // where the first escape animates from
  const [count, setCount] = useState(0)
  const [teleport, setTeleport] = useState(false)
  const [tilt, setTilt] = useState(0)
  const [poofs, setPoofs] = useState([])
  const [toast, setToast] = useState(null)

  const posRef = useRef(null)
  const countRef = useRef(0)
  const lastFlee = useRef(0)
  const lastPointer = useRef(null)

  // Current on-screen rectangle (uses the *target* position, so it reacts even mid-animation)
  const currentRect = useCallback(() => {
    if (!posRef.current) return slotRef.current?.getBoundingClientRect() ?? null
    const el = btnRef.current
    const w = el?.offsetWidth ?? 120
    const h = el?.offsetHeight ?? 52
    const { x, y } = posRef.current
    return { left: x, top: y, right: x + w, bottom: y + h, width: w, height: h }
  }, [])

  const flee = useCallback(
    (px, py) => {
      const now = performance.now()
      if (now - lastFlee.current < 180) return
      lastFlee.current = now

      const from = currentRect()
      if (!from) return
      const w = Math.max(from.width, 110)
      const h = Math.max(from.height, 48)
      const vw = window.innerWidth
      const vh = window.innerHeight
      const minY = Math.min(SAFE_TOP, vh * 0.12)
      const maxY = Math.max(minY + 1, vh - h - Math.min(SAFE_BOTTOM, vh * 0.16))
      const maxX = Math.max(MARGIN + 1, vw - w - MARGIN)

      const avoid = avoidRef?.current?.getBoundingClientRect()
      const ptr = px == null ? { x: from.left + w / 2, y: from.top + h / 2 } : { x: px, y: py }
      const minJump = Math.min(Math.max(vw, vh) * 0.28, 260)

      let best = null
      let bestScore = -Infinity
      for (let i = 0; i < 60; i++) {
        const x = MARGIN + Math.random() * (maxX - MARGIN)
        const y = minY + Math.random() * (maxY - minY)
        const r = { left: x, top: y, right: x + w, bottom: y + h }
        if (avoid && overlaps(r, avoid, 22)) continue
        const dPtr = Math.hypot(x + w / 2 - ptr.x, y + h / 2 - ptr.y)
        const dMove = Math.hypot(x - from.left, y - from.top)
        if (dMove < minJump * 0.6) continue
        // far from the cursor is good, but cap it so it doesn't always hug the corners
        const score = Math.min(dPtr, 480) + Math.random() * 160
        if (score > bestScore) { bestScore = score; best = { x, y } }
      }
      if (!best) best = { x: MARGIN + Math.random() * (maxX - MARGIN), y: minY + Math.random() * (maxY - minY) }

      const next = countRef.current + 1
      countRef.current = next

      if (!posRef.current) setStart({ x: from.left, y: from.top })
      const isTeleport = next > 2 && next % 4 === 0
      if (isTeleport) {
        const id = now
        setPoofs((p) => [...p, { id, x: from.left + w / 2, y: from.top + h / 2 }])
        setTimeout(() => setPoofs((p) => p.filter((q) => q.id !== id)), 900)
      }

      posRef.current = best
      setTeleport(isTeleport)
      setTilt((Math.random() - 0.5) * 16)
      setPos(best)
      setCount(next)
      onAttempt?.(next)
      navigator.vibrate?.(15)

      if (toasts[next]) {
        setToast({ id: now, text: toasts[next] })
      }
    },
    [avoidRef, currentRect, onAttempt, toasts],
  )

  // Watch the mouse everywhere, so it runs before it's even touched
  useEffect(() => {
    const onMove = (e) => {
      if (e.pointerType === 'touch') return
      const r = currentRect()
      if (!r) return
      const t = performance.now()
      let fx = e.clientX
      let fy = e.clientY
      const lp = lastPointer.current
      if (lp && t - lp.t < 80) {
        const k = LOOKAHEAD_MS / Math.max(t - lp.t, 8)
        fx = e.clientX + (e.clientX - lp.x) * k
        fy = e.clientY + (e.clientY - lp.y) * k
      }
      lastPointer.current = { x: e.clientX, y: e.clientY, t }
      const near = distToRect(e.clientX, e.clientY, r) < TRIGGER_DIST
      const heading = distToRect(fx, fy, r) < TRIGGER_DIST * 0.6
      if (near || heading) flee(e.clientX, e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [currentRect, flee])

  // Keep it inside the screen after resizes / text changes
  useLayoutEffect(() => {
    const clamp = () => {
      if (!posRef.current || !btnRef.current) return
      const w = btnRef.current.offsetWidth
      const h = btnRef.current.offsetHeight
      const x = Math.min(Math.max(MARGIN, posRef.current.x), window.innerWidth - w - MARGIN)
      const y = Math.min(Math.max(MARGIN, posRef.current.y), window.innerHeight - h - MARGIN)
      if (x !== posRef.current.x || y !== posRef.current.y) {
        posRef.current = { x, y }
        setPos({ x, y })
      }
    }
    clamp()
    window.addEventListener('resize', clamp)
    return () => window.removeEventListener('resize', clamp)
  }, [count])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  // walk through every line once, then keep cycling (skipping the plain "No")
  const label = count < lines.length ? lines[count] : lines[1 + ((count - 1) % (lines.length - 1))]
  const scale = Math.max(0.72, 1 - count * 0.025)

  // Shared handlers: a touch, a click or a key press only ever makes it run
  const handlers = {
    onPointerDown: (e) => { e.preventDefault(); flee(e.clientX, e.clientY) },
    onClick: (e) => {
      e.preventDefault()
      e.stopPropagation()
      // the pointerdown already moved it; only react here for clicks that skipped it
      if (performance.now() - lastFlee.current > 700) flee(e.clientX || null, e.clientY || null)
    },
    onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flee(null, null) } },
    onContextMenu: (e) => e.preventDefault(),
  }

  const btnClass = `no-callout select-none whitespace-nowrap rounded-full border border-lavender/30 bg-velvet-900/70 px-7 py-3.5 font-medium text-lavender-soft/90 backdrop-blur-md ${className}`

  return (
    <>
      {/* In the card until the first escape; afterwards an invisible placeholder keeps the layout steady */}
      <button
        ref={slotRef}
        type="button"
        aria-label="No"
        {...(pos ? { tabIndex: -1, 'aria-hidden': true } : handlers)}
        className={btnClass}
        style={{ visibility: pos ? 'hidden' : 'visible' }}
      >
        {lines[0]}
      </button>

      {createPortal(
        <>
          {pos && (
            <motion.button
              ref={btnRef}
              type="button"
              aria-label="No (good luck)"
              {...handlers}
              className={`${btnClass} fixed left-0 top-0 z-[65] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)]`}
              initial={start ? { x: start.x, y: start.y, scale: 1, rotate: 0 } : false}
              animate={{ x: pos.x, y: pos.y, scale, rotate: tilt, opacity: 1 }}
              transition={
                teleport
                  ? { x: { duration: 0 }, y: { duration: 0 }, scale: { type: 'spring', stiffness: 500, damping: 15 }, rotate: { duration: 0.3 } }
                  : { type: 'spring', stiffness: 420, damping: 26, mass: 0.7 }
              }
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={label}
                  className="inline-block"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  {label}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          )}

          {/* "poof" of hearts where it vanished from */}
          <AnimatePresence>
            {poofs.map((p) => (
              <div key={p.id} className="pointer-events-none fixed z-[64]" style={{ left: p.x, top: p.y }}>
                {Array.from({ length: 8 }).map((_, i) => {
                  const a = (i / 8) * Math.PI * 2
                  return (
                    <motion.div
                      key={i}
                      className="absolute"
                      initial={{ x: -6, y: -6, opacity: 1, scale: 0.6 }}
                      animate={{ x: Math.cos(a) * 46 - 6, y: Math.sin(a) * 46 - 6, opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                      <Heart size={12} color={i % 2 ? '#E2C07E' : '#E0435C'} />
                    </motion.div>
                  )
                })}
              </div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {toast && (
              <motion.div
                key={toast.id}
                className="pointer-events-none fixed inset-x-0 z-[66] flex justify-center px-5"
                style={{ bottom: 'calc(6.5rem + env(safe-area-inset-bottom))' }}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="glass rounded-full px-5 py-3 text-center text-sm text-lavender-soft">{toast.text}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body,
      )}
    </>
  )
}
