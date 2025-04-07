import { BlogService } from './BlogService'
import { BlogUseCases } from './BlogUseCases'

export const blogUseCases = new BlogUseCases({
  blogService: new BlogService()
})

export * from './types'
