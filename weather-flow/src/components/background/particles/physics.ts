import type { Particle, ParticleConfig } from './types'

export function createParticles(canvasW: number, canvasH: number, config: ParticleConfig): Particle[] {
  const particles: Particle[] = []
  const [minSpeed, maxSpeed] = config.speed
  const [minSize, maxSize] = config.size
  const [minOp, maxOp] = config.opacity

  for (let i = 0; i < config.count; i++) {
    particles.push({
      x: Math.random() * canvasW,
      y: -Math.random() * canvasH,
      vx: 0,
      vy: minSpeed + Math.random() * (maxSpeed - minSpeed),
      size: minSize + Math.random() * (maxSize - minSize),
      opacity: minOp + Math.random() * (maxOp - minOp),
      rotation: 0,
      rotationSpeed: config.sway ? (Math.random() - 0.5) * 2 : 0,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: 0.5 + Math.random() * 1.5,
    })
  }
  return particles
}

export function updateParticles(
  particles: Particle[],
  dt: number,
  canvasW: number,
  canvasH: number,
  config: ParticleConfig,
  windSpeed: number,
): void {
  const windDrift = (windSpeed / 100) * config.windInfluence * 60

  for (const p of particles) {
    if (config.sway) {
      p.vx = windDrift + Math.sin(p.swayOffset + performance.now() / 1000 * p.swaySpeed) * 30
    } else {
      p.vx = windDrift
    }

    p.x += p.vx * dt
    p.y += p.vy * dt
    p.rotation += p.rotationSpeed * dt * 60

    if (p.y > canvasH + 10 || p.x < -10 || p.x > canvasW + 10) {
      p.y = -10
      p.x = Math.random() * canvasW
      p.rotation = 0
    }
  }
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  config: ParticleConfig,
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  for (const p of particles) {
    ctx.save()
    ctx.globalAlpha = p.opacity
    ctx.fillStyle = `rgb(${config.color})`
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rotation)

    if (config.isRound) {
      ctx.beginPath()
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      const angle = Math.atan2(p.vy, p.vx || 1)
      ctx.rotate(angle + Math.PI / 2)
      ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 8)
    }

    ctx.restore()
  }
}
