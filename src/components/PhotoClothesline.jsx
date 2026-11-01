import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { img } from '../lib/images'

const W = 220      // lebar tiap foto
const STEP = 262   // jarak antar foto
const PAD = 56
const AMP = 16     // naik-turunnya tali
const H = 560
const ROT = [-3, 2.4, -1.6, 3.1, -2.6, 1.8, -3.2, 2.1, -1.2, 2.8]

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
// Foto berselang-seling tinggi dan rendah mengikuti lekuk tali
const yAt = (x) => 30 + AMP * Math.sin(((x - (PAD + W / 2)) / STEP) * Math.PI + Math.PI / 2)

export default function PhotoClothesline({ photos, onOpen }) {
  const scroller = useRef(null)
  const drag = useRef({ active: false, captured: false, x: 0, moved: 0, id: 0 })
  const [grabbing, setGrabbing] = useState(false)

  const width = PAD * 2 + W + (photos.length - 1) * STEP
  const cx = (i) => PAD + W / 2 + i * STEP

  const path = useMemo(() => {
    let d = ''
    for (let x = 0; x <= width; x += 14) d += `${x ? 'L' : 'M'} ${x} ${yAt(x).toFixed(1)} `
    return d
  }, [width])

  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.cl-string', {
        opacity: 0, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: scroller.current, start: 'top 82%' },
      })
      gsap.from('.cl-item', {
        y: -70, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: scroller.current, start: 'top 80%' },
      })
    }, scroller)
    return () => ctx.revert()
  }, [])

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { active: true, captured: false, x: e.clientX, moved: 0, id: e.pointerId }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d.active) return
    const dx = e.clientX - d.x
    d.x = e.clientX
    d.moved += Math.abs(dx)
    if (d.moved > 6 && !d.captured) {
      scroller.current.setPointerCapture(d.id)
      d.captured = true
      setGrabbing(true)
    }
    if (d.captured) scroller.current.scrollLeft -= dx
  }
  const endDrag = () => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    if (d.captured) {
      try { scroller.current.releasePointerCapture(d.id) } catch { /* sudah lepas */ }
    }
    d.captured = false
    setGrabbing(false)
  }

  const by = (dir) => scroller.current.scrollBy({ left: dir * STEP * 2, behavior: 'smooth' })

  return (
    <div>
      <div
        ref={scroller}
        className={`no-scrollbar overflow-x-auto ${grabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(e) => e.preventDefault()}
      >
        <div className="relative" style={{ width, height: H }}>
          <svg className="cl-string pointer-events-none absolute left-0 top-0" width={width} height={100} aria-hidden="true">
            <path d={path} fill="none" stroke="rgba(43,29,18,0.22)" strokeWidth="3" transform="translate(0 4)" />
            <path d={path} fill="none" stroke="#4a3220" strokeWidth="1.6" strokeLinecap="round" />
          </svg>

          {photos.map((p, i) => {
            const src = img(p.id)
            return (
              <button
                key={p.id}
                type="button"
                aria-label={`Perbesar foto: ${p.caption}`}
                onClick={() => { if (drag.current.moved > 6) return; onOpen(i) }}
                className="cl-item sway group absolute block select-none text-left"
                style={{
                  left: cx(i) - W / 2,
                  top: yAt(cx(i)),
                  width: W,
                  '--r': `${ROT[i % ROT.length]}deg`,
                  animationDelay: `-${(i * 1.3) % 7}s`,
                }}
              >
                {/* Penjepit */}
                <span
                  aria-hidden="true"
                  className="absolute -top-3 left-1/2 z-10 h-7 w-3 -translate-x-1/2 rounded-[2px] border border-[#3a2413] bg-linear-to-b from-[#c9a06a] to-[#8a6238]"
                >
                  <span className="absolute inset-x-0 top-1/2 h-px bg-[#3a2413]" />
                </span>

                <span className="mt-1.5 block bg-[#f1e6c8] p-2 pb-3 shadow-[0_10px_18px_rgba(43,29,18,0.3)] transition-transform duration-500 ease-forest group-hover:-translate-y-1 group-hover:scale-[1.03]">
                  {src ? (
                    <img
                      className="block h-auto w-full"
                      style={{ filter: 'sepia(0.3) contrast(1.05) saturate(0.88)' }}
                      src={src}
                      alt={p.caption}
                      loading="lazy"
                      draggable={false}
                    />
                  ) : (
                    <span className="block aspect-[4/5] w-full bg-linear-to-b from-sepia/60 to-ink/70" />
                  )}
                  <span className="mt-2 block font-news text-[0.62rem] italic leading-snug text-sepia">
                    {String(i + 1).padStart(2, '0')} · {p.caption}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mx-auto mt-2 flex max-w-6xl items-center justify-between px-6 md:px-12">
        <p className="font-news text-[0.62rem] italic tracking-[0.15em] text-sepia">
          Tarik, geser, atau klik foto untuk memperbesar.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => by(-1)}
            aria-label="Foto sebelumnya"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/50 text-ink transition-colors duration-300 hover:border-rust hover:bg-rust hover:text-paper"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => by(1)}
            aria-label="Foto berikutnya"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/50 text-ink transition-colors duration-300 hover:border-rust hover:bg-rust hover:text-paper"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}