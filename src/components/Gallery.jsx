import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { proposalData } from '../config/proposalData'
import Heart from './Heart'

function Lightbox({ items, index, setIndex }) {
  const [dir, setDir] = useState(0)
  const go = (d) => { setDir(d); setIndex((i) => (i + d + items.length) % items.length) }

  useEffect(() => {
    const k = (e) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'Escape') setIndex(null)
    }
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [])

  const item = items[index]
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-velvet-950/95 px-4 backdrop-blur-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setIndex(null)}
    >
      <button className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-xl text-white/80" style={{ top: 'max(1rem, env(safe-area-inset-top))' }} aria-label="Close">✕</button>
      <div className="relative flex h-[72dvh] w-full max-w-md items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={index}
            src={item.image}
            alt={item.caption}
            custom={dir}
            initial={{ opacity: 0, x: dir * 120, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir * -120, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, i) => (i.offset.x < -60 ? go(1) : i.offset.x > 60 ? go(-1) : null)}
            className="max-h-full max-w-full rounded-2xl object-contain shadow-[0_0_80px_-20px_rgba(224,67,92,0.6)]"
            draggable="false"
          />
        </AnimatePresence>
      </div>
      <div className="mt-5 flex w-full max-w-md items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => go(-1)} className="h-11 w-11 shrink-0 rounded-full border border-lavender/30 text-lavender" aria-label="Previous">‹</button>
        <AnimatePresence mode="wait">
          <motion.p key={index} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center font-book text-lg italic text-champagne">
            {item.caption}
          </motion.p>
        </AnimatePresence>
        <button onClick={() => go(1)} className="h-11 w-11 shrink-0 rounded-full border border-lavender/30 text-lavender" aria-label="Next">›</button>
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  const { eyebrow, heading, items } = proposalData.gallery
  const [open, setOpen] = useState(null)

  return (
    <section className="mx-auto min-h-[100dvh] max-w-5xl px-4 pb-32 pt-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="mb-10 text-center">
        <p className="font-script text-[3.4rem] text-love sm:text-6xl">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-[clamp(1.85rem,8vw,2.75rem)] leading-[1.1] text-gradient">{heading}</h2>
        <p className="mt-3 font-book text-sm italic text-lavender/60">Tap any photo to see it bigger</p>
      </motion.div>

      <div className="columns-2 gap-3 sm:columns-3 sm:gap-4">
        {items.map((it, i) => (
          <motion.button
            key={it.image}
            onClick={() => setOpen(i)}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }}
            whileTap={{ scale: 0.97 }}
            className="group relative mb-3 block w-full overflow-hidden rounded-2xl border border-white/10 sm:mb-4"
          >
            <img
              src={it.image}
              alt={it.caption}
              loading="lazy"
              className={`w-full object-cover transition duration-700 group-hover:scale-105 ${i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-[4/5]' : 'aspect-[2/3]'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-velvet-950/80 via-transparent to-transparent opacity-80" />
            <Heart size={18} className="absolute right-2.5 top-2.5 opacity-90 drop-shadow-[0_0_6px_rgba(224,67,92,0.9)]" />
            <p className="absolute inset-x-0 bottom-0 p-3 text-left font-book text-[13px] italic leading-snug text-white/90 sm:text-sm">{it.caption}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>{open !== null && <Lightbox items={items} index={open} setIndex={setOpen} />}</AnimatePresence>
    </section>
  )
}
