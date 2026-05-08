import React, { useEffect, useMemo, useState } from 'react'
import { AspectRatio, Box, Img, Fade, Link, Flex } from '@chakra-ui/react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { Navigation, EffectFade } from 'swiper/modules'
import { useBlogs, type BlogPost } from '@/entities/blog'
import { Layout } from './Layout'
import { Button, Heading, StatusOnImageBadge, Text } from '@ui'
import moment from 'moment/moment'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import { useTranslation } from 'react-i18next'

export const BlogsSlider = () => {
  const { t } = useTranslation()
  const { data: allBlogs = [], isLoading } = useBlogs()
  const blogs = useMemo(() => allBlogs.slice(0, 3), [allBlogs?.length])
  const [currentBlog, setCurrentBlog] = useState<BlogPost | null>(null)

  useEffect(() => {
    if (blogs.length > 0) {
      setCurrentBlog(blogs[0])
    }
  }, [blogs])

  const handleSlideChange = (swiper: any) => {
    setCurrentBlog(blogs[swiper.realIndex])
  }

  const getPublishDate = (date: string | Date) => {
    if (!date) {
      return ''
    }

    const momentDate = moment(date)
    const longMonthName = momentDate.locale('en').format('MMMM').toLowerCase()
    const shortMonthName = t(`${longMonthName}Short`).toUpperCase()

    return `${shortMonthName} ${momentDate.format('D')}, ${momentDate.format('YYYY')}`
  }

  return (
    <Layout>
      <Swiper
        modules={[Navigation, EffectFade]}
        effect="fade"
        slidesPerView={1}
        loop={blogs.length > 1}
        onSlideChange={handleSlideChange}
      >
        {blogs?.map((blog, index) => (
          <SwiperSlide key={index}>
            <Link href={blog.link} isExternal>
              <Box overflow="hidden" rounded={{ sm: '12px' }}>
                <AspectRatio
                  ratio={{ base: 375 / 193, sm: 768 / 450, lg: 1216 / 450 }}
                >
                  <Img src={blog.imageUrl} alt={blog.title} />
                </AspectRatio>
              </Box>
            </Link>
          </SwiperSlide>
        ))}
        <SwiperButtons />
      </Swiper>

      {currentBlog && (
        <Fade in={true}>
          <Flex
            width="full"
            px={{ sm: 8 }}
            position="relative"
            top={{ sm: '50%' }}
            transform={{ sm: 'translateY(-50%)' }}
            zIndex={3}
            justify="center"
          >
            <Link
              href={currentBlog.link}
              isExternal
              _hover={{ textDecoration: 'none' }}
              display="inline-block"
              maxW="800px"
            >
              <Box
                mt={{ base: 4, sm: 0 }}
                p={{ base: 6 }}
                rounded={{ sm: '12px' }}
                shadow={{ sm: 'md' }}

                bgColor="white"
                height={{ sm: '272px' }}
                position="relative"
              >
                <StatusOnImageBadge
                  status="specialOffer"
                  position="relative"
                  rounded="full"
                  width="fit-content"
                />

                <Box mt="2">
                  <Heading as="h3" size="sm" noOfLines={2}>
                    {currentBlog.title}
                  </Heading>

                  <Text mt={2} size="sm" noOfLines={3}>
                    {currentBlog.description}
                  </Text>
                </Box>

                <Text
                  variant="text-sm"
                  color="gray.600"
                  mt={{ base: 6, sm: 'auto' }}
                  position={{ sm: 'absolute' }}
                  bottom={{ sm: '24px' }}
                >
                  {getPublishDate(currentBlog.date)}
                </Text>
              </Box>
            </Link>
          </Flex>
        </Fade>
      )}
    </Layout>
  )
}

const SwiperButtons = () => {
  const swiper = useSwiper()

  return (
    <>
      <Button
        aria-label="Previous slide"
        icon="chevron-left"
        position="absolute"
        left={{ base: 4, sm: 8, lg: 6 }}
        top="50%"
        transform="translateY(-50%)"
        zIndex={2}
        variant="solid-gray"
        onClick={() => swiper.slidePrev()}
      />

      <Button
        aria-label="Next slide"
        icon="chevron-right"
        position="absolute"
        right={{ base: 4, sm: 8, lg: 6 }}
        top="50%"
        transform="translateY(-50%)"
        zIndex={2}
        variant="solid-gray"
        onClick={() => swiper.slideNext()}
      />
    </>
  )
}
