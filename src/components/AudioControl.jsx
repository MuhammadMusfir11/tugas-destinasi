import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'

const SRC = '/audio/pelukis-langit.mp3'
const VOLUME = 1

export default function AudioControl({ enabled }) {
  const audioRef = useRef(null)
  const userMuted = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState(true)

  const start = useCallback(async () => {
    const a = audioRef.current
    if (!a || userMuted.current) return false
    try {
      gsap.killTweensOf(a)
      a.volume = 0
      await a.play()
      setPlaying(true)
      gsap.to(a, { volume: VOLUME, duration: 2.5, ease: 'power1.inOut' })
      return true
    } catch (err) {
      if (err?.name === 'NotSupportedError') setAvailable(false)
      return false
    }
  }, [])

  // Coba autoplay; kalau diblokir browser, tunggu interaksi pertama
  useEffect(() => {
    if (!enabled) return
    let alive = true
    const events = ['pointerdown', 'keydown', 'touchend']

    const onGesture = async (e) => {
      if (e.target?.closest?.('[data-audio-toggle]')) return
      if (await start()) cleanup()
    }
    const cleanup = () => events.forEach((ev) => window.removeEventListener(ev, onGesture))

    start().then((ok) => {
      if (!alive || ok || userMuted.current) return
      events.forEach((ev) => window.addEventListener(ev, onGesture))
    })

    return () => {
      alive = false
      cleanup()
    }
  }, [enabled, start])

  const toggle = async () => {
    const a = audioRef.current
    if (playing) {
      userMuted.current = true
      setPlaying(false)
      gsap.killTweensOf(a)
      gsap.to(a, { volume: 0, duration: 0.8, onComplete: () => a.pause() })
    } else {
      userMuted.current = false
      await start()
    }
  }

  return (
    <div
      className={`fixed bottom-5 left-4 z-[60] transition-opacity duration-1000 md:bottom-7 md:left-8 ${
        enabled ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <audio ref={audioRef} src={SRC} loop preload="auto" onError={() => setAvailable(false)} />

      <button
        type="button"
        data-audio-toggle
        onClick={toggle}
        disabled={!available}
        aria-pressed={playing}
        aria-label={playing ? 'Matikan musik latar' : 'Nyalakan musik latar'}
        className="flex h-11 w-11 items-center justify-center gap-3 rounded-full border border-ink/30 bg-paper/60 font-news text-[0.62rem] uppercase tracking-[0.3em] text-ink backdrop-blur-md transition-colors duration-500 hover:border-rust hover:text-rust disabled:opacity-40 sm:w-auto sm:px-4"
      >
        <span className="flex h-3 items-end gap-[3px]" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-full w-0.5 origin-bottom bg-current"
              style={{
                animation: `eq ${1.2 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
                animationPlayState: playing ? 'running' : 'paused',
              }}
            />
          ))}
        </span>
        <span className="hidden sm:inline">
          {!available ? 'NO AUDIO' : playing ? 'SOUND ON' : 'SOUND OFF'}
        </span>
      </button>
    </div>
  )
}