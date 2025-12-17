import { type BlogService } from './BlogService'

export class BlogUseCases {
  private readonly blogService: BlogService

  constructor({ blogService }: { blogService: BlogService }) {
    this.blogService = blogService
  }

  async getBlogs() {
    return this.blogService.getBlogs()
  }
}
