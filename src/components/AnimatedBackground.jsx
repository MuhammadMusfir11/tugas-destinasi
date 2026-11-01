const glows = [
  { color: 'rgba(255,236,190,0.65)', size: '70vmax', x: '-20%', y: '-20%', anim: 'drift-a', dur: '46s' },
  { color: 'rgba(176,138,85,0.28)',  size: '60vmax', x: '45%',  y: '35%',  anim: 'drift-b', dur: '58s' },
  { color: 'rgba(140,59,34,0.12)',   size: '50vmax', x: '-10%', y: '55%',  anim: 'drift-c', dur: '66s' },
]

export default function AnimatedBackground() {
  return (
    <div className="paper fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {glows.map((g, i) => (
        <div
          key={i}
          className="bg-blob"
          style={{
            width: g.size,
            height: g.size,
            left: g.x,
            top: g.y,
            background: `radial-gradient(circle, ${g.color} 0%, transparent 65%)`,
            animationName: g.anim,
            animationDuration: g.dur,
          }}
        />
      ))}
    </div>
  )
}