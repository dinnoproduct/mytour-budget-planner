import { Box, type BoxProps } from '@chakra-ui/react'
import React from 'react'

export const Layout = ({ children, ...props }: BoxProps) => (
  <Box as="section" py={{ base: 8, sm: 12, lg: 16 }} {...props}>
    <Box position="relative" maxW="1216px" mx="auto">
      {children}
    </Box>
  </Box>
)
