import React from 'react'
import { Badge, Box } from '@chakra-ui/react'

type DotBadge = {
  dotSize?: string
  hasNotification?: boolean
  ariaLabel?: string
  children: React.ReactNode
}

export const DotBadge = ({
  dotSize = '8px',
  hasNotification = true,
  ariaLabel = 'Notification icon',
  children
}: DotBadge) => (
  <Box position="relative" display="inline-block" aria-label={ariaLabel}>
    {children}

    {hasNotification && (
      <Badge
        position="absolute"
        top="-2px"
        right="-2px"
        boxSize={dotSize}
        borderRadius="full"
        bg="red.500"
        border="2px solid white"
        p="0"
        m="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="transparent"
        aria-hidden="true"
      />
    )}
  </Box>
)
