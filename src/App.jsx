import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { proposalData } from './config/proposalData'
import Stardust from './components/Stardust'
import FloatingHearts from './components/FloatingHearts'
import Intro from './components/Intro'
import Hero from './components/Hero'
import MusicToggle from './components/MusicToggle'
import Chapter from './components/Chapter'
import { Childhood, WhatIf } from './components/Childhood'
import Gallery from './components/Gallery'
import FrameWall from './components/FrameWall'
import VideoSection, { useVideoAvailable } from './components/VideoSection'
import LoveLetter from './components/LoveLetter'
import ProposalCard from './components/ProposalCard'
import FireworksCanvas from './components/FireworksCanvas'
import FinalScreen from './components/FinalScreen'
import { notify } from './lib/notify'
import PageNav, { PageProgress } from './components/PageNav'

const pageVariants = {
  enter: (dir) => ({ opacity: 0, x: dir * 70, filter: 'blur(10px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir) => ({ opacity: 0, x: dir * -70, filter: 'blur(10px)', transition: { duration: 0.4, ease: 'easeIn' } }),
}

export default function App() {
  const [entered, setEntered] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const [songAvailable, setSongAvailable] = useState(true)
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)
  const [letterOpen, setLetterOpen] = useState(false)
  const audioRef = useRef(null)
  const resumeAfterVideo = useRef(false)
  const videoFile = useVideoAvailable()
  const hasVideo = proposalData.media.showVideoPage || !!proposalData.media.videoLink || videoFile

  // ---------- music ----------
  useEffect(() => {
    const audio = new Audio(proposalData.media.bgm)
    audio.loop = true
    audio.volume = proposalData.media.bgmVolume
    audio.preload = 'auto'
    const startAt = proposalData.media.bgmStartAt || 0
    if (startAt) audio.addEventListener('loadedmetadata', () => { audio.currentTime = startAt }, { once: true })
    audio.addEventListener('error', () => setSongAvailable(false))
    audioRef.current = audio
    return () => { audio.pause(); audioRef.current = null }
  }, [])

  const playMusic = useCallback(async () => {
    const a = audioRef.current
    if (!a) return
    try { await a.play(); setMusicOn(true) } catch { setMusicOn(false) }
  }, [])
  const pauseMusic = useCallback(() => { audioRef.current?.pause(); setMusicOn(false) }, [])
  const toggleMusic = () => (musicOn ? pauseMusic() : playMusic())
  const handleVideoPlay = () => { resumeAfterVideo.current = musicOn; pauseMusic() }
  const handleVideoStop = () => { if (resumeAfterVideo.current) playMusic(); resumeAfterVideo.current = false }

  // ---------- pages ----------
  const P = proposalData.pages
  const pages = useMemo(() => {
    const list = [
      { id: 'hero', next: P.hero.next, el: <Hero /> },
      ...proposalData.chapters.flatMap((_, i) => {
        const ch = { id: `chapter${i + 1}`, next: P[`chapter${i + 1}`]?.next ?? 'Next', el: <Chapter index={i} /> }
        // childhood pages sit between Chapter Two and Chapter Three
        if (i === 1 && proposalData.childhood) {
          return [ch, { id: 'childhood', next: P.childhood.next, el: <Childhood /> }, { id: 'whatIf', next: P.whatIf.next, el: <WhatIf /> }]
        }
        return [ch]
      }),
      { id: 'gallery', next: P.gallery.next, el: <Gallery /> },
      { id: 'frames', next: hasVideo ? P.frames.next : P.video.next, el: <FrameWall /> },
    ]
    if (hasVideo) list.push({ id: 'video', next: P.video.next, el: <VideoSection onPlay={handleVideoPlay} onStop={handleVideoStop} /> })
    list.push({ id: 'letter', next: P.letter.next, el: <LoveLetter onOpen={() => setLetterOpen(true)} initiallyOpen={letterOpen} />, locked: !letterOpen })
    list.push({ id: 'question', next: null, el: <ProposalCard onYes={() => handleYes()} onNoTry={(n) => { noTries.current = n }} /> })
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasVideo, letterOpen, musicOn])

  const total = pages.length
  const current = pages[Math.min(page, total - 1)]

  const pageRef = useRef(0)
  const goTo = useCallback((n, push = true) => {
    const p = pageRef.current
    const target = Math.max(0, Math.min(n, total - 1))
    if (target === p) return
    pageRef.current = target
    setDir(target > p ? 1 : -1)
    setPage(target)
    if (target === total - 1) notify('question')
    if (push) window.history.pushState({ page: target }, '')
  }, [total])

  // the phone's back gesture goes to the previous page instead of leaving the site
  useEffect(() => {
    if (!entered) return
    window.history.replaceState({ page: 0 }, '')
    const onPop = (e) => { if (typeof e.state?.page === 'number') goTo(e.state.page, false) }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [entered, goTo])

  const noTries = useRef(0)
  const handleYes = () => {
    notify('yes', { noTries: noTries.current })
    setAccepted(true)
    navigator.vibrate?.([60, 80, 60, 80, 200])
    if (!musicOn) playMusic()
  }

  useEffect(() => {
    document.body.style.overflow = !entered || accepted ? 'hidden' : ''
  }, [entered, accepted])

  return (
    <div className="relative min-h-[100dvh]">
      <Stardust />
      <FloatingHearts count={entered ? 14 : 8} />

      <AnimatePresence>
        {!entered && <Intro key="intro" onEnter={() => { setEntered(true); notify('opened') }} onFirstTouch={playMusic} />}
      </AnimatePresence>

      {entered && !accepted && (
        <motion.main key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} className="relative z-10">
          <PageProgress index={page} total={total} />
          <MusicToggle on={musicOn} onToggle={toggleMusic} available={songAvailable} />

          <AnimatePresence mode="wait" custom={dir} onExitComplete={() => window.scrollTo({ top: 0 })}>
            <motion.div key={current.id} custom={dir} variants={pageVariants} initial="enter" animate="center" exit="exit">
              {current.el}
            </motion.div>
          </AnimatePresence>

          <PageNav
            index={page}
            total={total}
            onBack={() => goTo(page - 1)}
            onNext={() => goTo(page + 1)}
            nextLabel={current.next}
            backLabel={P.back}
            showNext={!!current.next && !current.locked}
          />
        </motion.main>
      )}

      <AnimatePresence>
        {accepted && (
          <motion.div key="finale" className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <FireworksCanvas />
            <FloatingHearts count={22} intensity={1.4} />
            <FinalScreen />
            <MusicToggle on={musicOn} onToggle={toggleMusic} available={songAvailable} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
