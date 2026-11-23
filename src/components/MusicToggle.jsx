import { motion } from 'framer-motion'
import { proposalData } from '../config/proposalData'

// Now-playing pill: song name + one tap to mute / unmute
export default function MusicToggle({ on, onToggle, available = true }) {
  if (available === false) return null
  const { songTitle, songFrom } = proposalData.media
  return (
    <motion.button
      onClick={onToggle}
      aria-label={on ? 'Mute music' : 'Play music'}
      aria-pressed={on}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="fixed right-3 z-[60] flex h-11 max-w-[13.5rem] items-center gap-2.5 rounded-full border border-champagne/35 bg-velvet-950/75 py-1 pl-1.5 pr-4 text-left backdrop-blur-md transition hover:border-champagne/70"
      style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }}
    >
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: 'linear-gradient(180deg,#f8e4b0,#e2c07e 45%,#b8893e)' }}>
        {on ? (
          <span className="flex h-3.5 items-end gap-[2.5px]">
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="w-[2.5px] rounded-full bg-velvet-950"
                animate={{ height: ['30%', '100%', '45%', '80%', '30%'] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </span>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1d0e25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5 6 9H3v6h3l5 4V5z" fill="#1d0e25" />
            <path d="m22 9-6 6M16 9l6 6" />
          </svg>
        )}
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-book text-[13px] italic text-lavender-soft">{songTitle || 'Our song'}</span>
        <span className="block truncate text-[10.5px] text-champagne/80">
          {on ? (songFrom ? `${songFrom} · tap to mute` : 'Tap to mute') : 'Muted · tap to play'}
        </span>
      </span>
    </motion.button>
  )
}
