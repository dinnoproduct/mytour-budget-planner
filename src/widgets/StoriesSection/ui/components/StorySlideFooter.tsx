import { Box, Flex, Link, Text } from '@chakra-ui/react'
import React from 'react'
import { type StoryCta } from '../types'

interface StorySlideFooterProps {
  title: string
  shortDescription: string
  cta: StoryCta | null
}

export const StorySlideFooter: React.FC<StorySlideFooterProps> = ({
  title,
  shortDescription,
  cta,
}) => {
  if (!title && !shortDescription && !cta) return null

  return (
    <Box
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      bgGradient="linear(to-t, blackAlpha.800 0%, transparent 100%)"
      p={4}
      pt={12}
      zIndex={1000}
      // Disable Swiper swipe handling within the footer area (CTA button),
      // so taps on the button don't trigger slide navigation.
      data-swiper-no-swiping="true"
    >
      {title && (
        <Text color="white" fontSize="lg" fontWeight="bold" mb={1}>
          {title}
        </Text>
      )}
      {shortDescription && (
        <Text color="whiteAlpha.800" fontSize="sm" mb={3}>
          {shortDescription}
        </Text>
      )}
      {cta && (
        <Link
          href={cta.link}
          isExternal={cta.type === 'EXTERNAL'}
          _hover={{ textDecoration: 'none' }}
          zIndex={1000}
          display="block"
          // Ensure the CTA is clickable inside the swipeable stories slider:
          // stop propagation on all relevant events so Swiper/slider
          // doesn't interpret the tap as a slide gesture.
          onClickCapture={(e) => e.stopPropagation()}
          onMouseDownCapture={(e) => e.stopPropagation()}
          onTouchStartCapture={(e) => e.stopPropagation()}
        >
          <Flex
            justify="center"
            align="center"
            bg="white"
            color="gray.800"
            borderRadius="full"
            py={2.5}
            px={6}
            fontWeight="semibold"
            fontSize="sm"
            _hover={{ bg: 'gray.100' }}
          >
            {cta.title}
          </Flex>
        </Link>
      )}
    </Box>
  )
}
