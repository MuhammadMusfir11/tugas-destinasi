import { img } from '../lib/images'

export default function HistoryItem({ e, flip }) {
  const src = img(e.id)

  return (
    <article className="h-row grid min-h-[78vh] grid-cols-[28px_1fr] content-center items-center gap-x-4 py-12 md:min-h-[88vh] md:grid-cols-[1fr_56px_1fr]">
      {/* Titik di jalur */}
      <div className="col-start-1 row-span-2 row-start-1 self-center md:col-start-2 md:row-span-1">
        <span
          data-node
          className="h-node mx-auto grid h-6 w-6 place-items-center rounded-full border-2 border-ink bg-paper"
        >
          <span className="h-2 w-2 rounded-full bg-rust" />
        </span>
      </div>

      {/* Foto seperti cetakan lama */}
      <figure
        className={`col-start-2 row-start-1 md:row-start-1 ${
          flip ? 'md:col-start-3 md:pl-8' : 'md:col-start-1 md:pr-8'
        }`}
      >
        <div
          className={`h-photo bg-[#f1e6c8] p-2 shadow-[0_12px_28px_rgba(43,29,18,0.3)] ${
            flip ? 'rotate-[1.2deg]' : '-rotate-[1.2deg]'
          }`}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-sepia/40">
            {src ? (
              <img
                className="h-img absolute left-0 top-[-8%] h-[116%] w-full object-cover"
                style={{ filter: 'sepia(0.35) contrast(1.05) saturate(0.85)' }}
                src={src}
                alt={`${e.title}, ${e.year}`}
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-linear-to-b from-sepia/70 to-ink/80">
                <span className="font-headline text-4xl font-black text-paper/60">{e.year}</span>
              </div>
            )}
          </div>
        </div>
      </figure>

      {/* Teks */}
      <div
        className={`h-text col-start-2 row-start-2 pt-8 md:row-start-1 md:pt-0 ${
          flip ? 'md:col-start-1 md:pr-8 md:text-right' : 'md:col-start-3 md:pl-8'
        }`}
      >
        <p className="font-headline text-[clamp(2.4rem,6vw,5rem)] font-black leading-none text-rust">{e.year}</p>
        <h3 className="mt-3 font-headline text-2xl font-bold leading-tight md:text-3xl">{e.title}</h3>
        <p
          className={`mt-4 max-w-md font-news text-[0.92rem] leading-[1.75] text-ink/90 ${
            flip ? 'md:ml-auto' : ''
          }`}
        >
          {e.desc}
        </p>
      </div>
    </article>
  )
}