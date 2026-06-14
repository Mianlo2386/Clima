import { useRef, useEffect } from 'react'

interface FogLayer {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
}

function createLayers(): FogLayer[] {
  return [
    { x: 0, y: 60, size: 500, speed: 0.3, opacity: 0.15 },
    { x: 30, y: 30, size: 400, speed: 0.6, opacity: 0.1 },
    { x: 60, y: 50, size: 600, speed: 0.2, opacity: 0.12 },
    { x: 80, y: 40, size: 350, speed: 0.5, opacity: 0.08 },
  ]
}

export default function FogEffect() {
  const elRefs = useRef<(HTMLDivElement | null)[]>([])
  const layersRef = useRef<FogLayer[]>(createLayers())
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const layers = layersRef.current
    const els = elRefs.current

    const loop = () => {
      for (let i = 0; i < layers.length; i++) {
        const l = layers[i]
        l.x += l.speed * 0.03
        if (l.x > 130) l.x = -30
        const el = els[i]
        if (el) {
          el.style.transform = `translate(${l.x}%, ${l.y}%)`
        }
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const layers = layersRef.current

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {layers.map((l, i) => (
        <div
          key={i}
          ref={el => { elRefs.current[i] = el }}
          className="absolute"
          style={{
            width: l.size,
            height: l.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(200,210,220,${l.opacity}) 0%, transparent 70%)`,
            filter: 'blur(100px)',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}
