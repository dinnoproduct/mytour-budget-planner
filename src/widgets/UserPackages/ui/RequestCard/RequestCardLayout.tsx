import { Box, type BoxProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'

type Props = { children: ReactNode | ReactNode[] } & BoxProps

export const Layout = ({ children, ...props }: Props) => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="space-between"
    maxWidth="362px"
    width="full"
    rounded="lg"
    overflow="hidden"
    border="1px solid"
    borderColor="gray.200"
    height="100%"
    {...props}
  >
    {children}
  </Box>
)

