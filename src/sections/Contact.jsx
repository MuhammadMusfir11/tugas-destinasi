import { useLayoutEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { goTo } from '../lib/chapters'
import MagneticButton from '../components/MagneticButton'

// ⚠️ GANTI dengan data asli kelompok
const INSTAGRAM_URL = 'https://www.instagram.com/'
const INSTAGRAM_HANDLE = '@Kelompok 1 Pariwisata'
const WHATSAPP_NUMBER = '6281234567890' // format internasional: 62 + nomor tanpa 0 di depan
const WA_TEXT = 'Halo Kelompok 1, saya sudah menjelajahi website Tahura Djuanda'

const ADDRESS = 'Jl. Ir. H. Juanda No. 99, Ciburial, Cimenyan, Kabupaten Bandung, Jawa Barat 40198'
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Taman+Hutan+Raya+Ir.+H.+Djuanda+Bandung'
const WA_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WA_TEXT)}`

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Contact() {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: '.ct-head', start: 'top 80%' } })
        .from('.ct-rule', { scaleX: 0, transformOrigin: 'center', duration: 1.4, ease: 'expo.out' })
        .from('.ct-eyebrow', { opacity: 0, y: 14, duration: 0.9, ease: 'power3.out' }, 0.2)
        .from('.ct-line', {
          clipPath: 'inset(0 0 100% 0)', y: 40, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: 0.18,
        }, 0.3)

      gsap
        .timeline({ scrollTrigger: { trigger: '.ct-body', start: 'top 82%' } })
        .from('.ct-sub', { opacity: 0, y: 24, duration: 1.1, ease: 'power3.out' })
        .from('.ct-cta', { opacity: 0, y: 20, duration: 0.9, ease: 'power3.out', stagger: 0.12 }, 0.25)
        .from('.ct-row', { opacity: 0, y: 24, duration: 0.9, ease: 'power3.out', stagger: 0.12 }, 0.2)
    }, root)
    return () => ctx.revert()
  }, [])

  const rowBase = 'ct-row group flex items-start gap-4 border-t border-ink/30 py-5 last:border-b md:gap-6'
  const label =
    'w-[5.5rem] shrink-0 pt-1 font-news text-[0.52rem] tracking-[0.25em] text-sepia md:w-28 md:text-[0.6rem] md:tracking-[0.35em]'

  return (
    <section ref={root} id="kontak" className="relative overflow-hidden py-28 text-ink md:py-40">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <header className="ct-head">
          <div className="ct-rule border-t-[3px] border-double border-ink" />

          <h2
            className="mt-8 font-headline font-black uppercase leading-[0.92] tracking-tight text-[clamp(2.2rem,6.5vw,5.5rem)]"
            aria-label="The journey doesn’t end here."
          >
            <span aria-hidden="true" className="ct-line block">The Journey</span>
            <span aria-hidden="true" className="ct-line block">Doesn’t</span>
            <span aria-hidden="true" className="ct-line block text-rust">End Here</span>
          </h2>
        </header>

        <div className="ct-body mt-16 grid gap-14 md:mt-24 md:grid-cols-2 md:gap-16">
          <div>
            <p className="ct-sub max-w-md font-headline text-[clamp(1.4rem,2.6vw,2rem)] font-medium italic leading-snug">
              Thank you for exploring Tahura Djuanda with us
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="ct-cta w-full sm:w-auto">
                <MagneticButton
                  onClick={() => goTo('hero')}
                  className="w-full rounded-full bg-ink px-8 py-3.5 font-news text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-paper transition-colors duration-500 hover:bg-rust sm:w-auto"
                >
                  Explore Again
                </MagneticButton>
              </div>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ct-cta w-full rounded-full border border-ink/60 px-8 py-3.5 text-center font-news text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-ink transition-colors duration-500 hover:border-rust hover:text-rust sm:w-auto"
              >
                Contact Our Group
              </a>
            </div>
          </div>

          <ul>
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={rowBase}
              >
                <span className={label}>INSTAGRAM</span>
                <span className="flex-1 font-headline text-xl font-bold transition-transform duration-500 ease-forest group-hover:translate-x-2 group-hover:text-rust md:text-2xl">
                  {INSTAGRAM_HANDLE}
                </span>
                <ArrowUpRight
                  size={20}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-ink/50 transition-all duration-500 group-hover:rotate-12 group-hover:text-rust"
                />
              </a>
            </li>

            <li className={rowBase.replace(' group', '')}>
              <span className={label}>LOCATION</span>
              <span className="flex-1 font-news text-[0.92rem] leading-[1.7] text-ink/90">{ADDRESS}</span>
            </li>

            <li>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={rowBase}>
                <span className={label}>GOOGLE MAPS</span>
                <span className="flex-1 font-headline text-xl font-bold transition-transform duration-500 ease-forest group-hover:translate-x-2 group-hover:text-rust md:text-2xl">
                  Buka petunjuk arah
                </span>
                <ArrowUpRight
                  size={20}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-ink/50 transition-all duration-500 group-hover:rotate-12 group-hover:text-rust"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}