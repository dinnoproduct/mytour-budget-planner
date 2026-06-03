import { getYoutubeVideoId } from './getYoutubeVideoId'

export const getYoutubeEmbedUrl = (url: string) => {
  const videoId = getYoutubeVideoId(url)

  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}
