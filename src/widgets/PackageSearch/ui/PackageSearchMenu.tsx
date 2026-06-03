import React, { useEffect, useMemo, useState } from 'react'
import { Box, Flex, VStack } from '@chakra-ui/react'
import { PackageSearchForm } from './PackageSearchForm'
import { type PackageCity, usePackagesSearchContext } from '@entities/package'
import { useTranslation } from 'react-i18next'
import { Icon, Tabs, Text } from '@ui'
import { capitalize } from '@shared/utils'
import {
  CyprusTabItem,
  HotelTabItem,
  GroupTabItem,
  PackageTabItem,
} from '@widgets/PackageSearch/ui/TabItem'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'

export const PackageSearchMenu = ({
  onTabChange,
  onFormOpen,
  onFormClose,
  isFormOpen,
  showTabs = true
}: any) => {
  const { t, i18n } = useTranslation()
  const { searchData, cities } = usePackagesSearchContext()
  const [selectedTab, setSelectedTab] = useState(2)

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

  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isFormOpen])

  const cityLabel = useMemo(
    () =>
      (cities.find(city => searchData.selectedCity === city.id)?.[
        `name${LANGUAGE_PREFIX[i18n.language as LanguageName]}` as keyof PackageCity
      ] || '') as string,
    [searchData.selectedCity, cities, i18n.language]
  )

  const handleFormOpen = () => {
    onFormOpen()
  }

  const handleFormClose = () => {
    onFormClose()
  }

  const handleTabChange = (index: number) => {
    setSelectedTab(index)
    if (onTabChange) {
      onTabChange(index)
    }
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
            justify="flex-end"
            align="center"
            width="full"
            p="3"
          >
            <Box onClick={handleFormClose} cursor="pointer">
              <Icon name="close" size="24" color="white" />
            </Box>
          </Flex>

          {showTabs && (
            <Tabs
              labels={[
                <CyprusTabItem key="cyprus-tab" />,
                <HotelTabItem key="hotel-tab" />,
                <PackageTabItem key="package-tab" />,
                <GroupTabItem key="group-tab" />,
              ]}
              variant="line"
              mt="2"
              index={selectedTab}
              onChange={handleTabChange}
              align="center"
            >
              <></>
            </Tabs>
          )}

          <VStack
            spacing="4"
            align="center"
            mt={showTabs ? "-2" : "0"}
            pb="3"
            pt={showTabs ? "0" : "3"}
            maxWidth={{ base: "full", md: "368px" }}
            mx="auto"
            background="linear-gradient(177.92deg, #017BFE 1.7%, #00CFFF 98.21%)"
          >
            <PackageSearchForm onSearch={handleFormClose} />
          </VStack>
        </Box>

        <Box
          display={isFormOpen ? 'none' : 'block'}
          onClick={handleFormOpen}
          cursor="pointer"
          p="3"
          bgColor="white"
          maxWidth={{ base: "full", md: "368px" }}
          mx="auto"
        >
          <Flex width="full" justify="space-between">
            <Text size="sm" color="black" noOfLines={1}>
              {cityLabel}
            </Text>
            <Icon name="edit-note" size="24" color="blue.500" />
          </Flex>

          <Text size="sm" color="gray.500" mt="2" noOfLines={1} align="left">
            {formatDate(searchData.fromDate)} - {formatDate(searchData.toDate)}{' '}
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
