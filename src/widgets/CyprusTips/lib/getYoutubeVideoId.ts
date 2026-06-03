export const getYoutubeVideoId = (url: string) => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/,
  )

  return match?.[1] ?? null
}
