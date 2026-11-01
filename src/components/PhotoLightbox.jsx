import { useEffect, useLayoutEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { img } from '../lib/images'
import useLockScroll from '../hooks/useLockScroll'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export default function PhotoLightbox({ photos, index, onIndex, onClose }) {
  const p = photos[index]
  const src = img(p.id)
  const backdrop = useRef(null)
  const frame = useRef(null)
  const dir = useRef(0)
  const busy = useRef(false)
  const closing = useRef(false)
  useLockScroll()

  useLayoutEffect(() => {
    gsap.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: reduced() ? 0.01 : 0.6 })
  }, [])

  // Masuk: skala + blur + fade (juga setiap berganti foto)
  useLayoutEffect(() => {
    const k = reduced() ? 0.01 : 1
    gsap.fromTo(
      frame.current,
      { opacity: 0, scale: 0.88, filter: 'blur(14px)', x: dir.current * 60 },
      { opacity: 1, scale: 1, filter: 'blur(0px)', x: 0, duration: 0.9 * k, ease: 'expo.out', clearProps: 'filter', onComplete: () => { busy.current = false } }
    )
  }, [index])

  const go = (d) => {
    if (busy.current || closing.current) return
    busy.current = true
    dir.current = d
    const k = reduced() ? 0.01 : 1
    gsap.to(frame.current, {
      opacity: 0, scale: 0.94, filter: 'blur(8px)', x: -d * 40, duration: 0.22 * k, ease: 'power2.in',
      onComplete: () => onIndex((index + d + photos.length) % photos.length),
    })
  }

  const close = () => {
    if (closing.current) return
    closing.current = true
    const k = reduced() ? 0.01 : 1
    gsap
      .timeline({ onComplete: onClose })
      .to(frame.current, { opacity: 0, scale: 0.92, filter: 'blur(10px)', duration: 0.4 * k, ease: 'power2.in' }, 0)
      .to(backdrop.current, { opacity: 0, duration: 0.5 * k }, 0.1)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  const btn =
    'absolute z-20 grid h-11 w-11 place-items-center rounded-full bg-ink text-paper transition-colors duration-300 hover:bg-rust'

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Foto dokumentasi">
      <div ref={backdrop} onClick={close} className="absolute inset-0 bg-ink/80 backdrop-blur-xl" aria-hidden="true" />

      <figure ref={frame} className="relative z-10 max-w-[min(92vw,1000px)]">
        <div className="bg-[#f1e6c8] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.5)] md:p-4">
          {src ? (
            <img
              src={src}
              alt={p.caption}
              className="block max-h-[66vh] max-w-full object-contain md-max-h-[70vh]"
              style={{ filter: 'sepia(0.22) contrast(1.04)' }}
            />
          ) : (
            <div className="grid aspect-[4/3] w-[min(80vw,640px)] place-items-center bg-linear-to-b from-sepia/60 to-ink/70 font-headline text-5xl font-black text-paper/60">
              {String(index + 1).padStart(2, '0')}
            </div>
          )}
          <figcaption className="mt-3 flex items-baseline justify-between gap-6 font-news text-[0.75rem] italic text-sepia">
            <span>{p.caption}</span>
            <span className="not-italic tracking-[0.25em]">
              {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
            </span>
          </figcaption>
        </div>
      </figure>

      <button type="button" onClick={close} aria-label="Tutup foto" className={`${btn} right-4 top-4`}>
        <X size={18} />
      </button>
      <button type="button" onClick={() => go(-1)} aria-label="Foto sebelumnya" className={`${btn} bottom-5 left-5 md:bottom-auto md:left-8 md:top-1/2 md:-translate-y-1/2`}>
        <ChevronLeft size={20} />
      </button>
      <button type="button" onClick={() => go(1)} aria-label="Foto berikutnya" className={`${btn} bottom-5 right-5 md:bottom-auto md:right-8 md:top-1/2 md:-translate-y-1/2`}>
        <ChevronRight size={20} />
      </button>
    </div>
  )
}