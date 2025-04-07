import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { type BlogPost, blogUseCases } from '../api'

export const useBlogs = (
  options?: Omit<UseQueryOptions<BlogPost[]>, 'queryFn' | 'queryKey'>
) =>
  useQuery({
    ...(options || {}),
    queryFn: () => blogUseCases.getBlogs(),
    queryKey: ['blogs']
  })
