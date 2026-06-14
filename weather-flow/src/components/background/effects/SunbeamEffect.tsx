import { useRef, useEffect } from 'react'

interface Props {
  intensity: 'full' | 'subtle'
}

const BEAM_CONFIGS = {
  full: [
    { angle: 72, opacity: 0.18, width: 220 },
    { angle: 76, opacity: 0.22, width: 200 },
    { angle: 79.5, opacity: 0.35, width: 180 },
    { angle: 83, opacity: 0.25, width: 190 },
    { angle: 87, opacity: 0.20, width: 170 },
    { angle: 92, opacity: 0.15, width: 160 },
  ],
  subtle: [
    { angle: 74, opacity: 0.10, width: 190 },
    { angle: 79.5, opacity: 0.18, width: 170 },
    { angle: 84, opacity: 0.12, width: 160 },
    { angle: 89, opacity: 0.08, width: 150 },
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
          className="absolute bottom-0 left-0 w-full"
          style={{
            height: `${beam.width}%`,
            transformOrigin: 'bottom left',
            transform: `rotate(${beam.angle}deg)`,
            background: `linear-gradient(to top, rgba(255,245,210,${beam.opacity}) 0%, rgba(255,230,170,${beam.opacity * 0.6}) 30%, transparent 60%)`,
            clipPath: `polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)`,
            filter: 'blur(8px)',
            mixBlendMode: 'screen',
          }}
        />
      ))}
    </div>
  )
}
