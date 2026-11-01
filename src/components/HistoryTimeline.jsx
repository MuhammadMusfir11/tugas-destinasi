import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import HistoryItem from './HistoryItem'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const READ_LINE = 0.62 // posisi "garis baca" di layar (62% dari atas)

// Kurva halus melewati semua titik
function smoothPath(p) {
  let d = `M ${p[0].x} ${p[0].y}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`
  }
  return d
}

export default function HistoryTimeline({ events }) {
  const wrap = useRef(null)
  const line = useRef(null)
  const geo = useRef({ samples: [], total: 0, nodeY: [], update: null })
  const tls = useRef([])
  const shown = useRef([])
  const [shape, setShape] = useState({ w: 0, h: 0, d: '' })

  // Keadaan awal + timeline tiap peristiwa (tersembunyi sampai garis tiba)
  useLayoutEffect(() => {
    const noMotion = reduced()
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray('.h-row')
      shown.current = rows.map(() => false)
      tls.current = rows.map((row) => {
        if (noMotion) return null
        const q = gsap.utils.selector(row)

        gsap.set(q('.h-node'), { scale: 0 })
        gsap.set(q('.h-photo'), { clipPath: 'inset(0 0 100% 0)' })
        gsap.set(q('.h-text > *'), { opacity: 0, y: 28 })

        gsap.fromTo(
          q('.h-img'),
          { yPercent: -6 },
          {
            yPercent: 6, ease: 'none',
            scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )

        return gsap
          .timeline({ paused: true })
          .to(q('.h-node'), { scale: 1, duration: 0.6, ease: 'power3.out' })
          .to(q('.h-photo'), { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'expo.inOut' }, 0.15)
          .to(q('.h-text > *'), { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 }, 0.5)
      })
    }, wrap)
    return () => ctx.revert()
  }, [])

  // Ukur titik, gambar jalur, dan sambungkan ke scroll
  useEffect(() => {
    const el = wrap.current
    const noMotion = reduced()

    const lenAt = (y) => {
      const s = geo.current.samples
      if (!s.length || y <= s[0].y) return 0
      for (let i = 1; i < s.length; i++) {
        if (s[i].y >= y) {
          const a = s[i - 1]
          const b = s[i]
          return a.len + (b.len - a.len) * ((y - a.y) / (b.y - a.y || 1))
        }
      }
      return geo.current.total
    }

    const update = () => {
      const g = geo.current
      if (!g.total || !line.current) return
      const tip = window.innerHeight * READ_LINE - el.getBoundingClientRect().top
      const len = noMotion ? g.total : lenAt(tip)
      line.current.style.strokeDashoffset = g.total - len
      if (noMotion) return

      g.nodeY.forEach((ny, i) => {
        const tl = tls.current[i]
        if (!tl) return
        if (tip >= ny - 24 && !shown.current[i]) {
          shown.current[i] = true
          tl.timeScale(1).play()
        } else if (tip < ny - 80 && shown.current[i]) {
          shown.current[i] = false
          tl.timeScale(1.8).reverse()
        }
      })
    }
    geo.current.update = update

    const measure = () => {
      const wr = el.getBoundingClientRect()
      const W = el.offsetWidth
      const H = el.offsetHeight
      const mobile = W < 768
      const amp = mobile ? 10 : 46

      const nodes = Array.from(el.querySelectorAll('[data-node]')).map((n) => {
        const r = n.getBoundingClientRect()
        return { x: r.left - wr.left + r.width / 2, y: r.top - wr.top + r.height / 2 }
      })
      if (!nodes.length) return

      const pts = [{ x: nodes[0].x, y: 0 }]
      nodes.forEach((n, i) => {
        pts.push(n)
        if (i < nodes.length - 1) {
          pts.push({ x: n.x + (i % 2 ? -amp : amp), y: (n.y + nodes[i + 1].y) / 2 })
        }
      })
      pts.push({ x: nodes[nodes.length - 1].x, y: H })

      geo.current.nodeY = nodes.map((n) => n.y)
      setShape({ w: W, h: H, d: smoothPath(pts) })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: update,
      onEnter: update,
      onEnterBack: update,
      onLeave: update,
      onLeaveBack: update,
      onRefresh: update,
    })

    return () => {
      ro.disconnect()
      st.kill()
    }
  }, [])

  // Hitung panjang jalur setiap bentuknya berubah
  useLayoutEffect(() => {
    const p = line.current
    if (!p || !shape.d) return
    const total = p.getTotalLength()
    const samples = []
    for (let l = 0; l <= total; l += 10) samples.push({ len: l, y: p.getPointAtLength(l).y })
    samples.push({ len: total, y: p.getPointAtLength(total).y })

    geo.current.samples = samples
    geo.current.total = total
    p.style.strokeDasharray = total
    p.style.strokeDashoffset = total
    geo.current.update?.()
  }, [shape.d])

  return (
    <div ref={wrap} className="relative mx-auto max-w-6xl px-6 md:px-12">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${shape.w || 1} ${shape.h || 1}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={shape.d}
          fill="none"
          stroke="rgba(43,29,18,0.28)"
          strokeWidth="2"
          strokeDasharray="2 9"
          strokeLinecap="round"
        />
        <path
          ref={line}
          d={shape.d}
          fill="none"
          stroke="#2B1D12"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {events.map((e, i) => (
        <HistoryItem key={e.id} e={e} flip={i % 2 === 1} />
      ))}
    </div>
  )
}