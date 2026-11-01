export const chapters = [
  { id: 'hero', label: 'Beranda', tone: 'light' },
  { id: 'about', label: 'About', tone: 'light' },
  { id: 'destinasi', label: 'Destinasi', tone: 'light' },
  { id: 'history', label: 'History', tone: 'light' },
  { id: 'visi-misi', label: 'Visi & Misi', tone: 'light' },
  { id: 'kelompok', label: 'Kelompok', tone: 'light' },
  { id: 'kontak', label: 'Kontak', tone: 'light' },
]

export function goTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (window.__lenis) {
    window.__lenis.scrollTo(el, {
      duration: 1.8,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}