import React, { useEffect, useMemo, useState } from 'react'
import { Box, Flex, VStack } from '@chakra-ui/react'
import { Icon, Tabs, Text } from '@ui'
import {
  GroupTabItem,
  HotelTabItem,
  PackageTabItem
} from '@widgets/PackageSearch/ui/TabItem.tsx'
import { GroupTourSearchForm } from './GroupTourSearchForm'
import { useTranslation } from 'react-i18next'
import type { MonthSelection } from '@features/MonthSelectMenu'
import { useSearchParams } from 'react-router-dom'

const MONTH_INDEX_BY_KEY: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11
}

export const GroupSearchMenu = ({
  onTabChange,
  onFormOpen,
  onFormClose,
  isFormOpen,
  showTabs = true
}: any) => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedTab, setSelectedTab] = useState(2)
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([])
  const [selectedMonths, setSelectedMonths] = useState<MonthSelection[]>([])

  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isFormOpen])

  const handleTabChange = (index: number) => {
    setSelectedTab(index)
    onTabChange?.(index)
  }

  const handleSearch = () => {
    const monthsParam = selectedMonths
      .map(item => {
        const monthIndex = MONTH_INDEX_BY_KEY[item.month] ?? 0
        return `${item.year}-${String(monthIndex + 1).padStart(2, '0')}`
      })
      .join(',')

    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('tab', 'group-tours')
    if (monthsParam.length > 0) {
      nextParams.set('groupTourMonths', monthsParam)
    } else {
      nextParams.delete('groupTourMonths')
    }
    setSearchParams(nextParams, { replace: true })

    onFormClose?.()
  }

  const summary = useMemo(() => {
    const destination = selectedDestinations.join(', ') || t`destination`
    const month =
      selectedMonths.length > 0
        ? Array.from(new Set(selectedMonths.map(item => t(item.month)))).join(', ')
        : t`month`

    return `${destination} • ${month}`
  }, [selectedDestinations, selectedMonths, t])

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
          onClick={onFormClose}
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
            <Text size="sm" color="black">
              Edit
            </Text>

            <Box onClick={onFormClose} cursor="pointer">
              <Icon name="close" size="24" color="blue.500" />
            </Box>
          </Flex>

          {showTabs && (
            <Tabs
              labels={[
                <PackageTabItem key="package-tab" />,
                <HotelTabItem key="hotel-tab" />,
                <GroupTabItem key="group-tab" />
              ]}
              variant="line"
              align="center"
              mt="2"
              index={selectedTab}
              onChange={handleTabChange}
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
            <GroupTourSearchForm
              selectedDestinations={selectedDestinations}
              selectedMonths={selectedMonths}
              onDestinationChange={setSelectedDestinations}
              onMonthChange={setSelectedMonths}
              onSearch={() => { handleSearch() }}
            />
          </VStack>
        </Box>

        <Box
          display={isFormOpen ? 'none' : 'block'}
          onClick={onFormOpen}
          cursor="pointer"
          p="3"
          maxWidth="368px"
          mx="auto"
        >
          <Flex width="full" justify="space-between">
            <Text size="sm" color="black" noOfLines={1}>
              Group tours
            </Text>
            <Icon name="edit-note" size="24" color="blue.500" />
          </Flex>

          <Text size="sm" color="gray.500" mt="2" noOfLines={1} align="left">
            {summary}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
