export default function Footer() {
  return (
    <footer className="relative px-6 pb-24 pt-6 text-ink md:px-12 md:pb-14">
      <div className="mx-auto max-w-6xl">
        <div className="border-t-[3px] border-double border-ink" />
        <div className="mt-6 grid gap-5 text-center md:grid-cols-3 md:items-center md:text-left">
          <p className="font-headline text-sm font-black uppercase leading-snug tracking-[0.15em]">
            Sosiologi Pariwisata
            <span className="block text-rust">Kelompok 1</span>
          </p>
          <p className="font-news text-[0.75rem] italic text-sepia md:text-center">
            Taman Hutan Raya Ir. H. Djuanda
          </p>
          <p className="font-news text-[0.65rem] tracking-[0.3em] text-sepia md:text-right">© 2026</p>
        </div>
      </div>
    </footer>
  )
}