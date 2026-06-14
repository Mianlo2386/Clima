import { useMemo } from 'react'

interface Droplet {
  id: number
  left: number
  top: number
  size: number
  delay: number
  slide: boolean
  duration: number
}

interface Props {
  intensity: 'light' | 'medium' | 'heavy'
}

function generateDroplets(intensity: Props['intensity']): Droplet[] {
  const counts = { light: 12, medium: 20, heavy: 30 }
  const slidingCounts = { light: 3, medium: 5, heavy: 8 }
  const count = counts[intensity]
  const slideCount = slidingCounts[intensity]

  const droplets: Droplet[] = []

  for (let i = 0; i < count; i++) {
    droplets.push({
      id: i,
      left: Math.random() * 96 + 2,
      top: Math.random() * 90 + 5,
      size: i < slideCount ? 12 + Math.random() * 8 : 6 + Math.random() * 6,
      delay: Math.random() * 10,
      slide: i < slideCount,
      duration: 8 + Math.random() * 6,
    })
  }

  return droplets
}

export default function RaindropsEffect({ intensity }: Props) {
  const droplets = useMemo(() => generateDroplets(intensity), [intensity])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {droplets.map((d) => (
        <div
          key={d.id}
          className="absolute"
          style={{
            left: `${d.left}%`,
            top: d.slide ? `${-d.size - 5}px` : `${d.top}%`,
            width: d.size,
            height: d.size * 1.2,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            background: `
              radial-gradient(circle at 35% 30%,
                rgba(255,255,255,0.35) 0%,
                rgba(180,200,230,0.12) 40%,
                transparent 70%
              )
            `,
            backdropFilter: d.size > 12 ? 'blur(1.5px)' : undefined,
            animation: d.slide
              ? `droplet-slide ${d.duration}s linear ${d.delay}s infinite`
              : undefined,
          }}
        />
      ))}
    </div>
  )
}
