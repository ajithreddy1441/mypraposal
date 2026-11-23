import { useEffect, useRef } from 'react'

// Lightweight canvas stardust — soft drifting particles, 60fps, low CPU
export default function Stardust() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w, h, dpr, raf
    let stars = []
    const colors = ['200,162,200', '187,166,217', '226,192,126', '255,245,235']

    const init = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(110, (w * h) / 11000))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.3,
        vy: -(Math.random() * 0.25 + 0.05),
        vx: (Math.random() - 0.5) * 0.12,
        a: Math.random() * Math.PI * 2,
        s: Math.random() * 0.02 + 0.005,
        c: colors[Math.floor(Math.random() * colors.length)],
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of stars) {
        p.a += p.s
        p.x += p.vx
        p.y += p.vy
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w }
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        const alpha = 0.25 + Math.sin(p.a) * 0.25 + 0.25
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
        g.addColorStop(0, `rgba(${p.c},${alpha})`)
        g.addColorStop(1, `rgba(${p.c},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!reduce) raf = requestAnimationFrame(draw)
    }

    init()
    draw()
    window.addEventListener('resize', init)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', init)
    }
  }, [])

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-lavender-bright/10 blur-[120px]" />
        <div className="absolute -right-24 top-1/2 h-96 w-96 rounded-full bg-champagne/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-rose-glow/[0.07] blur-[120px]" />
      </div>
      <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
    </>
  )
}
