import { motion } from 'framer-motion'
import { proposalData } from '../config/proposalData'
import Heart from './Heart'
import Ornament from './Ornament'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.3, delayChildren: 0.5 } } }
const item = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const { eyebrow, title, subtitle, sketch, sketchCaption } = proposalData.hero

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 pb-32 pt-20 text-center">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
        <motion.p variants={item} className="eyebrow mb-6">{eyebrow}</motion.p>

        <h1 className="font-serif font-medium leading-[0.95]">
          <motion.span variants={item} className="block text-[clamp(2.6rem,13.5vw,6.5rem)] text-gradient">{title[0]}</motion.span>
          <motion.span variants={item} className="my-4 block">
            <Ornament className="max-w-[15rem]"><Heart size={24} className="heartbeat drop-shadow-[0_0_10px_rgba(224,67,92,0.7)]" /></Ornament>
          </motion.span>
          <motion.span variants={item} className="block text-[clamp(2.6rem,13.5vw,6.5rem)] italic text-gradient">{title[2]}</motion.span>
        </h1>

        <motion.p variants={item} className="mt-6 font-book text-xl italic text-lavender-soft/80 sm:text-2xl">{subtitle}</motion.p>

        {/* "mahi" word-portrait in an arch frame */}
        <motion.figure variants={item} className="relative mx-auto mt-10 w-[70%] max-w-[260px]">
          <div className="absolute -inset-6 rounded-t-full bg-gradient-to-b from-heart/20 via-lavender-bright/15 to-transparent blur-2xl" />
          <div className="relative overflow-hidden rounded-t-full border border-champagne/50 p-2 shadow-gold">
            <div className="overflow-hidden rounded-t-full">
              <motion.img
                src={sketch}
                alt="Mahi"
                className="aspect-[3/4] w-full object-cover"
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 3, ease: 'easeOut' }}
              />
            </div>
          </div>
          <figcaption className="mt-4 font-book text-[15px] italic text-champagne/80">{sketchCaption}</figcaption>
        </motion.figure>
      </motion.div>

    </section>
  )
}
