import { useRef } from 'react'
import { gsap } from '../lib/gsap'

const canMove = () =>
  matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches

export default function MagneticButton({ children, className = '', strength = 0.22, ...props }) {
  const ref = useRef(null)

  const move = (e) => {
    if (!canMove()) return
    const r = ref.current.getBoundingClientRect()
    gsap.to(ref.current, {
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  const leave = () =>
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' })

  return (
    <button ref={ref} onPointerMove={move} onPointerLeave={leave} className={className} {...props}>
      {children}
    </button>
  )
}