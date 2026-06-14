import { useRef, useEffect } from 'react'

interface Props {
  intensity: 'full' | 'subtle'
}

export default function SunbeamEffect({ intensity }: Props) {
  const beamRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(-30)

  useEffect(() => {
    const el = beamRef.current
    if (!el) return

    const speed = intensity === 'full' ? 15 : 10
    let raf: number

    const loop = () => {
      xRef.current += 0.15 * speed / 15
      if (xRef.current > 130) xRef.current = -30
      el.style.transform = `translateX(${xRef.current}%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [intensity])

  return (
    <div
      ref={beamRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `linear-gradient(110deg, transparent 0%, rgba(255,220,150,${intensity === 'full' ? 0.08 : 0.04}) 25%, rgba(255,200,100,${intensity === 'full' ? 0.12 : 0.06}) 40%, rgba(255,220,150,${intensity === 'full' ? 0.08 : 0.04}) 55%, transparent 80%)`,
        backgroundSize: '200% 100%',
        filter: 'blur(20px)',
        willChange: 'transform',
      }}
    />
  )
}
