import React from 'react'
import { Box, Flex, type BoxProps } from '@chakra-ui/react'
import { Header } from '@widgets/Header'
import { Footer } from '@components/Footer'

interface FooterProps {
  mt?: any
}

interface PageLayoutProps extends BoxProps {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
  footerProps?: FooterProps
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  footerProps,
  ...props
}) => {
  return (
    <Flex
      direction="column"
      minHeight="100dvh"
      overflowX="hidden"
      {...props}
    >
      {showHeader && <Header />}
      <Box flex="1 0 auto" width="full" display="flex" flexDirection="column" minH={0}>
        {children}
      </Box>
      {showFooter && <Footer {...footerProps} />}
    </Flex>
  )
}

