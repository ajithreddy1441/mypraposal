import { useRef, useState } from 'react'
import Heart from './Heart'

// Drag the heart to reveal "serious developer" vs "with Mahi" photo
export default function CompareSlider({ before, after, beforeLabel, afterLabel }) {
  const [pos, setPos] = useState(50)
  const ref = useRef(null)
  const dragging = useRef(false)

  const update = (clientX) => {
    const r = ref.current.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)))
  }

  return (
    <div className="mx-auto w-full max-w-[360px]">
      <div
        ref={ref}
        className="no-callout relative aspect-[3/4] w-full cursor-ew-resize overflow-hidden rounded-[22px] border border-champagne/40 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8),0_0_50px_-15px_rgba(224,67,92,0.4)]"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={(e) => { dragging.current = true; update(e.clientX); e.currentTarget.setPointerCapture(e.pointerId) }}
        onPointerMove={(e) => dragging.current && update(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <img src={after} alt={afterLabel} className="absolute inset-0 h-full w-full object-cover" draggable="false" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src={before} alt={beforeLabel} className="absolute inset-0 h-full w-full object-cover grayscale-[60%]" draggable="false" />
        </div>

        <span className="absolute left-3 top-3 rounded-full bg-velvet-950/70 px-3 py-1 text-[11px] text-lavender-soft backdrop-blur" style={{ opacity: pos > 20 ? 1 : 0 }}>
          {beforeLabel}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-heart/80 px-3 py-1 text-[11px] text-white backdrop-blur" style={{ opacity: pos < 80 ? 1 : 0 }}>
          {afterLabel}
        </span>

        <div className="absolute inset-y-0 w-[2px] bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.8)]" style={{ left: `${pos}%` }}>
          <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-heart/90 shadow-[0_0_25px_rgba(224,67,92,0.9)]">
            <Heart size={22} color="#fff" />
          </div>
        </div>
      </div>
      <p className="mt-3 text-center font-book text-sm italic text-lavender/60">Drag the heart ⇆</p>
    </div>
  )
}
