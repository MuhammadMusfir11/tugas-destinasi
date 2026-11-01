const rays = [
  { left: '8%',  w: '14vw', r: '-18deg', dur: '34s', delay: '0s' },
  { left: '30%', w: '9vw',  r: '-14deg', dur: '42s', delay: '-12s' },
  { left: '52%', w: '16vw', r: '-20deg', dur: '38s', delay: '-6s' },
  { left: '74%', w: '10vw', r: '-16deg', dur: '46s', delay: '-20s' },
]

export default function LightRay() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {rays.map((ray, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '-20%',
            left: ray.left,
            width: ray.w,
            height: '140%',
            '--r': ray.r,
            transform: `rotate(${ray.r})`,
            transformOrigin: 'top center',
            background:
              'linear-gradient(to bottom, rgba(243,239,228,0.55), rgba(184,154,98,0.18) 45%, transparent 85%)',
            mixBlendMode: 'screen',
            maskImage: 'linear-gradient(to right, transparent, #000 50%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, #000 50%, transparent)',
            animation: `ray-sway ${ray.dur} ease-in-out ${ray.delay} infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  )
}