import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { proposalData } from '../config/proposalData'
import Heart from './Heart'
import RunawayButton from './RunawayButton'
import { notify } from '../lib/notify'

export default function ProposalCard({ onYes, onNoTry }) {
  const p = proposalData.proposal
  const [thinking, setThinking] = useState(false)
  const [tries, setTries] = useState(0)
  const yesRef = useRef(null)
  // Yes grows every time she tries No (less on phones, where the buttons are full-width)
  const narrow = typeof window !== 'undefined' && window.innerWidth < 640
  const yesScale = narrow ? 1 + Math.min(tries * 0.015, 0.07) : Math.min(1 + tries * 0.05, 1.45)

  return (
    <section className="flex min-h-[100dvh] items-center justify-center px-5 pb-28 pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-xl"
      >
        <motion.div
          className="absolute -inset-8 -z-10 rounded-[56px] bg-gradient-to-br from-heart/35 via-lavender-bright/15 to-champagne/30 blur-3xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3.2, repeat: Infinity }}
        />
        <div className="glass relative overflow-hidden px-6 py-14 text-center sm:px-12">
          {/* orbiting hearts */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-[88px]"
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: -i * (14 / 6) }}
              style={{ originX: 0, originY: 0 }}
            >
              <Heart size={10 + (i % 3) * 3} style={{ transform: 'translate(52px, 0)' }} className="opacity-70" />
            </motion.div>
          ))}
          <div className="heartbeat relative mx-auto mb-8 flex h-20 w-20 items-center justify-center">
            <Heart size={80} className="drop-shadow-[0_0_25px_rgba(224,67,92,0.9)]" />
          </div>

          <h2 className="font-serif text-[clamp(1.8rem,8vw,3rem)] font-medium leading-[1.12] text-gradient">{p.heading}</h2>
          <p className="mx-auto mt-5 max-w-sm text-[15px] leading-relaxed text-lavender-soft/70">{p.subtext}</p>

          <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <motion.button
              ref={yesRef}
              animate={{ scale: yesScale }}
              whileHover={{ scale: yesScale * 1.05 }}
              whileTap={{ scale: yesScale * 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              onClick={onYes}
              className="btn-love relative z-10"
            >
              <span className="relative z-10">{p.yesButton}</span>
              <span className="absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => { setThinking(true); notify('think') }} className="btn-glass">
              {p.thinkButton}
            </motion.button>
            <RunawayButton lines={p.noLines} toasts={p.noToasts} avoidRef={yesRef} onAttempt={(n) => { setTries(n); onNoTry?.(n); if (n === 1 || n % 5 === 0) notify('no', { tries: n }, { once: false }) }} />
          </div>
          {tries >= 2 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-xs tracking-wide text-lavender/50">
              {tries} tries... &ldquo;Yes&rdquo; chala easy ga dorukutundi 😌
            </motion.p>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {thinking && (
          <motion.div className="fixed inset-0 z-[70] flex items-center justify-center bg-velvet-950/75 px-6 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setThinking(false)}>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="glass max-w-sm px-8 py-10 text-center"
            >
              <div className="mb-4 text-5xl">☺️</div>
              <p className="font-serif text-[1.4rem] italic leading-snug text-lavender-soft">{p.thinkModal}</p>
              <button onClick={() => setThinking(false)} className="btn-glass mt-8 px-6 py-3 text-sm">{p.thinkModalClose}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
