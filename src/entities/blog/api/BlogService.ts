import axios from 'axios'
import { type BlogPost, type MediumFeedResponse } from './types'

export class BlogService {
  private readonly api
  private readonly mediumFeedUrl = 'https://api.rss2json.com/v1/api.json'
  private readonly mediumBlogUrl = 'https://medium.com/feed/@mytour.am'

  constructor() {
    this.api = axios.create({
      baseURL: this.mediumFeedUrl
    })
  }

  private extractImageFromContent(content: string): string {
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/i
    const match = imgRegex.exec(content)

    return match ? match[1] : 'https://via.placeholder.com/800x400'
  }

  private stripHTML(html: string): string {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html

    return tempDiv.textContent || tempDiv.innerText || ''
  }

  private transformMediumPost(post: MediumFeedResponse['items'][0]): BlogPost {
    return {
      title: post.title,
      description: this.stripHTML(post.description).substring(0, 120) + '...',
      date: new Date(post.pubDate),
      imageUrl: this.extractImageFromContent(post.content),
      link: post.link
    }
  }

  async getBlogs(): Promise<BlogPost[]> {
    try {
      const response = await this.api.get<MediumFeedResponse>('', {
        params: {
          rss_url: this.mediumBlogUrl
        }
      })

      if (response.data.status !== 'ok' || !response.data.items) {
        throw new Error('Failed to fetch Medium feed or no items available')
      }

      return response.data.items.map(post => this.transformMediumPost(post))
    } catch (error) {
      console.error('Error fetching latest blogs:', error)

      return []
    }
  }
}
