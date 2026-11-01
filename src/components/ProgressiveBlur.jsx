export default function ProgressiveBlur({ className = '' }) {
  const layers = [0, 1, 2]
  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-0 ${className}`} aria-hidden="true">
      {layers.map((i) => {
        const blur = 0.6 * 2 ** i
        const mask = `linear-gradient(to bottom, transparent ${i * 22}%, #000 ${i * 22 + 25}%, #000 ${i * 22 + 45}%, transparent ${i * 22 + 70}%)`
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        )
      })}
    </div>
  )
}