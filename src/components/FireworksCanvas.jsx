import { useEffect, useRef } from 'react'

// Realistic canvas fireworks: rising rockets with glowing trails, multi-layer bursts
// (peony, ring, willow, crackle), gravity, air drag, flicker and fading shimmer.
// Tap/click anywhere to launch an extra rocket at that spot.

const PALETTE = [
  { h: 270, s: 85, l: 75 }, // lavender
  { h: 290, s: 45, l: 72 }, // lilac
  { h: 32, s: 85, l: 78 }, // champagne gold
  { h: 42, s: 95, l: 65 }, // deep gold
  { h: 340, s: 80, l: 78 }, // rose
  { h: 350, s: 95, l: 60 }, // red
  { h: 352, s: 100, l: 66 }, // love red
  { h: 30, s: 30, l: 96 }, // warm white
]
const pick = (a) => a[Math.floor(Math.random() * a.length)]
const rand = (a, b) => a + Math.random() * (b - a)

export default function FireworksCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w, h, dpr, raf
    let rockets = []
    let particles = []
    let nextLaunch = 0
    let startTime = performance.now()
    const isMobile = window.innerWidth < 640
    const MAX_PARTICLES = isMobile ? 1400 : 2800

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = '#090612'
      ctx.fillRect(0, 0, w, h)
    }

    const launch = (tx, ty) => {
      const x = tx ?? rand(w * 0.15, w * 0.85)
      const targetY = ty ?? rand(h * 0.12, h * 0.42)
      const startX = tx != null ? tx + rand(-40, 40) : x + rand(-60, 60)
      const dist = h - targetY
      // initial velocity so it decelerates to ~0 at targetY under gravity
      const g = 0.06
      const vy = -Math.sqrt(2 * g * dist)
      rockets.push({
        x: startX, y: h + 10,
        vx: (x - startX) / (Math.abs(vy) / g), vy, g,
        trail: [],
        color: pick(PALETTE),
        type: pick(['heart', 'heart', 'heart', 'peony', 'ring', 'willow', 'crackle', 'double']),
      })
    }

    const spawn = (x, y, opts) => {
      if (particles.length > MAX_PARTICLES) return
      particles.push({
        x, y, px: x, py: y,
        vx: opts.vx, vy: opts.vy,
        life: 1,
        decay: opts.decay,
        drag: opts.drag ?? 0.985,
        grav: opts.grav ?? 0.045,
        size: opts.size ?? rand(1, 2.2),
        color: opts.color,
        flicker: opts.flicker ?? Math.random() < 0.35,
        crackle: opts.crackle ?? false,
      })
    }

    const explode = (r) => {
      const c = r.color
      const c2 = pick(PALETTE)
      const base = isMobile ? 70 : 110
      const sizeMul = Math.min(w, h) / 700 + 0.5

      const burst = (count, speed, color, extra = {}) => {
        for (let i = 0; i < count; i++) {
          const a = (Math.PI * 2 * i) / count + rand(-0.05, 0.05)
          const sp = extra.ring ? speed : speed * Math.pow(Math.random(), 0.45)
          spawn(r.x, r.y, {
            vx: Math.cos(a) * sp * sizeMul,
            vy: Math.sin(a) * sp * sizeMul,
            decay: extra.decay ?? rand(0.009, 0.016),
            drag: extra.drag,
            grav: extra.grav,
            color,
            crackle: extra.crackle,
            size: extra.size,
          })
        }
      }

      switch (r.type) {
        case 'heart': {
          // parametric heart curve: x = 16sin^3 t, y = 13cos t - 5cos2t - 2cos3t - cos4t
          const red = { h: pick([348, 352, 355]), s: 100, l: 62 }
          const count = isMobile ? 90 : 130
          const scale = (0.17 + Math.random() * 0.06) * sizeMul
          for (let i = 0; i < count; i++) {
            const t = (Math.PI * 2 * i) / count
            const hx = 16 * Math.pow(Math.sin(t), 3)
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
            spawn(r.x, r.y, { vx: hx * scale, vy: hy * scale, decay: rand(0.011, 0.014), drag: 0.955, grav: 0.012, color: red, size: 2, flicker: false })
          }
          burst(base * 0.3, 1.4, { h: 30, s: 40, l: 95 }, { decay: 0.025 })
          break
        }
        case 'ring':
          burst(base, 4.2, c, { ring: true, decay: 0.012 })
          burst(base * 0.4, 2, c2)
          break
        case 'willow':
          burst(base * 1.1, 3.6, { h: 38, s: 90, l: 70 }, { decay: rand(0.005, 0.007), drag: 0.975, grav: 0.03, size: 1.4 })
          break
        case 'crackle':
          burst(base, 4, c, { crackle: true })
          break
        case 'double':
          burst(base, 4.6, c)
          burst(base * 0.6, 2.4, c2)
          break
        default:
          burst(base, 4.4, c)
          burst(base * 0.25, 1.5, { h: 30, s: 30, l: 97 }, { decay: 0.02 })
      }

      // flash
      particles.push({ flash: true, x: r.x, y: r.y, life: 1, decay: 0.08, color: c })
    }

    const color = (c, a, lBoost = 0) => `hsla(${c.h},${c.s}%,${Math.min(100, c.l + lBoost)}%,${a})`

    const frame = (t) => {
      // fade previous frame -> natural motion trails
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(9,6,18,0.2)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      // auto launches: a grand opening volley, then a gentle steady rhythm
      const elapsed = t - startTime
      if (t > nextLaunch) {
        const grand = elapsed < 4000
        const n = grand ? (Math.random() < 0.6 ? 2 : 1) : 1
        for (let i = 0; i < n; i++) launch()
        nextLaunch = t + (grand ? rand(250, 500) : rand(900, 1700))
      }

      // rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.trail.push({ x: r.x, y: r.y })
        if (r.trail.length > 10) r.trail.shift()
        r.x += r.vx
        r.y += r.vy
        r.vy += r.g

        // glowing trail
        ctx.beginPath()
        ctx.moveTo(r.trail[0].x, r.trail[0].y)
        for (const p of r.trail) ctx.lineTo(p.x, p.y)
        ctx.strokeStyle = color({ h: 35, s: 90, l: 75 }, 0.6)
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,240,220,1)'
        ctx.fill()

        // sparks off the trail
        if (Math.random() < 0.5) {
          spawn(r.x, r.y, { vx: rand(-0.5, 0.5), vy: rand(0.5, 1.5), decay: 0.05, color: { h: 35, s: 90, l: 70 }, size: 0.9, flicker: true })
        }

        if (r.vy >= -0.4) {
          explode(r)
          rockets.splice(i, 1)
        }
      }

      // particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life -= p.decay
        if (p.life <= 0) { particles.splice(i, 1); continue }

        if (p.flash) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 120 * p.life)
          g.addColorStop(0, color(p.color, 0.35 * p.life, 20))
          g.addColorStop(1, color(p.color, 0))
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(p.x, p.y, 120 * p.life, 0, Math.PI * 2)
          ctx.fill()
          continue
        }

        p.px = p.x
        p.py = p.y
        p.vx *= p.drag
        p.vy = p.vy * p.drag + p.grav
        p.x += p.vx
        p.y += p.vy

        let alpha = Math.min(1, p.life * 1.4)
        if (p.flicker && Math.random() < 0.3) alpha *= rand(0.2, 1)

        // streak
        ctx.beginPath()
        ctx.moveTo(p.px, p.py)
        ctx.lineTo(p.x, p.y)
        ctx.strokeStyle = color(p.color, alpha, p.life > 0.7 ? 15 : 0)
        ctx.lineWidth = p.size
        ctx.stroke()

        // crackle: tiny white pops near end of life
        if (p.crackle && p.life < 0.35 && Math.random() < 0.12) {
          ctx.beginPath()
          ctx.arc(p.x + rand(-3, 3), p.y + rand(-3, 3), rand(0.6, 1.6), 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,250,240,0.95)'
          ctx.fill()
          p.life -= 0.05
        }
      }

      raf = requestAnimationFrame(frame)
    }

    const onTap = (e) => {
      const pt = e.touches ? e.touches[0] : e
      launch(pt.clientX, Math.min(pt.clientY, h * 0.7))
    }

    resize()
    raf = requestAnimationFrame(frame)
    window.addEventListener('resize', resize)
    window.addEventListener('pointerdown', onTap)

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else { startTime = performance.now() - 10000; raf = requestAnimationFrame(frame) }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', onTap)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}
