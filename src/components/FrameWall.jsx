import { useState } from 'react'
import { motion } from 'framer-motion'
import { proposalData } from '../config/proposalData'

// 3D cover-flow of the framed collages — swipe or tap the side frames
export default function FrameWall() {
  const { eyebrow, heading, items } = proposalData.frames
  const [active, setActive] = useState(0)
  const n = items.length
  const go = (d) => setActive((a) => (a + d + n) % n)

  return (
    <section className="flex min-h-[100dvh] flex-col justify-center overflow-hidden px-4 pb-32 pt-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="mb-10 text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 font-serif text-[clamp(1.85rem,8vw,2.75rem)] leading-[1.1] text-gradient">{heading}</h2>
      </motion.div>

      <motion.div
        className="relative mx-auto h-[440px] w-full max-w-4xl sm:h-[540px]"
        style={{ perspective: 1200, touchAction: 'pan-y' }}
        onPanEnd={(_, i) => (i.offset.x < -40 ? go(1) : i.offset.x > 40 ? go(-1) : null)}
      >
        {items.map((it, i) => {
          let off = i - active
          if (off > n / 2) off -= n
          if (off < -n / 2) off += n
          const abs = Math.abs(off)
          return (
            <div key={it.image} className="pointer-events-none absolute inset-x-0 top-0 flex justify-center" style={{ zIndex: 10 - abs }}>
              <motion.div
                onClick={() => off !== 0 && setActive(i)}
                className="pointer-events-auto w-[62vw] max-w-[320px] cursor-pointer sm:max-w-[380px]"
                animate={{
                  x: `${off * 58}%`,
                  rotateY: off * -28,
                  scale: 1 - abs * 0.16,
                  opacity: abs > 1 ? 0 : 1 - abs * 0.35,
                  filter: abs ? 'brightness(0.55)' : 'brightness(1)',
                }}
                transition={{ type: 'spring', stiffness: 160, damping: 24 }}
              >
                <img src={it.image} alt={it.caption} draggable="false" className="w-full rounded-lg shadow-[0_40px_70px_-20px_rgba(0,0,0,0.9),0_0_60px_-20px_rgba(224,67,92,0.35)]" />
              </motion.div>
            </div>
          )
        })}
      </motion.div>

      <div className="mt-6 text-center">
        <motion.p key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-book text-xl italic text-champagne">
          {items[active].caption}
        </motion.p>
        <div className="mt-4 flex justify-center gap-2">
          {items.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`Frame ${i + 1}`} className={`h-2 rounded-full transition-all duration-500 ${i === active ? 'w-6 bg-heart' : 'w-2 bg-lavender/35'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
