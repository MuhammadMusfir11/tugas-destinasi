import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { chapters, goTo } from '../lib/chapters'

const LEAD = 2.8   // durasi sisi bubble yang memimpin gerakan (detik)
const TRAIL = 3.2 // durasi sisi bubble yang menyusul (detik)

export default function Navbar({ visible, active }) {
  const wrapRef = useRef(null)
  const bubbleRef = useRef(null)
  const btnRefs = useRef({})
  const pos = useRef({ l: 0, r: 0 })
  const ready = useRef(false)
  const timer = useRef(null)
  const [pending, setPending] = useState(null)

  // Saat menu diklik, bubble langsung menuju tujuan (tidak ikut singgah di section tengah)
  const current = pending ?? active

  const apply = () => {
    gsap.set(bubbleRef.current, { x: pos.current.l, width: pos.current.r - pos.current.l })
  }

  const place = (animate) => {
    const wrap = wrapRef.current
    const bubble = bubbleRef.current
    const btn = btnRefs.current[current]
    if (!wrap || !bubble || !btn) return

    const w = wrap.getBoundingClientRect()
    const b = btn.getBoundingClientRect()
    const l = b.left - w.left + wrap.scrollLeft
    const r = l + b.width

    if (!animate) {
      gsap.killTweensOf(pos.current)
      pos.current.l = l
      pos.current.r = r
      apply()
      return
    }

    const goingRight = l > pos.current.l
    gsap.to(pos.current, {
      l, duration: goingRight ? TRAIL : LEAD, ease: 'power3.inOut', onUpdate: apply, overwrite: 'auto',
    })
    gsap.to(pos.current, {
      r, duration: goingRight ? LEAD : TRAIL, ease: 'power3.inOut', onUpdate: apply, overwrite: 'auto',
    })
  }

  useLayoutEffect(() => {
    place(ready.current)
    ready.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  useEffect(() => {
    const re = () => place(false)
    window.addEventListener('resize', re)
    document.fonts?.ready.then(re)
    return () => window.removeEventListener('resize', re)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  useEffect(() => {
    btnRefs.current[current]?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [current])

  useEffect(() => () => clearTimeout(timer.current), [])

  const onNav = (id) => {
    setPending(id)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setPending(null), 2000)
    goTo(id)
  }

  return (
    <header
      className={`hidden md:block fixed left-1/2 top-3 z-[60] w-[calc(100%-1.5rem)] -translate-x-1/2 transition-[opacity,translate] duration-1000 ease-forest md:top-4 md:w-[min(780px,90vw)] ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-6 opacity-0'
        }`}
    >
      <nav
        aria-label="Navigasi utama"
        className="rounded-full border border-gold/60 bg-ink shadow-[0_8px_24px_rgba(43,29,18,0.35)]"
      >
        <div ref={wrapRef} className="no-scrollbar relative overflow-x-auto rounded-full">
          <span
            ref={bubbleRef}
            aria-hidden="true"
            className="absolute inset-y-1.5 left-0 rounded-full bg-rust will-change-transform"
            style={{ width: 0 }}
          />

          <ul className="relative flex items-center px-2 py-1.5 md:justify-between md:px-3">
            {chapters.map((c) => (
              <li key={c.id} className="shrink-0">
                <button
                  ref={(el) => (btnRefs.current[c.id] = el)}
                  onClick={() => onNav(c.id)}
                  aria-current={current === c.id ? 'true' : undefined}
                  className={`relative whitespace-nowrap px-3.5 py-2 font-news text-[0.62rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-500 ${current === c.id ? 'text-paper' : 'text-paper/70 hover:text-paper'
                    }`}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}