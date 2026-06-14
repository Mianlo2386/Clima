import { useEffect, useRef, useState, useCallback } from 'react'

interface BoltPath {
  main: string
  branch: string
}

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

interface Segment {
  x: number
  y: number
}

function generateBoltPath(): BoltPath {
  const startX = randomRange(30, 70)
  const segments = 8
  const pts: Segment[] = [{ x: startX, y: 0 }]

  for (let i = 1; i <= segments; i++) {
    const prev = pts[i - 1]
    const x = Math.max(5, Math.min(95, prev.x + randomRange(-15, 15)))
    const y = (i / segments) * 100
    pts.push({ x, y })
  }
  pts.push({ x: Math.max(5, Math.min(95, pts[pts.length - 1].x + randomRange(-8, 8))), y: 100 })

  const main = pts.map(p => `${p.x} ${p.y}`).join(' L ')

  const branchIndices = [Math.floor(segments * 0.3), Math.floor(segments * 0.55)]
  let branch = ''

  for (const bi of branchIndices) {
    const origin = pts[bi]
    const dir = Math.random() > 0.5 ? 1 : -1
    let bx = origin.x + dir * 8
    let by = origin.y

    branch += ` M ${bx} ${by}`

    for (let j = 1; j <= 3; j++) {
      by = origin.y + (j / 3) * randomRange(20, 30)
      bx = bx + dir * randomRange(6, 14) + randomRange(-3, 3)
      bx = Math.max(0, Math.min(100, bx))
      by = Math.min(90, by)
      branch += ` L ${bx} ${by}`
    }
  }

  return { main: `M ${main}`, branch }
}

export default function LightningEffect() {
  const [boltPath, setBoltPath] = useState<BoltPath | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const trigger = useCallback(() => {
    const path = generateBoltPath()
    setBoltPath(path)

    const svg = svgRef.current
    const flash = flashRef.current

    // t=0: flash instant ON, no transition
    if (flash) {
      flash.style.transition = 'none'
      flash.style.opacity = '0.9'
    }
    // SVG stays hidden during flash
    if (svg) {
      svg.style.transition = 'none'
      svg.style.opacity = '0'
    }

    // Force reflow to ensure the "no transition" is applied
    void flash?.offsetHeight

    // t=0: schedule flash OFF + SVG ON after one frame
    requestAnimationFrame(() => {
      // Flash fades out over 100ms
      if (flash) {
        flash.style.transition = 'opacity 0.1s ease-out'
        flash.style.opacity = '0'
      }
      // SVG appears as flash fades
      if (svg) {
        svg.style.transition = 'none'
        svg.style.opacity = '1'
      }

      // t=400ms: SVG fades out
      setTimeout(() => {
        if (svg) {
          svg.style.transition = 'opacity 0.35s ease-out'
          svg.style.opacity = '0'
        }
      }, 200)
    })

    const nextDelay = 5000 + Math.random() * 15000
    timerRef.current = setTimeout(trigger, nextDelay)
  }, [])

  useEffect(() => {
    const initialDelay = 2000 + Math.random() * 5000
    timerRef.current = setTimeout(trigger, initialDelay)
    return () => clearTimeout(timerRef.current)
  }, [trigger])

  return (
    <>
      {boltPath && (
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ opacity: 0 }}
        >
          <defs>
            <filter id="boltGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="boltGlowCyan">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor="#88ccff" floodOpacity="0.5" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d={boltPath.main}
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#boltGlowCyan)"
          />
          <path
            d={boltPath.branch}
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#boltGlow)"
            opacity={0.7}
          />
        </svg>
      )}
      <div
        ref={flashRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: 'white',
          opacity: 0,
          mixBlendMode: 'overlay',
        }}
      />
    </>
  )
}
