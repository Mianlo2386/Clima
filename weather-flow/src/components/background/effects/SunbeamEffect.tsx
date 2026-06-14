import { useRef, useEffect } from 'react'

interface Props {
  intensity: 'full' | 'subtle'
}

interface BeamDef {
  centerAngle: number
  spreadOffset: number
  opacity: number
  width: number
}

const BEAM_DEFS: Record<Props['intensity'], BeamDef[]> = {
  full: [
    { centerAngle: 80, spreadOffset: -8, opacity: 0.18, width: 220 },
    { centerAngle: 80, spreadOffset: -4, opacity: 0.22, width: 200 },
    { centerAngle: 80, spreadOffset: -0.5, opacity: 0.35, width: 180 },
    { centerAngle: 80, spreadOffset: 3, opacity: 0.25, width: 190 },
    { centerAngle: 80, spreadOffset: 7, opacity: 0.20, width: 170 },
    { centerAngle: 80, spreadOffset: 12, opacity: 0.15, width: 160 },
  ],
  subtle: [
    { centerAngle: 80, spreadOffset: -5, opacity: 0.10, width: 190 },
    { centerAngle: 80, spreadOffset: -1, opacity: 0.18, width: 170 },
    { centerAngle: 80, spreadOffset: 3, opacity: 0.12, width: 160 },
    { centerAngle: 80, spreadOffset: 7, opacity: 0.08, width: 150 },
  ],
}

function calcProgress(t: number): number {
  const phase = (t % 5) / 5
  if (phase < 0.3) return phase / 0.3
  if (phase < 0.4) return 1
  if (phase < 0.7) return 1 - (phase - 0.4) / 0.3
  return 0
}

export default function SunbeamEffect({ intensity }: Props) {
  const elRefs = useRef<(HTMLDivElement | null)[]>([])
  const startRef = useRef(0)

  useEffect(() => {
    const beams = BEAM_DEFS[intensity]
    const els = elRefs.current
    startRef.current = performance.now()
    let raf: number

    const loop = (now: number) => {
      const t = (now - startRef.current) / 1000
      const progress = calcProgress(t)

      for (let i = 0; i < beams.length; i++) {
        const el = els[i]
        if (!el) continue
        const angle = beams[i].centerAngle + beams[i].spreadOffset * progress
        el.style.transform = `rotate(${angle}deg)`
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [intensity])

  const beams = BEAM_DEFS[intensity]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {beams.map((beam, i) => (
        <div
          key={i}
          ref={el => { elRefs.current[i] = el }}
          className="absolute bottom-0 left-0 w-full"
          style={{
            height: `${beam.width}%`,
            transformOrigin: 'bottom left',
            transform: `rotate(${beam.centerAngle}deg)`,
            background: `linear-gradient(to top, rgba(255,245,210,${beam.opacity}) 0%, rgba(255,230,170,${beam.opacity * 0.6}) 30%, transparent 60%)`,
            clipPath: `polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)`,
            filter: 'blur(8px)',
            mixBlendMode: 'screen',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}
