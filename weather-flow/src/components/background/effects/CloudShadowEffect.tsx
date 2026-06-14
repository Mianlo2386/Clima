import { useRef, useEffect } from 'react'

interface Props {
  density: 'light' | 'heavy'
}

interface BlobData {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
}

function createBlobs(density: Props['density']): BlobData[] {
  const count = density === 'light' ? 3 : 5
  return Array.from({ length: count }, (_, i) => ({
    x: (i / count) * 100 - 20,
    y: 20 + Math.random() * 40,
    size: 250 + Math.random() * 300,
    speed: 2 + Math.random() * 3,
    opacity: density === 'light' ? 0.04 : 0.08,
  }))
}

export default function CloudShadowEffect({ density }: Props) {
  const elRefs = useRef<(HTMLDivElement | null)[]>([])
  const blobsRef = useRef<BlobData[]>(createBlobs(density))
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const blobs = blobsRef.current
    const els = elRefs.current

    const loop = () => {
      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i]
        b.x += b.speed * 0.05
        if (b.x > 130) b.x = -30
        const el = els[i]
        if (el) {
          el.style.transform = `translate(${b.x}%, ${b.y}%)`
        }
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [density])

  const blobs = blobsRef.current

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {blobs.map((b, i) => (
        <div
          key={i}
          ref={el => { elRefs.current[i] = el }}
          className="absolute"
          style={{
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(0,0,0,${b.opacity}) 0%, transparent 70%)`,
            filter: 'blur(60px)',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}
