import React, { useEffect, useMemo } from 'react'
import { Box, Flex, VStack } from '@chakra-ui/react'
import {
  type PackageCity,
  useHotelPackagesSearchContext
} from '@entities/package'
import { useTranslation } from 'react-i18next'
import { Icon, Tabs, Text } from '@ui'
import { capitalize } from '@shared/utils'
import { HotelSearchForm } from '@widgets/PackageSearch/ui/HotelSearchForm.tsx'
import {
  HotelTabItem,
  PackageTabItem
} from '@widgets/PackageSearch/ui/TabItem.tsx'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'
import { getPluralForm } from '@shared/helpers/index.ts'

export const HotelSearchMenu = ({
  onTabChange,
  onFormOpen,
  onFormClose,
  isFormOpen,
  showTabs = true
}: any) => {
  const { t, i18n } = useTranslation()
  const { searchData, cities } = useHotelPackagesSearchContext()

  const formatDate = (date?: Date | null) => {
    if (!date) {
      return ''
    }

    const longMonthName = date
      .toLocaleString('en-US', { month: 'long' })
      .toLowerCase()
    const shortMonthName = t(`${longMonthName}Short`)

    return `${shortMonthName} ${date.getDate()}`
  }

  const getApproximateText = () => {
    if (!searchData.days || !searchData.fromDate) return ''

    const longMonthName = searchData.fromDate
      .toLocaleString('en-US', { month: 'long' })
      .toLowerCase()

    const month = t(longMonthName)

    return `${month.charAt(0).toUpperCase() + month.slice(1)}, ± ${t(
      getPluralForm(searchData.days, 'daysQuantity'),
      {
        day: searchData.days
      }
    )}`
  }

  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isFormOpen])

  const cityLabel = useMemo(() => {
      return cities
        .filter(c => Array.isArray(searchData.selectedCity) ? searchData.selectedCity.includes(c.id) : [searchData.selectedCity].includes(c.id))
        .map(c => c[`name${LANGUAGE_PREFIX[i18n.language as LanguageName]}` as keyof PackageCity
          ] || '')
        .join(', ')
    }, [searchData.selectedCity, cities, i18n.language]);

  const handleFormOpen = () => {
    onFormOpen()
  }

  const handleFormClose = () => {
    onFormClose()
  }

  return (
    <Box height="full" width="full">
      {isFormOpen && (
        <Box
          position="absolute"
          top="310px"
          left="0"
          width="100vw"
          height="100vh"
          bgColor="whiteAlpha.600"
          zIndex="-1"
          onClick={handleFormClose}
        />
      )}

      <Box width="full">
        <Box display={isFormOpen ? 'block' : 'none'}>
          <Flex
            justify="space-between"
            align="center"
            borderBottom="1px solid"
            borderColor="gray.100"
            width="full"
            p="3"
          >
            <Text size="sm" color="black">{t`edit`}</Text>

            <Box onClick={handleFormClose} cursor="pointer">
              <Icon name="close" size="24" color="blue.500" />
            </Box>
          </Flex>

          {showTabs && (
            <Tabs
              labels={[
                <PackageTabItem key="package-tab" />,
                <HotelTabItem key="hotel-tab" />
              ]}
              variant="line"
              align="center"
              mt="2"
              defaultIndex={1}
              onChange={onTabChange}
            >
              <></>
              <></>
            </Tabs>
          )}

          <VStack
            spacing="4"
            align="center"
            mt={showTabs ? '-2' : '0'}
            pb="3"
            pt={showTabs ? '0' : '3'}
            maxWidth="368px"
            mx="auto"
          >
            <HotelSearchForm onSearch={handleFormClose} />
          </VStack>
        </Box>

        <Box
          display={isFormOpen ? 'none' : 'block'}
          onClick={handleFormOpen}
          cursor="pointer"
          p="3"
          maxWidth="368px"
          mx="auto"
        >
          <Flex width="full" justify="space-between">
            <Text size="sm" color="black" noOfLines={1}>
              {cityLabel}
            </Text>
            <Icon name="edit-note" size="24" color="blue.500" />
          </Flex>

          <Text size="sm" color="gray.500" mt="2" noOfLines={1} align="left">
            {searchData.days && searchData.days > 0
              ? getApproximateText()
              : `${formatDate(searchData.fromDate)} - ${formatDate(
                  searchData.toDate
                )}`}{' '}
            •{' '}
            {searchData.travelersData.adultsCount +
              searchData.travelersData.childrenCount}{' '}
            {capitalize(t`traveler`)}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
