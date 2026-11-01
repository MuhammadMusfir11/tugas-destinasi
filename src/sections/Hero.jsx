import { useLayoutEffect, useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { goTo } from '../lib/chapters'
import MagneticButton from '../components/MagneticButton'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Hero({ play }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero-line', { yPercent: 115 })
      gsap.set('.hero-fade', { opacity: 0, y: 24 })

      if (reduced()) return
      gsap.to('.hero-content', {
        yPercent: -14, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '70% top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!play) return
    const k = reduced() ? 0.2 : 1
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .to('.hero-line', { yPercent: 0, duration: 1.6 * k, stagger: 0.14 }, 0.4)
        .to('.hero-fade', { opacity: 1, y: 0, duration: 1.2 * k, stagger: 0.16, ease: 'power3.out' }, 1.1)
    }, root)
    return () => ctx.revert()
  }, [play])

  return (
    <section ref={root} id="hero" className="relative h-svh min-h-[620px] overflow-hidden text-ink">
      <div className="hero-content relative z-10 flex h-full flex-col items-center justify-between px-6 pb-24 pt-[12vh] text-center sm:pb-28 sm:pt-[17vh]">
        <div>
          <p className="hero-fade font-news text-[0.6rem] leading-relaxed tracking-[0.4em] text-sepia sm:text-xs">
            KELOMPOK 1
            <span className="block">SOSIOLOGI PARIWISATA</span>
          </p>

          <h1 className="mt-7 font-headline text-ink">
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="hero-line block whitespace-nowrap text-[clamp(1.3rem,6.6vw,5rem)] font-black uppercase leading-[1.05] tracking-[0.02em]">
                Taman Hutan Raya
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="hero-line block text-[clamp(3.4rem,18vw,13rem)] font-bold italic leading-[0.95] text-rust">
                Djuanda
              </span>
            </span>
          </h1>

          <p className="hero-fade mt-5 font-news text-sm italic text-sepia sm:text-lg">
            A Journey Through Tahura Djuanda.
          </p>
        </div>

        <div className="hero-fade w-full">
          <p className="font-news text-[0.62rem] tracking-[0.3em] text-ink/80 sm:text-xs">SIAP MENJELAJAHI TAHURA?</p>
          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <MagneticButton
              onClick={() => goTo('about')}
              className="w-full max-w-[18rem] rounded-full bg-ink px-7 py-3.5 font-news text-[0.62rem] uppercase tracking-[0.3em] text-paper transition-colors duration-500 hover:bg-rust sm:w-auto"
            >
              Explore Our Website
            </MagneticButton>
            <MagneticButton
              onClick={() => goTo('destinasi')}
              className="w-full max-w-[18rem] rounded-full border border-ink/60 px-7 py-3.5 font-news text-[0.62rem] uppercase tracking-[0.3em] text-ink transition-colors duration-500 hover:border-rust hover:text-rust sm:w-auto"
            >
              Begin the Journey
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="hero-fade pointer-events-none absolute inset-x-0 bottom-4 z-10 flex flex-col items-center gap-2">
        <span className="relative block h-8 w-px overflow-hidden bg-ink/20">
          <span
            className="absolute inset-0 bg-rust"
            style={{ animation: 'scroll-line 2.6s ease-in-out infinite' }}
          />
        </span>
      </div>
    </section>
  )
}