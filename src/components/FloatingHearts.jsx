import { useMemo } from 'react'
import Heart from './Heart'

// Soft red hearts drifting upward across the whole page (pure CSS animation — smooth on phones)
export default function FloatingHearts({ count = 14, intensity = 1 }) {
  const hearts = useMemo(() => {
    const colors = ['#E0435C', '#E11D48', '#FF8FA3', '#F4A6C0', '#FF5C7A']
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 10 + Math.random() * 18,
      d: 12 + Math.random() * 14,
      delay: -Math.random() * 26,
      dx: (Math.random() - 0.5) * 80,
      rot: (Math.random() - 0.5) * 40,
      o: (0.25 + Math.random() * 0.4) * intensity,
      color: colors[i % colors.length],
      blur: Math.random() < 0.3,
    }))
  }, [count, intensity])

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="heart-float absolute"
          style={{
            left: `${h.left}%`,
            bottom: '-40px',
            '--d': `${h.d}s`,
            '--delay': `${h.delay}s`,
            '--dx': `${h.dx}px`,
            '--rot': `${h.rot}deg`,
            '--o': h.o,
            filter: h.blur ? 'blur(2px)' : `drop-shadow(0 0 8px ${h.color}88)`,
          }}
        >
          <Heart size={h.size} color={h.color} />
        </div>
      ))}
    </div>
  )
}
