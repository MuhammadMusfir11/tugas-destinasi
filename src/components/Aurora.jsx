const bands = [
  { left: '-15%', w: '62%', from: '#91A889', to: '#284A35', anim: 'aurora-a', dur: '22s', delay: '0s',   o: 0.65 },
  { left: '18%',  w: '55%', from: '#B89A62', to: '#7E8B52', anim: 'aurora-b', dur: '28s', delay: '-8s',  o: 0.42 },
  { left: '42%',  w: '60%', from: '#617A5D', to: '#10261C', anim: 'aurora-c', dur: '25s', delay: '-14s', o: 0.6 },
  { left: '62%',  w: '50%', from: '#D9CEB8', to: '#617A5D', anim: 'aurora-a', dur: '34s', delay: '-20s', o: 0.3, show: 'hidden md:block' },
]

export default function Aurora({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {bands.map((b, i) => (
        <div
          key={i}
          className={`absolute ${b.show ?? ''}`}
          style={{ left: b.left, top: '-10%', width: b.w, height: '90%', opacity: b.o, mixBlendMode: 'screen' }}
        >
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(to top, transparent 0%, ${b.to} 25%, ${b.from} 62%, transparent 100%)`,
              filter: 'blur(48px)',
              transformOrigin: 'bottom center',
              animation: `${b.anim} ${b.dur} ease-in-out ${b.delay} infinite`,
              willChange: 'transform, opacity',
            }}
          />
        </div>
      ))}

      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 115%, rgba(145,168,137,0.3), transparent 60%)' }}
      />
    </div>
  )
}