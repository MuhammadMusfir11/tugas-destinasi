import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { purpose, vision, missions } from '../data/vision'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export default function VisionMission() {
  const root = useRef(null)
  const list = useRef(null)
  const glow = useRef(null)
  const glowTo = useRef({ x: null, y: null })
  const lastPointer = useRef('mouse')
  const [open, setOpen] = useState(0)

  // Animasi scroll
  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: '.vm-head', start: 'top 82%' } })
        .from('.vm-rule', { scaleX: 0, transformOrigin: 'center', duration: 1.4, ease: 'expo.out' })
        .from('.vm-eyebrow', { opacity: 0, y: 14, duration: 0.9, ease: 'power3.out' }, 0.2)

      // Kata demi kata muncul mengikuti scroll
      gsap.from('.vm-pw', {
        yPercent: 115, opacity: 0, ease: 'none', stagger: 0.35,
        scrollTrigger: { trigger: '.vm-purpose', start: 'top 80%', end: 'bottom 50%', scrub: true },
      })

      // Visi: dari samar ke tegas, lalu kata kunci disorot
      gsap.fromTo(
        '.vm-w',
        { opacity: 0.14 },
        {
          opacity: 1, ease: 'none', stagger: 0.2,
          scrollTrigger: { trigger: '.vm-vision', start: 'top 74%', end: 'bottom 52%', scrub: true },
        }
      )
      gsap.utils.toArray('.vm-hl').forEach((el) => {
        gsap.to(el, {
          color: el.dataset.c, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 55%', end: 'top 38%', scrub: true },
        })
      })

      gsap.from('.vm-row', {
        opacity: 0, y: 28, duration: 1, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: '.vm-list', start: 'top 85%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  // Cahaya hangat mengikuti kursor di daftar misi
  useEffect(() => {
    if (!glow.current) return
    gsap.set(glow.current, { xPercent: -50, yPercent: -50, opacity: 0 })
    glowTo.current = {
      x: gsap.quickTo(glow.current, 'x', { duration: 0.9, ease: 'power3.out' }),
      y: gsap.quickTo(glow.current, 'y', { duration: 0.9, ease: 'power3.out' }),
    }
  }, [])

  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || reduced()) return
    const r = list.current.getBoundingClientRect()
    glowTo.current.x?.(e.clientX - r.left)
    glowTo.current.y?.(e.clientY - r.top)
  }
  const onEnter = (e) => {
    if (e.pointerType === 'mouse') gsap.to(glow.current, { opacity: 1, duration: 0.8 })
  }
  const onLeave = () => gsap.to(glow.current, { opacity: 0, duration: 0.8 })

  const choose = (i) => {
    // Di layar sentuh, tap pada baris terbuka akan menutupnya
    setOpen((cur) => (cur === i && lastPointer.current !== 'mouse' ? -1 : i))
  }

  return (
    <section ref={root} id="visi-misi" className="relative overflow-hidden py-24 text-ink md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <header className="vm-head">
          <div className="vm-rule border-t-[3px] border-double border-ink" />
        </header>

        {/* Tiga kalimat raksasa */}
        <div
          className="vm-purpose mt-10 font-headline font-black uppercase leading-[0.9] tracking-tight text-[clamp(2.2rem,7.5vw,10rem)]"
          aria-label="To protect. To preserve. To inspire."
        >
          {purpose.map((line, li) => (
            <p
              key={li}
              aria-hidden="true"
              className={`flex flex-wrap gap-x-[0.25em] ${
                li === 1 ? 'md:pl-[8vw]' : li === 2 ? 'md:pl-[16vw]' : ''
              }`}
            >
              {line.map((w, wi) => (
                <span key={wi} className="inline-block overflow-hidden pb-[0.08em]">
                  <span className={`vm-pw inline-block ${wi === 1 ? 'text-rust' : ''}`}>{w}</span>
                </span>
              ))}
            </p>
          ))}
        </div>

        {/* Visi */}
        <div className="vm-vision mt-24 grid gap-6 md:mt-36 md:grid-cols-[10rem_1fr]">
          <p className="pt-3 font-news text-[0.6rem] tracking-[0.4em] text-sepia">VISI</p>
          <p className="font-headline font-bold leading-[1.12] text-[clamp(1.9rem,4.8vw,4.2rem)]">
            {vision.map((v, i) => (
              <span
                key={i}
                className={`vm-w mr-[0.28em] inline-block ${v.hl ? 'vm-hl' : ''}`}
                data-c={v.hl}
              >
                {v.w}
              </span>
            ))}
          </p>
        </div>

        {/* Misi */}
        <div className="mt-24 grid gap-6 md:mt-36 md:grid-cols-[10rem_1fr]">
          <p className="pt-3 font-news text-[0.6rem] tracking-[0.4em] text-sepia">MISI</p>

          <div
            ref={list}
            className="vm-list relative"
            onPointerMove={onMove}
            onPointerEnter={onEnter}
            onPointerLeave={onLeave}
          >
            <div
              ref={glow}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 h-[420px] w-[420px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(176,138,85,0.38) 0%, transparent 65%)' }}
            />

            <ul className="relative">
              {missions.map((m, i) => {
                const active = open === i
                return (
                  <li key={m.n} className="vm-row border-t border-ink/30 last:border-b">
                    <button
                      type="button"
                      aria-expanded={active}
                      aria-controls={`vm-d-${i}`}
                      onPointerDown={(e) => { lastPointer.current = e.pointerType }}
                      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOpen(i) }}
                      onFocus={() => setOpen(i)}
                      onClick={() => choose(i)}
                      className="group flex w-full items-baseline gap-4 py-5 text-left md:gap-8 md:py-6"
                    >
                      <span
                        className={`w-9 shrink-0 font-news text-xs tracking-[0.2em] transition-colors duration-500 md:w-12 ${
                          active ? 'text-rust' : 'text-sepia'
                        }`}
                      >
                        {m.n}
                      </span>
                      <span
                        className={`flex-1 font-headline font-black uppercase leading-none transition-colors duration-500 text-[clamp(1.7rem,4.6vw,3.8rem)] ${
                          active ? 'text-ink' : 'text-ink/40 group-hover:text-ink/70'
                        }`}
                      >
                        {m.title}
                      </span>
                      <Plus
                        aria-hidden="true"
                        size={22}
                        className={`shrink-0 self-center transition-transform duration-500 ${
                          active ? 'rotate-45 text-rust' : 'text-ink/50'
                        }`}
                      />
                    </button>

                    <div
                      id={`vm-d-${i}`}
                      role="region"
                      className={`grid transition-[grid-template-rows] duration-700 ease-forest ${
                        active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-xl pb-7 pl-[3.25rem] font-news text-[0.92rem] leading-[1.75] text-ink/90 md:pl-20">
                          {m.text}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}