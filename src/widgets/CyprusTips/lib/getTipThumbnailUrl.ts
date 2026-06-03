import { type ExternalTip } from '@entities/notification'
import { getYoutubeVideoId } from './getYoutubeVideoId'

export const getTipThumbnailUrl = (tip: ExternalTip) => {
  if (tip.type === 'IMAGE') {
    return tip.mediaUrl
  }

  const videoId = getYoutubeVideoId(tip.mediaUrl)

  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  }

  return ''
}
