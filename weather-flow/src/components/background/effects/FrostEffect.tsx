export default function FrostEffect() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `
          repeating-conic-gradient(
            from 0deg at 50% 50%,
            rgba(200, 220, 255, 0.03) 0deg,
            transparent 10deg,
            rgba(200, 220, 255, 0.03) 20deg
          ),
          repeating-linear-gradient(
            45deg,
            rgba(200, 220, 255, 0.02) 0px,
            transparent 2px,
            rgba(200, 220, 255, 0.02) 4px
          )
        `,
        backgroundSize: '200% 200%, 8px 8px',
        animation: 'frost-shimmer 8s ease-in-out infinite alternate',
      }}
    />
  )
}
