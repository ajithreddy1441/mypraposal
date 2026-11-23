import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { proposalData } from '../config/proposalData'
import Heart from './Heart'

// A sealed envelope — tap the red wax heart, the flap opens and the letter rises out
export default function LoveLetter({ onOpen, initiallyOpen = false }) {
  const L = proposalData.letter
  const [open, setOpen] = useState(initiallyOpen)

  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col justify-center px-5 pb-32 pt-20">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div
            key="env"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40, scale: 0.9, transition: { duration: 0.6 } }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <p className="font-script text-[clamp(2.2rem,10vw,3.5rem)] leading-tight text-love">{L.envelopeText}</p>

            <motion.button
              onClick={() => { setOpen(true); onOpen?.() }}
              whileTap={{ scale: 0.97 }}
              className="group relative mx-auto mt-10 block aspect-[3/2] w-full max-w-md"
              aria-label="Open the letter"
            >
              <div className="absolute -inset-6 rounded-3xl bg-heart/20 blur-3xl" />
              {/* envelope body */}
              <div className="paper absolute inset-0 overflow-hidden rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, transparent 49.5%, rgba(0,0,0,0.07) 50%), linear-gradient(225deg, transparent 49.5%, rgba(0,0,0,0.07) 50%)' }} />
                <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: 'linear-gradient(to top, rgba(232,185,138,0.25), transparent)' }} />
              </div>
              {/* flap */}
              <div
                className="absolute inset-x-0 top-0 h-[58%] origin-top transition-transform duration-500 group-hover:[transform:rotateX(18deg)]"
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: 'linear-gradient(180deg, #efe3d2, #e4d2bb)', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}
              />
              {/* wax seal */}
              <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2">
                <div className="heartbeat relative flex h-20 w-20 items-center justify-center rounded-full shadow-[0_6px_18px_rgba(120,0,20,0.6)]" style={{ background: 'radial-gradient(circle at 35% 30%, #ff5c7a, #b0102e 60%, #7a0a20)' }}>
                  <div className="absolute inset-1.5 rounded-full border border-white/20" />
                  <Heart size={34} color="#ffd6dd" />
                </div>
              </div>
              <p className="absolute bottom-4 left-0 right-0 font-book text-lg italic text-velvet-800/70">To, Mahi</p>
            </motion.button>
            <p className="mt-6 text-sm tracking-wide text-lavender/60">{L.envelopeHint}</p>
          </motion.div>
        ) : (
          <motion.article
            key="letter"
            initial={{ opacity: 0, y: 120, scale: 0.9, rotateX: 25 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="paper relative rounded-2xl px-6 py-12 text-velvet-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9),0_0_80px_-20px_rgba(224,67,92,0.45)] sm:px-12"
            style={{ transformPerspective: 1000 }}
          >
            <div className="pointer-events-none absolute inset-3 rounded-xl border border-champagne-deep/40" />
            <Heart size={26} className="absolute right-6 top-6 opacity-80" />

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="font-script text-[2.6rem] text-heart-deep">
              {L.greeting}
            </motion.p>

            <div className="mt-6 space-y-5">
              {L.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1, delay: i === 0 ? 1.1 : 0.1 }}
                  className={`font-book leading-[1.7] ${i === 0 ? 'text-[1.25rem] italic' : 'text-[1.06rem]'}`}
                >
                  {p}
                </motion.p>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 }} className="mt-10 text-center">
              <p className="font-script text-[clamp(2rem,9vw,3rem)] leading-tight text-heart-deep">{L.loveLine}</p>
              <div className="mt-3 flex justify-center gap-1.5">
                {[0, 1, 2].map((i) => <Heart key={i} size={14 + (i === 1 ? 6 : 0)} />)}
              </div>
            </motion.div>
            <p className="mt-8 text-right font-book text-lg italic text-velvet-800/80">{L.signoff}</p>
          </motion.article>
        )}
      </AnimatePresence>
    </section>
  )
}
