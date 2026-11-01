import { useEffect } from 'react'

export default function useLockScroll() {
  useEffect(() => {
    window.__lenis?.stop()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      window.__lenis?.start()
    }
  }, [])
}