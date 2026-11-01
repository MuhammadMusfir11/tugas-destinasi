import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { history } from '../data/history'
import HistoryTimeline from '../components/HistoryTimeline'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export default function History() {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: '.hs-head', start: 'top 80%' } })
        .from('.hs-rule', { scaleX: 0, transformOrigin: 'center', duration: 1.4, ease: 'expo.out' })
        .from('.hs-eyebrow', { opacity: 0, y: 14, duration: 0.9, ease: 'power3.out' }, 0.2)
        .from('.hs-line', {
          clipPath: 'inset(0 0 100% 0)', y: 30, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.15,
        }, 0.3)
        .from('.hs-sub', { opacity: 0, y: 16, duration: 1, ease: 'power3.out' }, 0.9)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="history" className="relative overflow-hidden py-24 text-ink md:py-32">
      <header className="hs-head mx-auto max-w-6xl px-6 md:px-12">
        <div className="hs-rule border-t-[3px] border-double border-ink" />
        <h2 className="mt-5 font-headline font-black uppercase leading-[0.95] tracking-tight text-[clamp(2.2rem,6.2vw,5.4rem)]">
          <span className="hs-line block">Dari Hutan Lindung</span>
          <span className="hs-line block text-rust">Menjadi Tahura Pertama</span>
        </h2>
        <p className="hs-sub mt-5 font-news text-sm italic text-sepia sm:text-base">
          Satu cerita, satu kali gulir.
        </p>
      </header>

      <div className="mt-16 md:mt-24">
        <HistoryTimeline events={history} />
      </div>
    </section>
  )
}