import { useRef, useEffect, useState } from 'react'
import type { ParticleMode } from './types'
import { PARTICLE_CONFIGS } from './types'
import { createParticles, updateParticles, drawParticles } from './physics'

interface Props {
  mode: ParticleMode
  windSpeed: number
}

export default function ParticleCanvas({ mode, windSpeed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const [reducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  )

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const config = PARTICLE_CONFIGS[mode]
    let particles = createParticles(canvas.width, canvas.height, config)

    const loop = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = time

      updateParticles(particles, dt, canvas.width, canvas.height, config, windSpeed)
      drawParticles(ctx, particles, config)

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [mode, windSpeed, reducedMotion])

  if (reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
