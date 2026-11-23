import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { proposalData } from '../config/proposalData'
import Heart from './Heart'

// Turns a YouTube / Google Drive / Vimeo link into an embeddable player URL
export function toEmbedUrl(link) {
  if (!link) return ''
  try {
    const u = new URL(link)
    const host = u.hostname.replace(/^www\.|^m\./, '')
    if (host === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0&playsinline=1`
    if (host.endsWith('youtube.com')) {
      const id = u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop()
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`
    }
    if (host === 'drive.google.com') {
      const m = u.pathname.match(/\/d\/([^/]+)/)
      const id = m ? m[1] : u.searchParams.get('id')
      return id ? `https://drive.google.com/file/d/${id}/preview` : link
    }
    if (host === 'vimeo.com') return `https://player.vimeo.com/video/${u.pathname.split('/').filter(Boolean)[0]}?autoplay=1`
    return link
  } catch {
    return link
  }
}

// Checks whether /video/proposal.mp4 has been uploaded
export function useVideoAvailable() {
  const { video } = proposalData.media
  const [available, setAvailable] = useState(null)
  useEffect(() => {
    fetch(video, { method: 'HEAD' })
      .then((r) => setAvailable(r.ok && (r.headers.get('content-type') || '').includes('video')))
      .catch(() => setAvailable(false))
  }, [video])
  return available
}

function PlayHeart() {
  return (
    <span className="relative flex h-24 w-24 items-center justify-center">
      <span className="absolute inset-0 animate-ping rounded-full bg-heart/20" />
      <Heart size={92} className="heartbeat drop-shadow-[0_0_20px_rgba(224,67,92,0.9)]" />
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" className="absolute ml-1"><path d="M7 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L8.5 4.64A1 1 0 0 0 7 5.5z" /></svg>
    </span>
  )
}

export default function VideoSection({ onPlay, onStop }) {
  const { heading, subtext, eyebrow, comingSoonTitle, comingSoonText } = proposalData.videoSection
  const { video, videoPoster, videoLink, videoOrientation } = proposalData.media
  const embedUrl = toEmbedUrl(videoLink)
  const fileAvailable = useVideoAvailable()

  const ref = useRef(null)
  const playing = useRef(false)
  const [started, setStarted] = useState(false)
  const [ratio, setRatio] = useState(videoOrientation === 'landscape' ? 16 / 9 : 9 / 16)
  const [failed, setFailed] = useState(false)

  // leaving this page: stop the video and give the music back
  useEffect(() => () => {
    if (ref.current && !ref.current.paused) ref.current.pause()
    if (playing.current) onStop?.()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const mode = embedUrl ? 'embed' : fileAvailable && !failed ? 'file' : fileAvailable === null ? 'loading' : 'soon'

  const markPlay = () => { playing.current = true; onPlay?.() }
  const markStop = () => { playing.current = false; onStop?.() }

  const start = () => {
    setStarted(true)
    if (mode === 'file') ref.current?.play().catch(() => {})
    else markPlay() // embedded players can't report play/pause, so pause music on tap
  }

  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-4xl flex-col justify-center px-5 pb-28 pt-20">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 font-serif text-[clamp(1.85rem,8vw,3rem)] leading-[1.1] text-gradient">{heading}</h2>
        <p className="mt-3 text-sm text-lavender/60">{mode === 'soon' ? comingSoonText : subtext}</p>

        <div className="relative mx-auto mt-8 w-fit max-w-full rounded-[28px] p-[1.5px]" style={{ background: 'linear-gradient(130deg, rgba(224,67,92,0.7), rgba(226,192,126,0.7), rgba(187,166,217,0.5))' }}>
          <div className="absolute -inset-4 -z-10 rounded-[40px] bg-gradient-to-r from-heart/25 to-champagne/25 blur-3xl" />
          <div className="glass relative overflow-hidden rounded-[26px] p-2 sm:p-3">
            <div
              className="relative mx-auto overflow-hidden rounded-[20px] bg-black"
              style={{ aspectRatio: ratio, width: `min(calc(100vw - 3.5rem), 52rem, calc(56dvh * ${ratio}))` }}
            >
              {mode === 'file' && (
                <video
                  ref={ref}
                  src={video}
                  poster={videoPoster}
                  playsInline
                  preload="metadata"
                  controls={started}
                  onPlay={markPlay}
                  onPause={markStop}
                  onEnded={markStop}
                  onLoadedMetadata={(e) => { const v = e.currentTarget; if (v.videoWidth && v.videoHeight) setRatio(v.videoWidth / v.videoHeight) }}
                  onError={() => setFailed(true)}
                  className="h-full w-full object-cover"
                />
              )}

              {mode === 'embed' && started && (
                <iframe
                  src={embedUrl}
                  title="Video"
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              )}

              {(mode === 'embed' || mode === 'soon' || mode === 'loading') && !started && (
                <img src={videoPoster} alt="" className={`absolute inset-0 h-full w-full object-cover ${mode === 'soon' ? 'scale-110 blur-[3px] brightness-50' : ''}`} />
              )}

              <AnimatePresence>
                {(mode === 'file' || mode === 'embed') && !started && (
                  <motion.button onClick={start} aria-label="Play video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-velvet-950/80 via-velvet-950/30 to-velvet-950/50">
                    <PlayHeart />
                  </motion.button>
                )}
              </AnimatePresence>

              {mode === 'soon' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-t from-velvet-950/85 via-velvet-950/40 to-velvet-950/60 px-6">
                  <Heart size={64} className="heartbeat drop-shadow-[0_0_18px_rgba(224,67,92,0.8)]" />
                  <p className="font-book text-xl italic text-champagne sm:text-2xl">{comingSoonTitle}</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
