import { Box, Flex, IconButton, Text } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import React from 'react'

interface StorySlideHeaderProps {
  avatarUrl: string
  name: string
  onClose: () => void
}

export const StorySlideHeader: React.FC<StorySlideHeaderProps> = ({
  avatarUrl,
  name,
  onClose,
}) => (
  <Flex
    position="absolute"
    top={0}
    pt={6}
    left={0}
    right={0}
    px={2}
    align="center"
    justify="space-between"
    gap={2}
    bgGradient="linear(to-b, blackAlpha.600 0%, transparent 100%)"
    zIndex={1}
  >
    <Flex align="center" gap={2}>
      <Box
        as="img"
        src={avatarUrl}
        alt={name}
        width="32px"
        height="32px"
        borderRadius="full"
        objectFit="cover"
        flexShrink={0}
      />
      <Text color="white" fontSize="sm" fontWeight="semibold" noOfLines={1}>
        {name}
      </Text>
    </Flex>
    <IconButton
      aria-label="Close story viewer"
      icon={<CloseIcon />}
      zIndex={10000}
      onClick={onClose}
      bg="transparent"
      color="white"
      size="sm"
      _hover={{ bg: 'transparent', opacity: 0.7 }}
    />
  </Flex>
)
