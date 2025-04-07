import React from 'react'
import { Box, Container, Flex, type BoxProps } from '@chakra-ui/react'

export const BlogsListLayout: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box py={16} bg="gray.50" {...props}>
    <Container maxW="container.xl">
      <Flex align="center" width="full" direction="column">
        {children}
      </Flex>
    </Container>
  </Box>
)
