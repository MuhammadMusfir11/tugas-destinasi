import { useEffect, useState } from 'react'
import { chapters } from '../lib/chapters'

export default function useActiveSection() {
  const [active, setActive] = useState(chapters[0].id)

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-50% 0px -50% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return active
}