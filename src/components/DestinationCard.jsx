import { img } from '../lib/images'

export default function DestinationCard({ d, index, onOpen, clone = false }) {
  const src = img(d.id)

  return (
    <button
      type="button"
      tabIndex={clone ? -1 : 0}
      aria-hidden={clone || undefined}
      aria-label={`Buka detail ${d.name}`}
      onClick={(e) => onOpen(d, index, e.currentTarget)}
      className="frame-thin group h-[62vh] max-h-[560px] min-h-[380px] w-[min(74vw,330px)] shrink-0 select-none text-left"
    >
      <span className="relative block h-full w-full overflow-hidden rounded-[4px] bg-ink">
        {src ? (
          <img
            src={src}
            alt={clone ? '' : `${d.name}, Tahura Djuanda`}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-forest group-hover:scale-[1.06]"
            style={{ filter: 'sepia(0.3) contrast(1.05) saturate(0.9)' }}
          />
        ) : (
          <span className="absolute inset-0 bg-linear-to-b from-sepia to-ink" />
        )}

        <span className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/10 to-transparent transition-opacity duration-700 group-hover:from-ink/95" />

        <span className="absolute left-4 top-4 font-news text-[0.6rem] tracking-[0.3em] text-paper/80">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="absolute inset-x-4 bottom-5 translate-y-1 transition-transform duration-700 ease-forest group-hover:translate-y-0">
          <span className="block font-news text-[0.55rem] uppercase tracking-[0.3em] text-gold">{d.tag}</span>
          <span className="mt-2 block font-headline text-2xl font-bold leading-tight text-paper md:text-3xl">
            {d.name}
          </span>
        </span>
      </span>
    </button>
  )
}