import React from 'react'
import { BlogsSectionLayout } from './Layout'
import { BlogCard } from '@/entities/blog'
import { useBlogs } from '@/entities/blog'

export const BlogsSection = () => {
  const { data: latestBlogs = [] } = useBlogs()

  return (
    <BlogsSectionLayout>
      {latestBlogs
        ?.slice(0, 3)
        .map((blog, index) => (
          <BlogCard
            key={index}
            title={blog.title}
            description={blog.description}
            date={blog.date}
            imageUrl={blog.imageUrl}
            link={blog.link}
          />
        ))}
    </BlogsSectionLayout>
  )
}
