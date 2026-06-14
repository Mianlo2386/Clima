import { useMemo } from 'react'

interface Streak {
  left: number
  height: number
  width: number
  opacity: number
  duration: number
  delay: number
}

interface Props {
  intensity: 'light' | 'medium' | 'heavy'
}

function generateStreaks(intensity: Props['intensity']): Streak[] {
  const count = intensity === 'light' ? 15 : intensity === 'medium' ? 30 : 50
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    height: 20 + Math.random() * 40,
    width: 1,
    opacity: 0.03 + Math.random() * 0.05,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 4,
  }))
}

export default function WetGlassEffect({ intensity }: Props) {
  const streaks = useMemo(() => generateStreaks(intensity), [intensity])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {streaks.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${s.left}%`,
            top: `-${s.height + 10}px`,
            width: `${s.width}px`,
            height: `${s.height}px`,
            background: 'linear-gradient(to bottom, rgba(180,200,230,0.5), rgba(180,200,230,0.1))',
            opacity: s.opacity,
            animation: `wet-glass-fall ${s.duration}s linear ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
