import { AnimatePresence, motion } from 'framer-motion'
import Heart from './Heart'

// Top progress line + bottom Back / Next bar shared by every page
export function PageProgress({ index, total }) {
  const pct = ((index + 1) / total) * 100
  return (
    <div className="fixed inset-x-0 top-0 z-[55] h-[3px] bg-white/5">
      <motion.div className="relative h-full bg-gradient-to-r from-lavender-bright via-heart to-champagne" animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 90, damping: 20 }}>
        <Heart size={12} className="absolute -right-1.5 -top-[5px] drop-shadow-[0_0_6px_rgba(224,67,92,0.9)]" />
      </motion.div>
    </div>
  )
}

export default function PageNav({ index, total, onBack, onNext, nextLabel, backLabel, showNext = true }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-velvet-950 via-velvet-950/85 to-transparent px-4 pt-10"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <div className="pointer-events-auto mx-auto flex max-w-xl items-center justify-between gap-3">
        <button
          onClick={onBack}
          disabled={index === 0}
          className="flex h-12 min-w-[3rem] items-center justify-center gap-1 rounded-full border border-lavender/25 bg-velvet-900/60 px-4 text-sm text-lavender-soft/80 backdrop-blur-md transition disabled:opacity-0"
          aria-label={backLabel}
        >
          <span className="text-lg leading-none">‹</span>
          <span className="hidden sm:inline">{backLabel}</span>
        </button>

        <span className="font-book text-sm italic text-lavender/60 sm:hidden">{index + 1} / {total}</span>
        <div className="hidden items-center gap-1.5 sm:flex">
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-5 bg-heart' : i < index ? 'w-1.5 bg-champagne/60' : 'w-1.5 bg-lavender/25'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {showNext ? (
            <motion.button
              key={nextLabel}
              onClick={onNext}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              whileTap={{ scale: 0.95 }}
              className="btn-love flex h-12 min-w-0 max-w-[62vw] items-center gap-2 !px-5 !py-0 !text-sm sm:max-w-none"
            >
              <span className="relative z-10 truncate whitespace-nowrap">{nextLabel}</span>
              <span className="relative z-10 text-lg leading-none">›</span>
              <span className="absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </motion.button>
          ) : (
            <span className="h-12 min-w-[3rem]" />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
