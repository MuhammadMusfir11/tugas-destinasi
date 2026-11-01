const files = import.meta.glob('../assets/images/hero.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})

export const heroSrc = Object.values(files)[0] ?? null