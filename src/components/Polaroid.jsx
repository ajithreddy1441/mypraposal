import { useState } from 'react'
import { motion } from 'framer-motion'
import Heart from './Heart'

// Polaroid frame with a little red-heart tape, tilt and glow on hover/tap.
export default function Polaroid({ src, caption, tilt = -3, className = '' }) {
  const [failed, setFailed] = useState(false)

  return (
    <motion.figure
      initial={{ rotate: tilt }}
      whileHover={{ rotate: 0, scale: 1.04, boxShadow: '0 0 60px -6px rgba(224,67,92,0.45)' }}
      whileTap={{ rotate: 0, scale: 1.03, boxShadow: '0 0 60px -6px rgba(224,67,92,0.45)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className={`relative mx-auto w-full max-w-[290px] rounded-md bg-[#F7F1EA] p-3 pb-4 shadow-[0_25px_50px_-15px_rgba(0,0,0,0.7)] ${className}`}
    >
      <Heart size={30} className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rotate-[-8deg] drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]" />
      <div className="aspect-[4/5] w-full overflow-hidden rounded-sm bg-velvet-800">
        {!failed ? (
          <img src={src} alt={caption || ''} loading="lazy" draggable="false" onError={() => setFailed(true)} className="h-full w-full select-none object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-velvet-700 to-[#3b2a3f] px-4 text-center text-[11px] text-lavender/70">
            Add photo at<br />{src}
          </div>
        )}
      </div>
      {caption && <figcaption className="mt-3 text-center font-book text-lg italic text-velvet-800">{caption}</figcaption>}
    </motion.figure>
  )
}
