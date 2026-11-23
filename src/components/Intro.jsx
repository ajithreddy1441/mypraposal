import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { proposalData } from '../config/proposalData'
import Heart from './Heart'

const HOLD_MS = 2200
const HEART_PATH =
  'M12 21.35 10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35z'

/* ---------------- Phase 1: developer terminal ---------------- */
function Terminal({ onDone }) {
  const { terminalTitle, lines } = proposalData.intro
  const [shown, setShown] = useState([]) // fully printed lines
  const [typing, setTyping] = useState('') // current cmd being typed
  const skipRef = useRef(false)
  const bodyRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    const wait = (ms) => new Promise((r) => setTimeout(r, skipRef.current ? 0 : ms))
    ;(async () => {
      await wait(700)
      for (const line of lines) {
        if (cancelled) return
        if (line.type === 'cmd') {
          for (let i = 1; i <= line.text.length; i++) {
            if (cancelled) return
            setTyping(line.text.slice(0, i))
            await wait(38 + Math.random() * 40)
          }
          await wait(280)
          setTyping('')
        } else {
          await wait(line.type === 'ok' ? 700 : 260)
        }
        setShown((s) => [...s, line])
      }
      await wait(1300)
      if (!cancelled) onDone()
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [shown, typing])

  const color = { cmd: 'text-lavender-soft', out: 'text-lavender/60', warn: 'text-champagne', ok: 'text-heart-soft' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => (skipRef.current = true)}
      className="w-full max-w-lg overflow-hidden rounded-2xl border border-lavender/20 bg-[#0d0919]/90 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),0_0_60px_-20px_rgba(187,166,217,0.4)] backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        <span className="ml-2 truncate font-mono text-[11px] text-lavender/50">{terminalTitle}</span>
      </div>
      <div ref={bodyRef} className="h-[340px] overflow-hidden px-4 py-4 font-mono text-[12.5px] leading-6 sm:text-[13.5px]">
        {shown.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${color[l.type]} whitespace-pre-wrap break-words`}
          >
            {l.type === 'cmd' && <span className="text-heart">❯ </span>}
            {l.text}
          </motion.div>
        ))}
        <div className="text-lavender-soft">
          <span className="text-heart">❯ </span>
          {typing}
          <span className="caret ml-0.5 inline-block h-4 w-2 translate-y-[3px] bg-lavender-soft/80" />
        </div>
      </div>
      <div className="border-t border-white/5 px-4 py-2 text-right font-mono text-[10px] text-lavender/30">tap to skip</div>
    </motion.div>
  )
}

/* ---------------- Phase 2: hold the heart ---------------- */
function HoldHeart({ onComplete, onFirstTouch }) {
  const { holdText, holdSubtext, holdingText } = proposalData.intro
  const [progress, setProgress] = useState(0)
  const [holding, setHolding] = useState(false)
  const holdingRef = useRef(false)
  const progRef = useRef(0)
  const doneRef = useRef(false)
  const touchedRef = useRef(false)

  useEffect(() => {
    let raf
    let last = performance.now()
    const tick = (t) => {
      const dt = t - last
      last = t
      if (!doneRef.current) {
        const p = progRef.current + (holdingRef.current ? dt / HOLD_MS : -dt / (HOLD_MS / 2.5))
        progRef.current = Math.max(0, Math.min(1, p))
        setProgress(progRef.current)
        if (progRef.current >= 1) {
          doneRef.current = true
          navigator.vibrate?.([30, 60, 60])
          onComplete()
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const start = (e) => {
    e.preventDefault()
    if (!touchedRef.current) { touchedRef.current = true; onFirstTouch?.() }
    holdingRef.current = true
    setHolding(true)
  }
  const stop = () => { holdingRef.current = false; setHolding(false) }

  const R = 92
  const C = 2 * Math.PI * R

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-10 max-w-xs font-serif text-3xl italic leading-tight text-gradient sm:text-4xl"
      >
        {holdText}
      </motion.p>

      <button
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && start(e)}
        onKeyUp={stop}
        aria-label="Press and hold the heart"
        className="no-callout relative flex h-[220px] w-[220px] items-center justify-center rounded-full outline-none"
      >
        {/* glow */}
        <div
          className="absolute inset-0 rounded-full blur-3xl transition-opacity"
          style={{ background: 'radial-gradient(circle, rgba(224,67,92,0.55), transparent 65%)', opacity: 0.35 + progress * 0.65 }}
        />
        {/* progress ring */}
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 220 220">
          <circle cx="110" cy="110" r={R} fill="none" stroke="rgba(200,162,200,0.15)" strokeWidth="2" />
          <circle
            cx="110" cy="110" r={R} fill="none" stroke="url(#ring)" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - progress)}
          />
          <defs>
            <linearGradient id="ring" x1="0" x2="1">
              <stop offset="0%" stopColor="#E0435C" />
              <stop offset="100%" stopColor="#E2C07E" />
            </linearGradient>
          </defs>
        </svg>

        {/* heart that fills from the bottom */}
        <div className={holding ? '' : 'heartbeat'} style={{ transform: `scale(${1 + progress * 0.25})`, transition: 'transform 0.1s' }}>
          <svg width="120" height="120" viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 ${10 + progress * 25}px rgba(224,67,92,0.8))` }}>
            <defs>
              <clipPath id="heart-fill">
                <rect x="0" y={24 - 24 * (0.12 + progress * 0.88)} width="24" height="24" />
              </clipPath>
              <linearGradient id="heart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5C7A" />
                <stop offset="100%" stopColor="#C8102E" />
              </linearGradient>
            </defs>
            <path d={HEART_PATH} fill="none" stroke="#FF8FA3" strokeWidth="0.6" />
            <path d={HEART_PATH} fill="url(#heart-grad)" clipPath="url(#heart-fill)" />
          </svg>
        </div>
      </button>

      <AnimatePresence mode="wait">
        <motion.p
          key={holding ? 'h' : 'n'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-10 text-sm tracking-wide text-lavender/70"
        >
          {holding ? holdingText : holdSubtext}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  )
}

/* ---------------- Phase 3: heart burst ---------------- */
function Burst() {
  const pieces = Array.from({ length: 34 }, (_, i) => {
    const a = (i / 34) * Math.PI * 2
    const dist = 160 + Math.random() * 260
    return { i, x: Math.cos(a) * dist, y: Math.sin(a) * dist, s: 14 + Math.random() * 26, r: (Math.random() - 0.5) * 120 }
  })
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        className="absolute h-10 w-10 rounded-full"
        style={{ background: 'radial-gradient(circle, #fff 0%, #ffd6dd 25%, rgba(224,67,92,0.6) 50%, rgba(9,6,18,0) 72%)' }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 90, opacity: [1, 1, 0] }}
        transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
      />
      {pieces.map((p) => (
        <motion.div
          key={p.i}
          className="absolute"
          initial={{ x: 0, y: 0, scale: 0.2, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, scale: 1, opacity: 0, rotate: p.r }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
          <Heart size={p.s} color={p.i % 3 ? '#E0435C' : '#E2C07E'} />
        </motion.div>
      ))}
    </div>
  )
}

export default function Intro({ onEnter, onFirstTouch }) {
  const [phase, setPhase] = useState('terminal')

  const complete = () => {
    setPhase('burst')
    setTimeout(onEnter, 1300)
  }

  return (
    <motion.section
      className="fixed inset-0 z-40 flex items-center justify-center px-5"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <AnimatePresence mode="wait">
        {phase === 'terminal' && <Terminal key="t" onDone={() => setPhase('heart')} />}
        {phase === 'heart' && <HoldHeart key="h" onComplete={complete} onFirstTouch={onFirstTouch} />}
      </AnimatePresence>
      {phase === 'burst' && <Burst />}
    </motion.section>
  )
}
