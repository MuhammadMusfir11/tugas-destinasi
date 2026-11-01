import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { groupPhotos } from '../data/group'
import { members } from '../data/members'
import PhotoClothesline from '../components/PhotoClothesline'
import PhotoLightbox from '../components/PhotoLightbox'
import MemberStamp from '../components/MemberStamp'
import MemberModal from '../components/MemberModal'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Group() {
  const root = useRef(null)
  const grid = useRef(null)
  const glow = useRef(null)
  const glowTo = useRef({})
  const [photo, setPhoto] = useState(null)   // index foto di lightbox
  const [member, setMember] = useState(null) // { i, rect } anggota yang dibuka
  const trigger = useRef(null)

  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: '.gp-head', start: 'top 80%' } })
        .from('.gp-rule', { scaleX: 0, transformOrigin: 'center', duration: 1.4, ease: 'expo.out' })
        .from('.gp-eyebrow', { opacity: 0, y: 14, duration: 0.9, ease: 'power3.out' }, 0.2)
        .from('.gp-line', {
          clipPath: 'inset(0 0 100% 0)', y: 30, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.15,
        }, 0.3)
        .from('.gp-sub', { opacity: 0, y: 16, duration: 1, ease: 'power3.out' }, 0.9)

      gsap
        .timeline({ scrollTrigger: { trigger: '.gm-head', start: 'top 82%' } })
        .from('.gm-eyebrow', { opacity: 0, y: 14, duration: 0.9, ease: 'power3.out' })
        .from('.gm-line', {
          clipPath: 'inset(0 0 100% 0)', y: 30, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.15,
        }, 0.1)

      gsap.from('.mb-stamp', {
        opacity: 0, y: 50, duration: 1.1, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: grid.current, start: 'top 85%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  // Cahaya hangat mengikuti kursor di area prangko
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
    const r = grid.current.getBoundingClientRect()
    glowTo.current.x?.(e.clientX - r.left)
    glowTo.current.y?.(e.clientY - r.top)
  }
  const onEnter = (e) => {
    if (e.pointerType === 'mouse') gsap.to(glow.current, { opacity: 1, duration: 0.8 })
  }
  const onLeave = () => gsap.to(glow.current, { opacity: 0, duration: 0.8 })

  const openMember = (i, rect, el) => {
    trigger.current = el
    setMember({ i, rect })
  }
  const closeMember = () => {
    setMember(null)
    trigger.current?.focus?.({ preventScroll: true })
  }

  return (
    <section ref={root} id="kelompok" className="relative overflow-hidden py-24 text-ink md:py-32">
      {/* LAPIS 1: Dokumentasi */}
      <header className="gp-head mx-auto max-w-6xl px-6 md:px-12">
        <div className="gp-rule border-t-[3px] border-double border-ink" />
        <h2 className="mt-5 font-headline font-black uppercase leading-[0.95] tracking-tight text-[clamp(2.2rem,6.2vw,5.4rem)]">
          <span className="gp-line block">Dokumentasi</span>
          <span className="gp-line block text-rust">Kelompok 1</span>
        </h2>
      </header>

      <div className="mt-10 md:mt-14">
        <PhotoClothesline photos={groupPhotos} onOpen={setPhoto} />
      </div>

      {/* LAPIS 2: Anggota */}
      <div className="mx-auto mt-28 max-w-6xl px-6 md:mt-40 md:px-12">
        <header className="gm-head text-center">
          <p className="gm-eyebrow font-news text-[0.6rem] tracking-[0.4em] text-sepia">
            KELOMPOK 1 · {String(members.length).padStart(2, '0')} ANGGOTA
          </p>
          <h2 className="mt-5 font-headline font-black uppercase leading-[0.95] tracking-tight text-[clamp(2rem,5.4vw,4.6rem)]">
            <span className="gm-line block">The People Behind</span>
            <span className="gm-line block text-rust">The Story</span>
          </h2>
        </header>

        <div
          ref={grid}
          className="relative mt-14 md:mt-20"
          onPointerMove={onMove}
          onPointerEnter={onEnter}
          onPointerLeave={onLeave}
        >
          <div
            ref={glow}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-[460px] w-[460px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(176,138,85,0.4) 0%, transparent 65%)' }}
          />
          <ul className="relative flex flex-wrap justify-center gap-x-5 gap-y-10">
            {members.map((m, i) => (
              <li
                key={m.id}
                className="w-[calc(50%_-_10px)] sm:w-[calc(33.333%_-_14px)] lg:w-[calc(25%_-_15px)]"
              >
                <MemberStamp m={m} index={i} onOpen={openMember} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {photo !== null && (
        <PhotoLightbox photos={groupPhotos} index={photo} onIndex={setPhoto} onClose={() => setPhoto(null)} />
      )}
      {member && <MemberModal m={members[member.i]} rect={member.rect} onClosed={closeMember} />}
    </section>
  )
}