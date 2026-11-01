import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { chapters, goTo } from '../lib/chapters'

const STEP = 30
const SIZE = 14
const HEIGHT = (chapters.length - 1) * STEP + SIZE

export default function ScrollIndicator({ active, visible }) {
  const bubble = useRef(null)
  const ready = useRef(false)
  const index = Math.max(0, chapters.findIndex((c) => c.id === active))

  useEffect(() => {
    const y = index * STEP
    if (!ready.current) {
      gsap.set(bubble.current, { y })
      ready.current = true
      return
    }
    gsap.killTweensOf(bubble.current)
    gsap
      .timeline()
      .to(bubble.current, { scaleY: 2, scaleX: 0.75, duration: 0.3, ease: 'power2.out' }, 0)
      .to(bubble.current, { y, duration: 0.8, ease: 'power3.inOut' }, 0)
      .to(bubble.current, { scaleY: 1, scaleX: 1, duration: 0.6, ease: 'power3.out' }, 0.4)
  }, [index])

  return (
    <nav
      aria-label="Posisi chapter"
      className={`fixed right-1.5 top-1/2 z-[60] -translate-y-1/2 transition-opacity duration-1000 md:right-8 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      style={{ height: HEIGHT, width: SIZE }}
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 w-px -translate-x-1/2 bg-ink/25"
        style={{ top: SIZE / 2, height: HEIGHT - SIZE }}
      />

      <span
        ref={bubble}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 rounded-full bg-rust/80 backdrop-blur-sm"
        style={{ width: SIZE, height: SIZE, boxShadow: '0 0 14px 4px rgba(140,59,34,0.3)' }}
      />

      {chapters.map((c, i) => (
        <button
          key={c.id}
          onClick={() => goTo(c.id)}
          aria-label={`Ke bagian ${c.label}`}
          aria-current={active === c.id ? 'true' : undefined}
          className="group absolute left-0 grid place-items-center before:absolute before:-inset-2 before:content-[' ']"
          style={{ top: i * STEP, width: SIZE, height: SIZE }}
        >
          <span className="h-1 w-1 rounded-full bg-ink/70" />
          <span
            className={`pointer-events-none absolute right-full mr-4 hidden whitespace-nowrap font-news text-[0.6rem] uppercase tracking-[0.25em] text-ink md:block ${
              active === c.id
                ? 'opacity-100'
                : 'opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100'
            }`}
          >
            {c.label}
          </span>
        </button>
      ))}
    </nav>
  )
}