import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import { Icon, Text } from '@ui'
import { type SnackBarProps } from '@components/SnackBar/types.ts'

export const SnackBar = ({ title, status }: SnackBarProps) => (
  <Box
    maxWidth="400px"
    width="full"
    px="4"
    py="3"
    bgColor="gray.700"
    rounded="md"
  >
    <Flex align="center" width="full">
      <Icon name={STATUS_MAP[status].icon} size="24" />

      <Text
        fontWeight="normal"
        fontSize="md"
        ml="3"
        color={STATUS_MAP[status].color}
      >
        {title}
      </Text>
    </Flex>
  </Box>
)

const STATUS_MAP = {
  success: {
    color: 'green.500',
    icon: 'status-success'
  },
  error: {
    color: 'red.500',
    icon: 'status-error'
  }
}

export { toastStylesTheme } from './theme'
export { useSnackBar } from './useSnackBar.tsx'
