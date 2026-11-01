import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { welcomeSrc } from '../lib/welcomeImage'
import Aurora from './Aurora'

const WORD = 'WELCOME'

const stars = Array.from({ length: 48 }, (_, i) => ({
  left: `${(i * 53) % 100}%`,
  top: `${(i * 29) % 62}%`,
  size: 1 + (i % 3 === 0 ? 1 : 0),
  dur: `${3 + (i % 5)}s`,
  delay: `-${(i * 7) % 9}s`,
}))

export default function LoadingScreen({ onReveal, onDone }) {
  const root = useRef(null)
  const content = useRef(null)

  useEffect(() => {
    let cancelled = false
    let exit
    const k = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.2 : 1

    const img = new Image()
    img.src = welcomeSrc ?? ''
    const assets = Promise.all([
      welcomeSrc ? img.decode().catch(() => {}) : Promise.resolve(),
      document.fonts.ready,
    ])

    gsap.set('.wl-char', { yPercent: 70, opacity: 0 })
    gsap.set('.wl-sub', { opacity: 0, y: 14 })
    if (welcomeSrc) gsap.set('.wl-photo', { scale: 1.15, opacity: 0 })

    const intro = gsap.timeline({
      onComplete: () => {
        assets.then(() => {
          if (cancelled) return
          exit = gsap
            .timeline()
            .to(content.current, { opacity: 0, y: -20, duration: 0.8 * k, ease: 'power2.in' })
            .add(() => onReveal(), '>-0.2')
            .to(root.current, { opacity: 0, duration: 1.4 * k, ease: 'power1.inOut' }, '<')
            .add(() => onDone())
        })
      },
    })

    if (welcomeSrc) {
      intro.to('.wl-photo', { opacity: 1, scale: 1, duration: 3.2 * k, ease: 'power2.out' }, 0)
    }

    intro
      .to('.wl-char', {
        yPercent: 0, opacity: 1, duration: 1.2 * k, ease: 'expo.out', stagger: 0.09,
      }, 0.5 * k)
      .to('.wl-sub', { opacity: 1, y: 0, duration: 1 * k, ease: 'power3.out', stagger: 0.2 }, 1.6 * k)
      .to({}, { duration: 1.1 * k })

    return () => {
      cancelled = true
      intro.kill()
      exit?.kill()
    }
  }, [onReveal, onDone])

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #08120D 0%, #10261C 55%, #284A35 100%)' }}
      role="status"
      aria-label="Selamat datang"
    >
      {welcomeSrc ? (
        <>
          <img
            className="wl-photo absolute inset-0 h-full w-full object-cover will-change-transform"
            src={welcomeSrc}
            alt=""
          />
          <div className="absolute inset-0 bg-forest/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-linear-to-b from-black-forest/75 via-deep/40 to-black-forest/85" />
          <Aurora className="opacity-50" />
        </>
      ) : (
        <>
          <Aurora />

          {stars.map((s, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="absolute rounded-full bg-cream"
              style={{
                left: s.left, top: s.top, width: s.size, height: s.size,
                animation: `twinkle ${s.dur} ease-in-out ${s.delay} infinite`,
              }}
            />
          ))}

          <div
            aria-hidden="true"
            className="absolute right-[12%] top-[10%] h-14 w-14 rounded-full sm:h-20 sm:w-20"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #FAF9F4, #D9CEB8)',
              boxShadow: '0 0 60px 18px rgba(243,239,228,0.18)',
            }}
          />

          <svg
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[34%] w-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path fill="#284A35" opacity="0.55"
              d="M0 170 C160 90 300 200 480 140 S820 60 1020 150 S1320 110 1440 150 V320 H0Z" />
            <path fill="#173324" opacity="0.9"
              d="M0 230 C200 170 360 260 560 210 S940 150 1140 225 S1360 200 1440 215 V320 H0Z" />
            <path fill="#08120D"
              d="M0 280 C220 240 420 300 640 270 S1020 235 1220 275 S1380 265 1440 270 V320 H0Z" />
          </svg>
        </>
      )}

      <div ref={content} className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1
          aria-label={WORD}
          className="font-display text-[clamp(2.8rem,13vw,8.5rem)] font-light leading-none tracking-[0.12em] text-cream"
          style={{ textShadow: '0 2px 40px rgba(8,18,13,0.55), 0 0 40px rgba(243,239,228,0.2)' }}
        >
          {WORD.split('').map((c, i) => (
            <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.1em] align-bottom">
              <span className="wl-char inline-block">{c}</span>
            </span>
          ))}
        </h1>

        <p className="wl-sub mt-8 text-[0.6rem] tracking-[0.45em] text-sand sm:text-xs">PRESENTED BY</p>
        <p className="wl-sub mt-2 font-display text-xl tracking-[0.3em] text-gold sm:text-2xl">KELOMPOK 1</p>
      </div>
    </div>
  )
}