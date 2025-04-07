import React from 'react'
import { type BoxProps, SimpleGrid } from '@chakra-ui/react'
import { BlogCard } from '@/entities/blog'
import { useBlogs } from '@/entities/blog'
import { BlogsListLayout } from './Layout'

export const BlogsList = (props: BoxProps) => {
  const { data: blogs = [], isLoading } = useBlogs()

  return (
    <BlogsListLayout {...props}>
      <SimpleGrid
        columns={{ base: 1, sm: 2, lg: 3 }}
        spacing={8}
        width="max-content"
        maxW="full"
      >
        {blogs.map((blog, index) => (
          <BlogCard
            key={index}
            title={blog.title}
            description={blog.description}
            date={blog.date}
            imageUrl={blog.imageUrl}
            link={blog.link}
          />
        ))}
      </SimpleGrid>
    </BlogsListLayout>
  )
}
