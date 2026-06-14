import { useEffect, useRef } from 'react'

export default function LightningEffect() {
  const flashRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = flashRef.current
    if (!el) return

    let timeoutId: ReturnType<typeof setTimeout>
    let isMounted = true

    const flash = () => {
      if (!isMounted || !el) return

      el.style.opacity = '0.9'
      el.style.transition = 'opacity 0.05s ease-in'

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!isMounted || !el) return
          el.style.transition = 'opacity 0.4s ease-out'
          el.style.opacity = '0'
        })
      })

      const nextDelay = 5000 + Math.random() * 15000
      timeoutId = setTimeout(flash, nextDelay)
    }

    const initialDelay = 2000 + Math.random() * 5000
    timeoutId = setTimeout(flash, initialDelay)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div
      ref={flashRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundColor: 'white',
        opacity: 0,
        mixBlendMode: 'overlay',
      }}
    />
  )
}
