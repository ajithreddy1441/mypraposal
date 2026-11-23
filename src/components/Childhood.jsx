import { motion } from 'framer-motion'
import { proposalData } from '../config/proposalData'
import Polaroid from './Polaroid'
import Ornament from './Ornament'
import Heart from './Heart'

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
})

function Header({ label, title }) {
  return (
    <motion.div {...rise()} className="text-center">
      <Ornament>{label}</Ornament>
      <h2 className="mt-4 font-serif text-[clamp(2.2rem,10vw,3.4rem)] leading-[1.05] text-gradient">{title}</h2>
    </motion.div>
  )
}

// Both of us as kids: his photo beside hers, and two more of her below
export function Childhood() {
  const { label, title, line, him, her } = proposalData.childhood
  const [first, ...rest] = her
  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col justify-center px-5 pb-32 pt-20">
      <Header label={label} title={title} />

      <div className="relative mt-8 grid grid-cols-2 gap-4 sm:gap-8">
        <motion.div {...rise(0.25)}><Polaroid src={him.image} caption={him.caption} tilt={-4} /></motion.div>
        <motion.div {...rise(0.45)}><Polaroid src={first.image} caption={first.caption} tilt={4} /></motion.div>
        <motion.span
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 220, damping: 14 }}
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        >
          <Heart size={34} className="heartbeat drop-shadow-[0_0_14px_rgba(224,67,92,0.8)]" />
        </motion.span>
      </div>

      {rest.length > 0 && (
        <div className="mx-auto mt-5 grid w-[84%] grid-cols-2 gap-4 sm:gap-8">
          {rest.map((p, i) => (
            <motion.div key={p.image} {...rise(0.65 + i * 0.15)}>
              <Polaroid src={p.image} caption={p.caption} tilt={i % 2 ? 3 : -2} />
            </motion.div>
          ))}
        </div>
      )}

      <motion.p {...rise(1.1)} className="mx-auto mt-8 max-w-sm text-center font-book text-[1.15rem] italic leading-snug text-lavender-soft/90">
        {line}
      </motion.p>
    </section>
  )
}

// "What if we had met back then": the photo develops from an old sepia print into colour
export function WhatIf() {
  const { label, title, image, caption, text } = proposalData.whatIf
  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col items-center justify-center px-5 pb-32 pt-20 text-center">
      <Header label={label} title={title} />

      <motion.figure {...rise(0.3)} className="relative mt-8 w-[min(84vw,380px)]">
        <div className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-b from-heart/25 via-champagne/15 to-transparent blur-3xl" />
        <div className="rounded-[6px] p-[2px]" style={{ background: 'linear-gradient(160deg,#f8e4b0,#b8893e 40%,#f3d595 70%,#a67a35)' }}>
          <div className="rounded-[4px] bg-velvet-950 p-2.5">
            <div className="overflow-hidden rounded-[2px] border border-champagne/40">
              <motion.img
                src={image}
                alt={caption}
                draggable="false"
                className="aspect-[4/5] w-full select-none object-cover"
                initial={{ filter: 'sepia(1) saturate(0.6) brightness(0.8) blur(6px)', scale: 1.08 }}
                animate={{ filter: 'sepia(0) saturate(1) brightness(1) blur(0px)', scale: 1 }}
                transition={{ delay: 0.8, duration: 2.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
        <figcaption className="mt-4 font-book text-[15px] italic text-champagne/85">{caption}</figcaption>
      </motion.figure>

      <motion.p {...rise(2.4)} className="mt-6 max-w-sm font-book text-[1.2rem] italic leading-snug text-lavender-soft">
        {text}
      </motion.p>
    </section>
  )
}
