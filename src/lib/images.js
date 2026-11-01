const files = import.meta.glob('../assets/images/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})

export function img(name) {
  const key = Object.keys(files).find(
    (k) => k.split('/').pop().replace(/\.[^.]+$/, '') === name
  )
  return key ? files[key] : null
}