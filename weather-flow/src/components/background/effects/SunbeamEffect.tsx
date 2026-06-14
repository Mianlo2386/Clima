import { useRef, useEffect } from 'react'

interface Props {
  intensity: 'full' | 'subtle'
}

const BEAM_CONFIGS = {
  full: [
    { angle: 12, opacity: 0.07, width: 180 },
    { angle: 22, opacity: 0.09, width: 160 },
    { angle: 34, opacity: 0.08, width: 170 },
    { angle: 46, opacity: 0.06, width: 150 },
    { angle: 58, opacity: 0.05, width: 140 },
  ],
  subtle: [
    { angle: 18, opacity: 0.04, width: 160 },
    { angle: 32, opacity: 0.05, width: 140 },
    { angle: 46, opacity: 0.03, width: 130 },
  ],
}

export default function SunbeamEffect({ intensity }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(-40)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const speed = intensity === 'full' ? 12 : 8
    let raf: number

    const loop = () => {
      xRef.current += 0.12 * speed / 12
      if (xRef.current > 140) xRef.current = -40
      container.style.transform = `translateX(${xRef.current}%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [intensity])

  const beams = BEAM_CONFIGS[intensity]

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {beams.map((beam, i) => (
        <div
          key={i}
          className="absolute top-0 left-0 h-full"
          style={{
            width: `${beam.width}%`,
            transformOrigin: '0 0',
            transform: `rotate(${beam.angle}deg)`,
            background: `linear-gradient(to bottom, rgba(255,220,150,${beam.opacity}) 0%, rgba(255,200,100,${beam.opacity * 0.6}) 40%, transparent 70%)`,
            clipPath: `polygon(0% 0%, 100% 0%, 75% 100%, 25% 100%)`,
            filter: 'blur(12px)',
            mixBlendMode: 'screen',
          }}
        />
      ))}
    </div>
  )
}
