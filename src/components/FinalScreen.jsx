import { motion } from 'framer-motion'
import { proposalData } from '../config/proposalData'
import Heart from './Heart'
import { notify } from '../lib/notify'

// Heart-shaped photo of you both + the final words, over the fireworks
export default function FinalScreen() {
  const { photo, line1, line2, signoff } = proposalData.finale
  const { whatsappNumber, whatsappButton, whatsappMessage } = proposalData.notify || {}
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center overflow-y-auto px-6 py-10 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="absolute inset-0 scale-110 rounded-full bg-heart/40 blur-3xl" />
        <svg viewBox="0 0 24 22" className="heartbeat relative w-[230px] drop-shadow-[0_0_30px_rgba(224,67,92,0.8)] sm:w-[290px]">
          <defs>
            <clipPath id="final-heart">
              <path d="M12 21.35 10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35z" transform="translate(0 -1.5)" />
            </clipPath>
          </defs>
          <image href={photo} x="0" y="0" width="24" height="24" preserveAspectRatio="xMidYMid slice" clipPath="url(#final-heart)" transform="translate(0 -1) scale(1)" />
          <path d="M12 21.35 10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35z" transform="translate(0 -1.5)" fill="none" stroke="#E2C07E" strokeWidth="0.35" />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 2.6, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 font-script text-[clamp(2.3rem,10.5vw,5rem)] leading-[1.1] text-love drop-shadow-[0_0_30px_rgba(224,67,92,0.55)]"
      >
        {line1}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.2, duration: 1.4 }}
        className="mt-5 max-w-md font-serif text-2xl italic text-champagne/90 sm:text-3xl"
      >
        {line2}
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5.6, duration: 1.5 }} className="mt-8 flex items-center gap-3 font-book text-base italic text-lavender/80">
        <Heart size={12} /> {signoff} <Heart size={12} />
      </motion.div>
      {whatsappNumber && (
        <motion.a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
<<<<<<< HEAD
=======
          target="_blank"
          rel="noopener noreferrer"
>>>>>>> ecf2fb5fe3ad60987ea193a25724f1ea40bbf042
          onClick={() => notify('whatsapp')}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 6.8, duration: 1 }}
<<<<<<< HEAD
          className="btn-love pointer-events-auto relative z-20 mt-8 inline-flex shrink-0 cursor-pointer items-center gap-2 !px-7 !py-3.5 !text-base"
=======
          className="btn-love relative z-10 mt-8 inline-flex items-center gap-2 !px-7 !py-3.5 !text-base"
>>>>>>> ecf2fb5fe3ad60987ea193a25724f1ea40bbf042
        >
          {whatsappButton}
        </motion.a>
      )}
    </div>
  )
}
