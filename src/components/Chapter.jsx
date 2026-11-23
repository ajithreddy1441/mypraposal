import { motion } from 'framer-motion'
import { proposalData } from '../config/proposalData'
import Polaroid from './Polaroid'
import CompareSlider from './CompareSlider'
import Heart from './Heart'
import Ornament from './Ornament'

const reveal = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
}

function ChapterHeader({ label, title }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <span className="shrink-0 font-book text-base italic text-champagne">{label}</span>
        <span className="zari flex-1 !opacity-60" />
      </div>
      <h2 className="mt-4 font-serif text-[clamp(2rem,9vw,3rem)] font-medium leading-[1.08] text-gradient">{title}</h2>
    </div>
  )
}

function Paragraphs({ text }) {
  return text?.map((t, i) => (
    <p key={i} className={i === 0 ? 'font-book text-[1.3rem] italic leading-snug text-lavender-soft' : 'mt-4 text-[15px] leading-relaxed text-lavender-soft/75'}>
      {t}
    </p>
  ))
}

function Chat({ messages }) {
  return (
    <div className="mt-6 space-y-2 rounded-2xl border border-white/5 bg-velvet-950/50 p-4">
      <p className="mb-2 text-center font-book text-[13px] italic text-lavender/55">Late night chat</p>
      {messages.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.9 + i * 0.7 }}
          className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13.5px] ${m.from === 'me' ? 'rounded-br-sm bg-gradient-to-br from-heart-deep to-heart text-white' : 'rounded-bl-sm bg-white/10 text-lavender-soft'}`}>
            {m.text}
            <span className="ml-2 align-bottom text-[9px] opacity-60">{m.time}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// One chapter = one page
export default function Chapter({ index }) {
  const ch = proposalData.chapters[index]
  const idx = index
  return (
    <section className="relative mx-auto flex min-h-[100dvh] max-w-5xl items-center px-5 pb-32 pt-20">
      <motion.article variants={reveal} initial="hidden" animate="show" className="relative w-full">
        {ch.type === 'quote' ? (
              <div className="glass relative mx-auto max-w-2xl overflow-hidden px-7 py-14 text-center sm:px-12">
                <div className="absolute inset-0 bg-gradient-to-br from-heart/10 via-transparent to-champagne/10" />
                <Ornament className="relative">{ch.label}</Ornament>
                <h2 className="relative mt-4 font-serif text-[clamp(2rem,9vw,3rem)] font-medium leading-tight text-gradient">{ch.title}</h2>
                <span className="relative mt-6 block font-display text-7xl leading-none text-champagne/40">“</span>
                <blockquote className="relative -mt-4 font-book text-[1.3rem] italic leading-[1.45] text-lavender-soft sm:text-2xl">{ch.quote}</blockquote>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="relative mt-10 font-book text-base italic text-lavender/80"
                >
                  {ch.reveal}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ delay: 1.2, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative mt-2 flex items-center justify-center gap-3"
                >
                  <span className="font-script text-[5rem] text-love drop-shadow-[0_0_22px_rgba(224,67,92,0.45)] sm:text-9xl">{ch.name}</span>
                  <Heart size={34} className="heartbeat" />
                </motion.div>
              </div>
            ) : ch.type === 'compare' ? (
              <div className="grid items-center gap-10 md:grid-cols-2">
                <div className="glass p-6 sm:p-9">
                  <ChapterHeader label={ch.label} title={ch.title} />
                  <Paragraphs text={ch.text} />
                  <Chat messages={ch.chat} />
                </div>
                <CompareSlider before={ch.before} after={ch.after} beforeLabel={ch.beforeLabel} afterLabel={ch.afterLabel} />
              </div>
            ) : (
              <div className={`grid items-center gap-10 md:grid-cols-2 ${idx % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
                <Polaroid src={ch.image} caption={ch.caption} tilt={idx % 2 ? 3 : -3} />
                <div className="glass p-6 sm:p-9">
                  <ChapterHeader label={ch.label} title={ch.title} />
                  <Paragraphs text={ch.text} />
                </div>
              </div>
            )}
      </motion.article>
    </section>
  )
}
