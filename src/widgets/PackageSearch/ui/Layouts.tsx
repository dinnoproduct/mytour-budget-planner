import { Box, Flex, Stack, type StackProps } from '@chakra-ui/react'
import type { LayoutProps } from '@widgets/PackageSearch/ui/types.ts'
import { packageSearchVariants } from '@widgets/PackageSearch/ui/theme.ts'
import { Tabs } from '@ui'
import React from 'react'
import {
  HotelTabItem,
  PackageTabItem
} from '@widgets/PackageSearch/ui/TabItem.tsx'

export const Layout = ({
  children,
  contentProps,
  containerProps,
  variant,
  defaultTabIndex,
  onTabChange
}: LayoutProps) => (
  <Box
    position="relative"
    width="full"
    zIndex="1"
    {...packageSearchVariants[variant].wrapper}
  >
    <Box
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      width="full"
      bgColor="white"
      {...containerProps}
      {...packageSearchVariants[variant].container}
    >
      <Flex height="full" {...packageSearchVariants[variant].contentWrapper}>
        <Box
          rounded="xl"
          {...packageSearchVariants[variant].content}
          {...contentProps}
        >
          <Tabs
            labels={[
              <PackageTabItem key="package-tab" />,
              <HotelTabItem key="hotel-tab" />
            ]}
            variant="line"
            align="center"
            defaultIndex={defaultTabIndex}
            onChange={onTabChange}
          >
            {children}
          </Tabs>
        </Box>
      </Flex>
    </Box>
  </Box>
)

export const LayoutFixed = ({
  children,
  contentProps,
  containerProps
}: LayoutProps) => (
  <Box position="relative" width="full" zIndex="1" height="80px">
    <Box
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      width="full"
      bgColor="white"
      {...containerProps}
      height="auto"
      position="fixed"
      borderBottom="1px solid"
      borderColor="gray.100"
    >
      <Flex height="full" maxWidth="full" width="full">
        <Box rounded="xl" {...contentProps} width="full">
          {children}
        </Box>
      </Flex>
    </Box>
  </Box>
)

export const Layouts = (props: StackProps) => (
  <Stack
    direction={{ base: 'column', md: 'row' }}
    spacing={{ base: 4, md: 2 }}
    px={{ base: 4, md: '6' }}
    zIndex="1"
    width="full"
    align="center"
    justify="center"
    {...props}
  />
)
