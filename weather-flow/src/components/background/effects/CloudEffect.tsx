import { useRef, useEffect } from 'react'

interface Props {
  density: 'light' | 'heavy'
}

const CLOUD_SHAPES = [
  'M40,60 Q20,60 20,45 Q20,30 35,30 Q38,15 55,15 Q70,15 73,30 Q85,30 85,45 Q85,60 65,60 Z',
  'M30,55 Q15,55 15,42 Q15,30 30,28 Q35,15 55,15 Q70,15 75,28 Q88,28 88,42 Q88,55 70,55 Z',
  'M35,65 Q15,65 15,50 Q15,35 32,33 Q38,18 58,18 Q75,18 80,33 Q92,33 92,50 Q92,65 70,65 Z',
  'M25,50 Q10,50 10,38 Q10,25 25,23 Q30,8 50,8 Q68,8 72,23 Q85,25 85,38 Q85,50 65,50 Z',
  'M45,70 Q25,70 25,55 Q25,42 40,40 Q45,25 60,25 Q78,25 80,40 Q95,40 95,55 Q95,70 75,70 Z',
]

interface CloudInstance {
  id: number
  shape: string
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  layer: 'front' | 'back'
}

function createClouds(density: Props['density']): CloudInstance[] {
  const count = density === 'light' ? 4 : 7
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    shape: CLOUD_SHAPES[i % CLOUD_SHAPES.length],
    x: (i / count) * 120 - 20,
    y: 5 + Math.random() * 70,
    size: density === 'heavy' ? 60 + Math.random() * 80 : 40 + Math.random() * 60,
    speed: 0.3 + Math.random() * 0.6,
    opacity: density === 'heavy'
      ? (i < 3 ? 0.07 : 0.04)
      : (i < 2 ? 0.05 : 0.03),
    layer: i % 2 === 0 ? 'front' : 'back',
  }))
}

export default function CloudEffect({ density }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cloudsRef = useRef<CloudInstance[]>(createClouds(density))

  useEffect(() => {
    const clouds = cloudsRef.current
    const container = containerRef.current
    if (!container) return

    let raf: number

    const loop = () => {
      for (const c of clouds) {
        c.x += c.speed * 0.04
        if (c.x > 130) c.x = -30
      }

      container.innerHTML = ''
      for (const c of clouds) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('viewBox', '0 0 100 100')
        svg.setAttribute('aria-hidden', 'true')
        svg.style.position = 'absolute'
        svg.style.width = `${c.size}%`
        svg.style.height = `${c.size * 0.5}%`
        svg.style.left = `${c.x}%`
        svg.style.top = `${c.y}%`
        svg.style.opacity = String(c.opacity)
        svg.style.filter = 'blur(2px)'
        svg.style.willChange = 'transform'
        svg.style.pointerEvents = 'none'

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', c.shape)
        path.setAttribute('fill', 'white')
        svg.appendChild(path)
        container.appendChild(svg)
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      if (container) container.innerHTML = ''
    }
  }, [density])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    />
  )
}
