"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { Box, Flex, VStack } from '@chakra-ui/react'
import { Icon, Tabs, Text } from '@ui'
import {
  GroupTabItem,
  HotelTabItem,
  PackageTabItem
} from '@widgets/PackageSearch/ui/TabItem'
import { GroupTourSearchForm } from './GroupTourSearchForm'
import { useTranslation } from 'react-i18next'
import type { MonthSelection } from '@features/MonthSelectMenu'
import { useSearchParams } from '@shared/lib/router'
import { useGroupToursList } from '@entities/package'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'

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

const MONTH_KEY_BY_INDEX: Record<number, string> = {
  0: 'january',
  1: 'february',
  2: 'march',
  3: 'april',
  4: 'may',
  5: 'june',
  6: 'july',
  7: 'august',
  8: 'september',
  9: 'october',
  10: 'november',
  11: 'december'
}

const MONTH_INDEX_BY_VALUE: Record<string, number> = {
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
  december: 11,
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
  const routeCountriesParam = searchParams.get('groupTourRouteCountries') || ''
  const monthsParam = searchParams.get('groupTourMonths') || ''
  const currentTab = searchParams.get('tab') || 'hotels'
  const [selectedTab, setSelectedTab] = useState(currentTab === 'group-tours' ? 2 : 0)
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([])
  const [selectedMonths, setSelectedMonths] = useState<MonthSelection[]>([])
  const { i18n } = useTranslation()
  const shouldLoadGroupTours = selectedTab === 2 || currentTab === 'group-tours' || !!isFormOpen
  const { data: groupToursData } = useGroupToursList(undefined, {
    enabled: shouldLoadGroupTours
  })

  const languageKey = useMemo(
    () =>
      (LANGUAGE_PREFIX[i18n.language as LanguageName] ?? 'Eng').toLowerCase() as
      | 'eng'
      | 'arm'
      | 'rus',
    [i18n.language]
  )

  const destinationOptions = useMemo(() => {
    const tours = groupToursData?.data ?? []
    const optionsByKey = new Map<
      string,
      { key: string; label: string; searchTerms: string[] }
    >()

    tours.forEach(tour => {
      tour.routeCountries?.forEach(country => {
        const key = (country.eng || country.arm || country.rus || '').trim()
        if (!key) return

        const label = (
          country[languageKey] ||
          country.eng ||
          country.arm ||
          country.rus
        )?.trim()

        const searchTerms = [country.eng, country.arm, country.rus]
          .map(value => value?.trim())
          .filter((value): value is string => !!value)

        optionsByKey.set(key, {
          key,
          label: label || key,
          searchTerms,
        })
      })
    })

    return Array.from(optionsByKey.values())
  }, [groupToursData?.data, languageKey])

  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isFormOpen])

  useEffect(() => {
    setSelectedTab(currentTab === 'group-tours' ? 2 : 0)
  }, [currentTab])

  useEffect(() => {
    const destinations = routeCountriesParam
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
    if (destinations.length > 0) {
      setSelectedDestinations(Array.from(new Set(destinations)))
    } else {
      // When URL has no country filter (e.g. after reload/tab change cleanup)
      // clear local selection so default "select all" effect can re-apply.
      setSelectedDestinations([])
    }

    const months = monthsParam
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
      .map(item => {
        const [yearRaw, monthRaw] = item.split('-')
        const year = Number(yearRaw)
        if (!Number.isFinite(year)) return null

        const numericMonth = Number(monthRaw)
        if (Number.isFinite(numericMonth) && numericMonth >= 1 && numericMonth <= 12) {
          const month = MONTH_KEY_BY_INDEX[numericMonth - 1]
          return month ? { month, year } : null
        }

        const monthIndex = MONTH_INDEX_BY_KEY[monthRaw?.toLowerCase() || '']
        if (monthIndex === undefined) return null

        return { month: MONTH_KEY_BY_INDEX[monthIndex], year }
      })
      .filter((item): item is MonthSelection => item !== null)
    setSelectedMonths(months)
  }, [routeCountriesParam, monthsParam])

  useEffect(() => {
    // Initial default: when there is no country filter in URL,
    // preselect all countries once options are loaded.
    if (routeCountriesParam.length > 0) return
    if (selectedDestinations.length > 0) return
    if (destinationOptions.length === 0) return

    setSelectedDestinations(destinationOptions.map(option => option.key))
  }, [routeCountriesParam, selectedDestinations.length, destinationOptions])

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
    const destinationsParam = selectedDestinations.join(',')

    setSearchParams(
      prev => {
        const nextParams = new URLSearchParams(prev)
        nextParams.set('tab', 'group-tours')
        if (monthsParam.length > 0) {
          nextParams.set('groupTourMonths', monthsParam)
        } else {
          nextParams.delete('groupTourMonths')
        }
        if (destinationsParam.length > 0) {
          nextParams.set('groupTourRouteCountries', destinationsParam)
        } else {
          nextParams.delete('groupTourRouteCountries')
        }
        return nextParams
      },
      { replace: true }
    )

    onFormClose?.()
  }

  const summary = useMemo(() => {
    const destinationLabelByKey = new Map(
      destinationOptions.map(option => [option.key, option.label])
    )
    const destination = selectedDestinations.length > 0
      ? selectedDestinations
        .map(value => destinationLabelByKey.get(value) ?? value)
        .join(', ')
      : t`destination`
    const month =
      selectedMonths.length > 0
        ? [...selectedMonths]
          .sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year
            return (MONTH_INDEX_BY_VALUE[a.month] ?? 99) - (MONTH_INDEX_BY_VALUE[b.month] ?? 99)
          })
          .map(item => t(item.month))
          .join(', ')
        : t`month`

    return `${destination} • ${month}`
  }, [destinationOptions, selectedDestinations, selectedMonths, t])

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
              destinationOptions={destinationOptions}
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
