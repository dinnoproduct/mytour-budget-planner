export interface BlogPost {
  title: string
  description: string
  date: Date
  imageUrl: string
  link: string
}

export interface MediumFeedResponse {
  status: string
  feed: {
    url: string
    title: string
    link: string
    author: string
    description: string
    image: string
  }
  items: Array<{
    title: string
    pubDate: string
    link: string
    guid: string
    author: string
    thumbnail: string
    description: string
    content: string
    categories: string[]
  }>
}
