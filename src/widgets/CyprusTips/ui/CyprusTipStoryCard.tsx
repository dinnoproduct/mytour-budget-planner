'use client'

import { Box, Flex, Image, Text, VStack } from '@chakra-ui/react'
import { type ExternalTip } from '@entities/notification'
import { useTranslation } from 'react-i18next'
import { getTipLocalizedText } from '../lib/getTipLocalizedText'
import { getTipThumbnailUrl } from '../lib/getTipThumbnailUrl'
import {
  getTipStoryCardWidth,
  TIP_STORY_CARD_HEIGHT,
} from '../model/constants'

type CyprusTipStoryCardProps = {
  tip: ExternalTip
  cardHeight: number
  onClick: () => void
}

export const CyprusTipStoryCard = ({
  tip,
  cardHeight,
  onClick,
}: CyprusTipStoryCardProps) => {
  const { i18n } = useTranslation()
  const title = getTipLocalizedText(tip.title, i18n.language)
  const thumbnailUrl = getTipThumbnailUrl(tip)
  const cardWidth = getTipStoryCardWidth(cardHeight)

  return (
    <VStack spacing={3} align="center" w={`${cardWidth}px`} flexShrink={0}>
      <Box
        as="button"
        type="button"
        onClick={onClick}
        w={`${cardWidth}px`}
        h={`${cardHeight}px`}
        rounded="2xl"
        overflow="hidden"
        position="relative"
        bg="gray.100"
        cursor="pointer"
        p={0}
        border="none"
        _hover={{ opacity: 0.92 }}
        _focusVisible={{ outline: '2px solid', outlineColor: 'blue.500' }}
      >
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            w="full"
            h="full"
            objectFit="cover"
          />
        ) : null}

        {tip.type === 'VIDEO' ? (
          <Flex
            position="absolute"
            inset={0}
            align="center"
            justify="center"
            bg="blackAlpha.300"
          >
            <Flex
              w="48px"
              h="48px"
              rounded="full"
              bg="whiteAlpha.900"
              align="center"
              justify="center"
            >
              <Box
                w={0}
                h={0}
                borderTop="10px solid transparent"
                borderBottom="10px solid transparent"
                borderLeft="16px solid"
                borderLeftColor="blue.500"
                ml="6px"
              />
            </Flex>
          </Flex>
        ) : null}
      </Box>

      {title ? (
        <Text
          fontSize="sm"
          fontWeight="medium"
          color="gray.800"
          textAlign="center"
          noOfLines={2}
          w="full"
          px={1}
        >
          {title}
        </Text>
      ) : null}
    </VStack>
  )
}
