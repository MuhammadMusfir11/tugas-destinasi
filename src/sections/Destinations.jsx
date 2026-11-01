import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { destinations } from '../data/destinations'
import DestinationCard from '../components/DestinationCard'
import DestinationModal from '../components/DestinationModal'

const SPEED = 36   // px per detik (geser ke kiri)
const IDLE = 2500  // jeda (ms) setelah interaksi sebelum jalan lagi
const COPIES = [0, 1, 2]

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Destinations() {
  const root = useRef(null)
  const scroller = useRef(null)
  const inView = useRef(false)
  const drag = useRef({ active: false, captured: false, x: 0, moved: 0, id: 0 })
  const st = useRef({ hover: false, drag: false, touch: false, focus: false, paused: false, last: 0 })
  const [open, setOpen] = useState(null)
  const [grabbing, setGrabbing] = useState(false)

  const touch = () => { st.current.last = performance.now() }

  // Animasi muncul
  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: '.dest-head', start: 'top 80%' } })
        .from('.dest-rule', { scaleX: 0, transformOrigin: 'center', duration: 1.4, ease: 'expo.out' })
        .from('.dest-eyebrow', { opacity: 0, y: 14, duration: 0.9, ease: 'power3.out' }, 0.2)
        .from('.dest-line', {
          clipPath: 'inset(0 0 100% 0)', y: 30, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.15,
        }, 0.3)
        .from('.dest-sub', { opacity: 0, y: 16, duration: 1, ease: 'power3.out' }, 0.9)

      gsap.from('.dest-track', {
        opacity: 0, y: 50, duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: '.dest-track', start: 'top 88%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  // Galeri bergerak terus (3 salinan agar loop mulus ke dua arah)
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const noMotion = reduced()
    let raf = 0
    let last = performance.now()
    let setW = el.scrollWidth / 3
    let pos = setW
    el.scrollLeft = pos

    const io = new IntersectionObserver(([e]) => { inView.current = e.isIntersecting }, { threshold: 0.05 })
    io.observe(el)

    const ro = new ResizeObserver(() => {
      const w = el.scrollWidth / 3
      if (w && Math.abs(w - setW) > 1) {
        pos = w + ((pos - setW) / setW) * w
        setW = w
        el.scrollLeft = pos
      }
    })
    ro.observe(el)

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(now - last, 64) / 1000
      last = now
      if (!inView.current || !setW) return

      if (Math.abs(el.scrollLeft - pos) > 1.5) pos = el.scrollLeft // pengguna menggeser
      const s = st.current
      const idle = now - s.last > IDLE
      const auto = !noMotion && idle && !s.hover && !s.drag && !s.touch && !s.focus && !s.paused

      if (auto) pos += SPEED * dt
      let wrapped = false
      if (pos >= setW * 2) { pos -= setW; wrapped = true }
      else if (pos < setW) { pos += setW; wrapped = true }
      if (auto || wrapped) el.scrollLeft = pos
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
    }
  }, [])

  // Pause saat modal terbuka
  useEffect(() => { st.current.paused = !!open }, [open])

  // Drag dengan mouse (touch memakai swipe bawaan browser)
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { active: true, captured: false, x: e.clientX, moved: 0, id: e.pointerId }
    st.current.drag = true
    touch()
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
      try { scroller.current.releasePointerCapture(d.id) } catch { /* sudah dilepas */ }
    }
    d.captured = false
    st.current.drag = false
    setGrabbing(false)
    touch()
  }

  const onOpen = (d, index, trigger) => {
    if (drag.current.moved > 6) return // itu drag, bukan klik
    setOpen({ d, index, rect: trigger.getBoundingClientRect(), trigger })
  }

  const onClosed = () => {
    open?.trigger?.focus({ preventScroll: true })
    setOpen(null)
    touch()
  }

  return (
    <section ref={root} id="destinasi" className="relative overflow-hidden py-24 text-ink md:py-32">
      <header className="dest-head mx-auto max-w-6xl px-6 md:px-12">
        <div className="dest-rule border-t-[3px] border-double border-ink" />
        <div className="mt-8 flex items-end justify-between gap-6">
          <div>
            <h2 className="mt-5 font-headline font-black uppercase leading-[0.95] tracking-tight text-[clamp(2.2rem,6.2vw,5.4rem)]">
              <span className="dest-line block">Destinasi Wisata</span>
              <span className="dest-line block text-rust">Tahura Djuanda</span>
            </h2>
            <p className="dest-sub mt-5 font-news text-sm italic text-sepia sm:text-base">
              Explore the places hidden inside the forest
            </p>
          </div>
          <p className="dest-sub hidden shrink-0 text-right font-news text-[0.6rem] tracking-[0.35em] text-sepia md:block">
          </p>
        </div>
      </header>

      <div className="dest-track mt-12">
        <div
          ref={scroller}
          className={`no-scrollbar flex gap-4 overflow-x-auto px-6 md:px-12 ${
            grabbing ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerEnter={(e) => { if (e.pointerType === 'mouse') st.current.hover = true }}
          onPointerLeave={(e) => { if (e.pointerType === 'mouse') { st.current.hover = false; touch() } }}
          onTouchStart={() => { st.current.touch = true }}
          onTouchEnd={() => { st.current.touch = false; touch() }}
          onTouchCancel={() => { st.current.touch = false; touch() }}
          onWheel={touch}
          onFocus={() => { st.current.focus = true }}
          onBlur={() => { st.current.focus = false; touch() }}
          onDragStart={(e) => e.preventDefault()}
        >
          {COPIES.map((c) =>
            destinations.map((d, i) => (
              <DestinationCard key={`${c}-${d.id}`} d={d} index={i} onOpen={onOpen} clone={c !== 1} />
            ))
          )}
        </div>

        <p className="mx-auto mt-6 max-w-6xl px-6 font-news text-[0.62rem] italic tracking-[0.15em] text-sepia md:px-12">
          Tarik, geser, atau klik foto untuk membuka cerita tiap tempat.
        </p>
      </div>

      {open && <DestinationModal item={open} total={destinations.length} onClosed={onClosed} />}
    </section>
  )
}