import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { img } from '../lib/images'

const aboutSrc = img('about')

const facts = [
  { label: 'Lokasi', value: 'Bandung & Lembang' },
  { label: 'Diresmikan', value: '14 Januari 1985' },
  { label: 'Luas', value: '± 590 hektar' },
  { label: 'Ketinggian', value: '770–1.330 mdpl' },
]

const corners = ['-left-2 -top-2', '-right-2 -top-2', '-bottom-2 -left-2', '-bottom-2 -right-2']

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export default function About() {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (reduced()) return

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: '.about-masthead', start: 'top 85%' } })
        .from('.about-line', {
          clipPath: 'inset(0 0 100% 0)', y: 30, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.15,
        })
        .from('.about-deck', { opacity: 0, y: 16, duration: 1, ease: 'power3.out' }, 0.7)
        .from('.about-rule', { scaleX: 0, transformOrigin: 'center', duration: 1.4, ease: 'expo.out' }, 0.9)

      gsap.from('.about-frame', {
        opacity: 0, y: 30, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-frame', start: 'top 85%' },
      })
      gsap.fromTo(
        '.about-mask',
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'expo.inOut',
          scrollTrigger: { trigger: '.about-frame', start: 'top 80%' },
        }
      )
      gsap.from('.about-caption', {
        opacity: 0, y: 10, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-frame', start: 'top 65%' },
      })
      gsap.from('.about-story p', {
        opacity: 0, y: 22, duration: 1.1, ease: 'power3.out', stagger: 0.14,
        scrollTrigger: { trigger: '.about-story', start: 'top 80%' },
      })
      gsap.from('.about-side', {
        opacity: 0, y: 22, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-side', start: 'top 92%' },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="about" className="relative overflow-hidden py-20 text-ink md:py-28">
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        {/* Judul */}
        <header className="about-masthead">
          <h2 className="text-center font-headline font-black uppercase leading-[0.95] tracking-tight text-[clamp(2.2rem,6.2vw,5.4rem)]">
            <span className="about-line block">A Forest Inside</span>
            <span className="about-line block text-rust">The City</span>
          </h2>

          <p className="about-deck mx-auto mt-5 max-w-2xl text-center font-news text-sm italic leading-snug text-sepia sm:text-base">
            Kisah hutan raya pertama di Indonesia yang tumbuh di tepi Kota Bandung.
          </p>
          <div className="about-rule mt-6 border-t border-ink" />
        </header>

        {/* Isi: kolom koran */}
        <div className="about-story news-cols mt-8 md:columns-2 md:gap-10 lg:columns-3">
          <figure className="about-figure mx-2 mb-8 break-inside-avoid">
            <div className="about-frame frame-vintage">
              {corners.map((pos) => (
                <span
                  key={pos}
                  aria-hidden="true"
                  className={`absolute z-10 h-3.5 w-3.5 rotate-45 border border-[#1f140c] bg-[#b08a55] ${pos}`}
                />
              ))}
              <div className="about-mask overflow-hidden bg-sepia/40">
                {aboutSrc ? (
                  <img
                    className="block h-auto w-full"
                    style={{ filter: 'sepia(0.28) contrast(1.05) saturate(0.9)' }}
                    src={aboutSrc}
                    alt="Suasana hutan di Taman Hutan Raya Ir. H. Djuanda, Bandung"
                    loading="lazy"
                    onLoad={() => ScrollTrigger.refresh()}
                  />
                ) : (
                  <div className="aspect-[3/2] w-full bg-linear-to-b from-sepia/60 to-ink/70" />
                )}
              </div>
            </div>
            <figcaption className="about-caption mt-6 border-t border-ink/40 pt-2 font-news text-[0.65rem] italic leading-snug text-sepia">
              Tahura Ir. H. Djuanda, Bandung: hutan pegunungan di tepi kota.
            </figcaption>
          </figure>

          <div className="font-news text-[0.9rem] leading-[1.75] text-ink/90 md:text-[0.82rem] [&>p]:mb-4 [&>p]:text-left md:[&>p]:text-justify [&>p]:hyphens-auto">
            <p className="first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-headline first-letter:text-6xl first-letter:font-black first-letter:leading-[0.8] first-letter:text-rust">
              Taman Hutan Raya Ir. H. Djuanda, yang akrab disebut Tahura Djuanda, membentang dari
              kawasan Dago Pakar di Kota Bandung hingga Maribaya di Lembang. Hutan pegunungan
              seluas sekitar 590 hektar ini berada di ketinggian 770 hingga 1.330 meter di atas
              permukaan laut.
            </p>
            <p>
              Kawasan ini bermula dari hutan lindung yang pada 23 Agustus 1965 diresmikan sebagai
              Kebun Raya Rekreasi, lalu dinamai untuk mengenang Ir. H. Djuanda Kartawidjaja,
              Perdana Menteri ke-10 Republik Indonesia.
            </p>
            <p>
              Pada 14 Januari 1985, kawasan ini diresmikan sebagai taman hutan raya melalui
              Keputusan Presiden Nomor 3 Tahun 1985. Tanggal itu bertepatan dengan hari kelahiran
              Djuanda, dan sejak itu Tahura tercatat sebagai taman hutan raya pertama di Indonesia.
            </p>
            <p>
              Tujuan awalnya jelas: melestarikan plasma nutfah flora hutan Indonesia dan menjadi
              sarana penelitian vegetasi hutan pegunungan. Kini sekitar 2.500 jenis tumbuhan hidup
              di dalamnya, berdampingan dengan goa-goa peninggalan masa kolonial dan pendudukan
              Jepang.
            </p>
            <p>
              Hari ini Tahura bukan hanya hutan. Ia ruang pertemuan warga kota dan wisatawan:
              tempat berolahraga, belajar, berkegiatan, sekaligus sumber penghidupan bagi pedagang
              dan pelaku wisata di sekitarnya.
            </p>
            <p>
              Di titik inilah sosiologi pariwisata menemukan bahan kajiannya: bagaimana alam,
              tradisi, ekonomi lokal, dan upaya konservasi saling bersinggungan dalam satu kawasan.
            </p>
          </div>

          <aside className="about-side mt-2 break-inside-avoid border-2 border-ink p-4">
            <p className="border-b border-ink pb-2 text-center font-headline text-sm font-black uppercase tracking-[0.2em]">
              Data Ringkas
            </p>
            <dl className="mt-1 font-news text-[0.75rem]">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="flex items-baseline justify-between gap-3 border-b border-dotted border-ink/50 py-2 last:border-0"
                >
                  <dt className="uppercase tracking-[0.15em] text-sepia">{f.label}</dt>
                  <dd className="text-right font-bold">{f.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </section>
  )
}