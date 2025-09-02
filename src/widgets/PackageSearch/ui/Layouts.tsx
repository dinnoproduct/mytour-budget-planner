import { Box, Flex, Stack, type StackProps } from '@chakra-ui/react'
import type { LayoutProps } from '@widgets/PackageSearch/ui/types.ts'
import { packageSearchVariants } from '@widgets/PackageSearch/ui/theme.ts'
import {Tabs, Text} from '@ui'
import React from 'react'
import {
  HotelTabItem,
  PackageTabItem
} from '@widgets/PackageSearch/ui/TabItem.tsx'
import {useTranslation} from "react-i18next";

export const Layout = ({
  className,
  children,
  contentProps,
  containerProps,
  variant,
  defaultTabIndex,
  onTabChange,
  showTabs = true
}: LayoutProps) => {

  const { t } = useTranslation()
  return (
  <Box
    className={className}
    position="relative"
    width="full"
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
          w={{base: 'full', md: 'auto'}}
          {...packageSearchVariants[variant].content}
          {...contentProps}
        >
          {showTabs ? <Text fontSize={{base: '24px', sm: '30px'}} py={{base: '6', sm: '10'}} color='white' textAlign='center' fontWeight='bold'>
            {t`planTrip`}
          </Text> : null}
          <Tabs
            labels={[
              <HotelTabItem key="hotel-tab"/>,
              <PackageTabItem key="package-tab"/>
            ]}
            variant="line"
            align="center"
            defaultIndex={defaultTabIndex}
            onChange={onTabChange}
            showTabs={showTabs}
          >
            {children}
          </Tabs>
        </Box>
      </Flex>
    </Box>
  </Box>
)}

export const LayoutFixed = ({
  children,
  contentProps,
  containerProps
}: LayoutProps) => (
  <Box position="relative" width="full" zIndex="99999" height="80px">
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
    {...props}
    direction={{ base: 'column', md: 'row' }}
    spacing={{ base: 4, md: 2 }}
    px={{ base: 4, md: '6' }}
    width="full"
    align="center"
    justify="center"
  />
)
