import { useEffect, useLayoutEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { img } from '../lib/images'
import ProgressiveBlur from './ProgressiveBlur'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

const rows = [
  ['Lokasi', 'location'],
  ['Makna sejarah', 'history'],
  ['Fakta menarik', 'fact'],
]

export default function DestinationModal({ item, total, onClosed }) {
  const { d, index, rect } = item
  const src = img(d.id)
  const sheet = useRef(null)
  const backdrop = useRef(null)
  const closeBtn = useRef(null)
  const openTl = useRef(null)
  const closing = useRef(false)

  // Bentuk potongan awal = posisi panel yang diklik
  const insetFromPanel = () => {
    const s = sheet.current.getBoundingClientRect()
    const t = Math.max(0, rect.top - s.top)
    const r = Math.max(0, s.right - rect.right)
    const b = Math.max(0, s.bottom - rect.bottom)
    const l = Math.max(0, rect.left - s.left)
    return `inset(${t}px ${r}px ${b}px ${l}px)`
  }

  useLayoutEffect(() => {
    const k = reduced() ? 0.01 : 1
    const el = sheet.current

    const ctx = gsap.context(() => {
      gsap.set(el, { clipPath: insetFromPanel() })
      gsap.set(backdrop.current, { opacity: 0 })
      gsap.set('.dm-fade', { opacity: 0, y: 24 })
      gsap.set('.dm-img', { scale: 1.25 })

      openTl.current = gsap
        .timeline({ onComplete: () => closeBtn.current?.focus({ preventScroll: true }) })
        .to(backdrop.current, { opacity: 1, duration: 0.6 * k }, 0)
        .to(el, { clipPath: 'inset(0px 0px 0px 0px)', duration: 1.1 * k, ease: 'expo.inOut' }, 0)
        .to('.dm-img', { scale: 1, duration: 1.4 * k, ease: 'power3.out' }, 0.1)
        .to('.dm-fade', { opacity: 1, y: 0, duration: 0.9 * k, ease: 'power3.out', stagger: 0.08 }, 0.7 * k)
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = () => {
    if (closing.current) return
    closing.current = true
    openTl.current?.kill()
    const k = reduced() ? 0.01 : 1
    const el = sheet.current

    gsap
      .timeline({ onComplete: onClosed })
      .to(el.querySelectorAll('.dm-fade'), { opacity: 0, duration: 0.25 * k }, 0)
      .to(el, { clipPath: insetFromPanel(), duration: 0.85 * k, ease: 'expo.inOut' }, 0.1)
      .to(backdrop.current, { opacity: 0, duration: 0.6 * k }, 0.3)
  }

  // Kunci scroll halaman + Escape
  useEffect(() => {
    window.__lenis?.stop()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      window.__lenis?.start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-labelledby="dm-title">
      {/* Latar blur; klik di luar = tutup */}
      <div
        ref={backdrop}
        onClick={close}
        className="absolute inset-0 bg-ink/70 backdrop-blur-md"
        aria-hidden="true"
      />

      <div ref={sheet} className="paper absolute inset-3 overflow-hidden text-ink md:inset-10">
        <div className="relative z-10 grid h-full grid-rows-[38%_1fr] md:grid-cols-[1.15fr_1fr] md:grid-rows-1">
          {/* Foto besar */}
          <div className="relative overflow-hidden bg-ink">
            {src ? (
              <img
                src={src}
                alt={`${d.name}, Tahura Djuanda`}
                className="dm-img absolute inset-0 h-full w-full object-cover"
                style={{ filter: 'sepia(0.28) contrast(1.05) saturate(0.9)' }}
              />
            ) : (
              <div className="dm-img absolute inset-0 bg-linear-to-b from-sepia to-ink" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />
            <ProgressiveBlur className="h-1/3" />
            <p className="absolute bottom-5 left-6 font-news text-[0.62rem] tracking-[0.35em] text-paper md:bottom-8 md:left-10">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </p>
          </div>

          {/* Teks editorial */}
          <div data-lenis-prevent className="overflow-y-auto p-6 md:p-12">
            <p className="dm-fade font-news text-[0.6rem] tracking-[0.4em] text-sepia">DESTINATION</p>
            <h3
              id="dm-title"
              className="dm-fade mt-4 font-headline text-[clamp(2rem,4.6vw,3.6rem)] font-black uppercase leading-[0.98] tracking-tight"
            >
              {d.name}
            </h3>
            <p className="dm-fade mt-5 font-news text-base italic leading-snug text-sepia">{d.summary}</p>

            <dl className="mt-8">
              {rows.map(([label, key]) => (
                <div key={key} className="dm-fade border-t border-ink/30 py-4">
                  <dt className="font-news text-[0.58rem] uppercase tracking-[0.3em] text-rust">{label}</dt>
                  <dd className="mt-2 font-news text-[0.9rem] leading-[1.7] text-ink/90">{d[key]}</dd>
                </div>
              ))}
              <div className="border-t border-ink/30" />
            </dl>
          </div>
        </div>

        <button
          ref={closeBtn}
          type="button"
          onClick={close}
          aria-label="Tutup detail"
          className="dm-fade absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-ink text-paper transition-colors duration-300 hover:bg-rust"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}