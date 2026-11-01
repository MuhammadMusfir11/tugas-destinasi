const files = import.meta.glob('../assets/images/welcome.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})

export const welcomeSrc = Object.values(files)[0] ?? null