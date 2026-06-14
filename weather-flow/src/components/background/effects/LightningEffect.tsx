import { useEffect, useRef, useState, useCallback } from 'react'

interface BoltPath {
  main: string
  branch: string
}

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function generateBoltPath(): BoltPath {
  const startX = randomRange(30, 70)
  const segments = 7

  let main = `M ${startX} 0`
  let px = startX

  for (let i = 1; i <= segments; i++) {
    px = px + randomRange(-25, 25)
    px = Math.max(5, Math.min(95, px))
    const y = (i / segments) * 100
    main += ` L ${px} ${y}`
  }

  main += ` L ${px + randomRange(-10, 10)} 100`

  const branchPoints = [Math.floor(segments * 0.35), Math.floor(segments * 0.6)]
  let branch = ''

  for (const bp of branchPoints) {
    const ratio = bp / segments
    const bY = ratio * 100
    const branchDir = Math.random() > 0.5 ? 1 : -1

    branch += ` M ${px + branchDir * 8} ${bY}`
    let bpx = px + branchDir * 8
    let bpy = bY

    for (let j = 1; j <= 3; j++) {
      bpy = bY + (j / 3) * randomRange(20, 35)
      bpx = bpx + branchDir * randomRange(8, 18) + randomRange(-4, 4)
      bpx = Math.max(0, Math.min(100, bpx))
      bpy = Math.min(92, bpy)
      branch += ` L ${bpx} ${bpy}`
    }
  }

  return { main, branch }
}

export default function LightningEffect() {
  const [boltPath, setBoltPath] = useState<BoltPath | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const trigger = useCallback(() => {
    setBoltPath(generateBoltPath())

    const svg = svgRef.current
    const flash = flashRef.current

    if (svg) svg.style.opacity = '1'
    if (flash) {
      flash.style.transition = 'opacity 0.05s ease-in'
      flash.style.opacity = '0.85'
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (svg) {
          svg.style.transition = 'opacity 0.4s ease-out'
          svg.style.opacity = '0'
        }
        if (flash) {
          flash.style.transition = 'opacity 0.4s ease-out'
          flash.style.opacity = '0'
        }
      })
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
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d={boltPath.main}
            fill="none"
            stroke="white"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#boltGlow)"
          />
          <path
            d={boltPath.branch}
            fill="none"
            stroke="white"
            strokeWidth="0.8"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#boltGlow)"
            opacity={0.6}
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
