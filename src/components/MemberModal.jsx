import { useEffect, useLayoutEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { img } from '../lib/images'
import useLockScroll from '../hooks/useLockScroll'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export default function MemberModal({ m, rect, onClosed }) {
  const src = img(m.id)
  const backdrop = useRef(null)
  const sheet = useRef(null)
  const closeBtn = useRef(null)
  const openTl = useRef(null)
  const closing = useRef(false)
  useLockScroll()

  // Bentuk awal = posisi prangko yang diklik
  const insetFromStamp = () => {
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
      gsap.set(el, { clipPath: insetFromStamp() })
      gsap.set(backdrop.current, { opacity: 0 })
      gsap.set('.mm-fade', { opacity: 0, y: 20 })
      gsap.set('.mm-img', { scale: 1.2 })

      openTl.current = gsap
        .timeline({ onComplete: () => closeBtn.current?.focus({ preventScroll: true }) })
        .to(backdrop.current, { opacity: 1, duration: 0.6 * k }, 0)
        .to(el, { clipPath: 'inset(0px 0px 0px 0px)', duration: 1 * k, ease: 'expo.inOut' }, 0)
        .to('.mm-img', { scale: 1, duration: 1.3 * k, ease: 'power3.out' }, 0.1)
        .to('.mm-fade', { opacity: 1, y: 0, duration: 0.8 * k, ease: 'power3.out', stagger: 0.08 }, 0.6 * k)
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
      .to(el.querySelectorAll('.mm-fade'), { opacity: 0, duration: 0.25 * k }, 0)
      .to(el, { clipPath: insetFromStamp(), duration: 0.8 * k, ease: 'expo.inOut' }, 0.1)
      .to(backdrop.current, { opacity: 0, duration: 0.6 * k }, 0.3)
  }

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="mm-name">
      <div ref={backdrop} onClick={close} className="absolute inset-0 bg-ink/75 backdrop-blur-lg" aria-hidden="true" />

      <div
        ref={sheet}
        className="paper relative z-10 text-ink"
        style={{ width: 'min(90vw, 400px, calc((88vh - 150px) * 0.8 + 32px))' }}
      >
        <div className="relative z-10 p-4">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink">
            {src ? (
              <img
                src={src}
                alt={`Foto ${m.name}`}
                className="mm-img absolute inset-0 h-full w-full object-cover"
                style={{ filter: 'sepia(0.28) contrast(1.05) saturate(0.9)' }}
              />
            ) : (
              <div className="mm-img absolute inset-0 bg-linear-to-b from-sepia/60 to-ink/70" />
            )}
          </div>

          <div className="mm-fade px-1 pb-2 pt-5 text-center">
            <h3 id="mm-name" className="font-headline text-2xl font-black uppercase leading-tight tracking-tight">
              {m.name}
            </h3>
            <p className="mt-2 font-news text-sm tracking-[0.25em] text-rust">NIM {m.nim}</p>
          </div>
        </div>

        <button
          ref={closeBtn}
          type="button"
          onClick={close}
          aria-label="Tutup foto anggota"
          className="mm-fade absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-ink text-paper transition-colors duration-300 hover:bg-rust"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}