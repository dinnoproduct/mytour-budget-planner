import React from 'react'
import { Box } from '@chakra-ui/react'
import { type LayoutProps } from '@widgets/PackageDetails/ui/types'

export const PackageDetailsLayout: React.FC<LayoutProps> = ({
  children,
  ...props
}) => (
  <Box
    maxWidth="1188px"
    width="full"
    mx="auto"
    {...props}
    px={{ base: 0, sm: 6 }}
    pt={{ base: 4, md: 6, lg: 10 }}
    pb={{ base: 10, md: 20, lg: 16 }}
  >
    {children}
  </Box>
)
