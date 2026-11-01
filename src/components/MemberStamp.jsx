import { img } from '../lib/images'

const ROT = [-1.5, 1.2, -0.8, 1.6, -1.2, 0.9, -1.4]

export default function MemberStamp({ m, index, onOpen }) {
  const src = img(m.id)
  const initials = m.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

  return (
    <button
      type="button"
      aria-label={`Lihat foto ${m.name}`}
      onClick={(e) => onOpen(index, e.currentTarget.getBoundingClientRect(), e.currentTarget)}
      className="mb-stamp group block w-full text-left transition-transform duration-500 ease-forest hover:-translate-y-2 [filter:drop-shadow(0_8px_10px_rgba(43,29,18,0.28))]"
      style={{ rotate: `${ROT[index % ROT.length]}deg` }}
    >
      <span className="stamp block bg-[#efe3c3] p-3 sm:p-4">
        <span className="block border border-ink/50 p-1 sm:p-1.5">
          <span className="relative block aspect-[4/5] overflow-hidden bg-sepia/40">
            {src ? (
              <img
                src={src}
                alt={`Foto ${m.name}`}
                loading="lazy"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-forest group-hover:scale-[1.05]"
                style={{ filter: 'sepia(0.3) contrast(1.05) saturate(0.88)' }}
              />
            ) : (
              <span className="absolute inset-0 grid place-items-center bg-linear-to-b from-sepia/60 to-ink/70 font-headline text-4xl font-black text-paper/60 sm:text-5xl">
                {initials}
              </span>
            )}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-1 top-1 hidden h-12 w-12 -rotate-12 place-items-center rounded-full border-2 border-rust/50 text-center text-[0.38rem] font-bold leading-tight tracking-[0.1em] text-rust/70 mix-blend-multiply sm:grid"
            >
              TAHURA
              <br />
              2026
            </span>
          </span>
        </span>

        <span className="mt-2.5 flex items-end justify-between gap-2 sm:mt-3">
          <span className="min-w-0">
            <span className="block min-h-[2.1em] font-headline text-[0.7rem] font-black uppercase leading-[1.05] opacity-80 transition-opacity duration-500 group-hover:opacity-100 sm:min-h-0 sm:text-[0.82rem]">
              {m.name}
            </span>
            <span className="mt-1 block font-news text-[0.58rem] tracking-[0.08em] text-sepia sm:text-[0.62rem] sm:tracking-[0.12em]">
              NIM {m.nim}
            </span>
          </span>
          <span className="hidden shrink-0 border border-rust/60 px-1.5 py-0.5 font-news text-[0.55rem] tracking-[0.15em] text-rust sm:block">
            {String(index + 1).padStart(2, '0')}
          </span>
        </span>

        <span aria-hidden="true" className="mt-2.5 block text-center font-news text-[0.5rem] tracking-[0.6em] text-ink/40 sm:mt-3">
          • • • • • • •
        </span>
      </span>
    </button>
  )
}