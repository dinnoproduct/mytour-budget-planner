"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { Layouts } from '@widgets/PackageSearch/ui/Layouts'
import { SearchButton } from './SearchButton'
import { useTranslation } from 'react-i18next'
import { DestinationSelectMenu } from '@features/DestinationSelectMenu'
import { MonthSelectMenu, type MonthSelection } from '@features/MonthSelectMenu'
import { useSearchParams } from '@shared/lib/router'
import { useGroupToursList } from '@entities/package'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'

const MONTH_VALUES = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
]

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

interface GroupTourSearchFormProps {
  destinationOptions?: { key: string; label: string; searchTerms: string[] }[]
  selectedDestinations?: string[]
  selectedMonths?: MonthSelection[]
  onDestinationChange?: (value: string[]) => void
  onMonthChange?: (value: MonthSelection[]) => void
  onSearch?: () => void
}

export const GroupTourSearchForm: React.FC<GroupTourSearchFormProps> = ({
  destinationOptions = [],
  selectedDestinations: selectedDestinationsProp,
  selectedMonths: selectedMonthsProp,
  onDestinationChange,
  onMonthChange,
  onSearch
}) => {
  const { i18n, t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isDestinationOpen, setDestinationOpen] = useState(false)
  const [isMonthOpen, setMonthOpen] = useState(false)
  const [localDestinations, setLocalDestinations] = useState<string[]>([])
  const [localMonths, setLocalMonths] = useState<MonthSelection[]>([])
  const selectedDestinations = selectedDestinationsProp ?? localDestinations
  const selectedMonths = selectedMonthsProp ?? localMonths
  const { data: groupToursData } = useGroupToursList(undefined, {
    enabled: destinationOptions.length === 0
  })

  const languageKey = useMemo(
    () =>
      (LANGUAGE_PREFIX[i18n.language as LanguageName] ?? 'Eng').toLowerCase() as
      | 'eng'
      | 'arm'
      | 'rus',
    [i18n.language]
  )

  const resolvedDestinationOptions = useMemo(() => {
    if (destinationOptions.length > 0) {
      return destinationOptions
    }

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

        optionsByKey.set(key, { key, label: label || key, searchTerms })
      })
    })

    return Array.from(optionsByKey.values())
  }, [destinationOptions, groupToursData?.data, languageKey])

  useEffect(() => {
    if (selectedDestinationsProp) return

    const destinations = (searchParams.get('groupTourRouteCountries') || '')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
    if (destinations.length > 0) {
      setLocalDestinations(Array.from(new Set(destinations)))
    } else {
      setLocalDestinations([])
    }
  }, [searchParams, selectedDestinationsProp])

  useEffect(() => {
    if (selectedDestinationsProp) return

    const hasCountryFilter = !!(searchParams.get('groupTourRouteCountries') || '').trim()
    if (hasCountryFilter) return
    if (localDestinations.length > 0) return
    if (resolvedDestinationOptions.length === 0) return

    // Initial default: select all when URL doesn't contain country filter.
    setLocalDestinations(resolvedDestinationOptions.map(option => option.key))
  }, [
    searchParams,
    selectedDestinationsProp,
    localDestinations.length,
    resolvedDestinationOptions
  ])

  useEffect(() => {
    if (selectedMonthsProp) return

    const months = (searchParams.get('groupTourMonths') || '')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
      .map(item => {
        const [yearRaw, monthRaw] = item.split('-')
        const year = Number(yearRaw)
        if (!Number.isFinite(year)) return null

        const numericMonth = Number(monthRaw)
        if (Number.isFinite(numericMonth) && numericMonth >= 1 && numericMonth <= 12) {
          const month = MONTH_VALUES[numericMonth - 1]
          return month ? { month, year } : null
        }

        const monthIndex = MONTH_INDEX_BY_KEY[monthRaw?.toLowerCase() || '']
        if (monthIndex === undefined) return null
        return { month: MONTH_VALUES[monthIndex], year }
      })
      .filter((item): item is MonthSelection => item !== null)

    setLocalMonths(months)
  }, [searchParams, selectedMonthsProp])

  const monthOptions = useMemo(
    () => MONTH_VALUES.map(value => ({ value, label: t(value) })),
    [i18n.language, t]
  )

  const handleDestinationChange = (next: string[]) => {
    if (onDestinationChange) {
      onDestinationChange(next)
    } else {
      setLocalDestinations(next)
    }
  }

  const handleMonthChange = (value: MonthSelection[]) => {
    if (onMonthChange) {
      onMonthChange(value)
    } else {
      setLocalMonths(value)
    }
  }

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch()
      return
    }

    const monthsParam = selectedMonths
      .map(item => {
        const monthIndex = MONTH_INDEX_BY_KEY[item.month] ?? 0
        return `${item.year}-${String(monthIndex + 1).padStart(2, '0')}`
      })
      .join(',')
    const destinationsParam = selectedDestinations.join(',')

    const nextParams = new URLSearchParams(searchParams)
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
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <Layouts>
      <DestinationSelectMenu
        isOpen={isDestinationOpen}
        options={resolvedDestinationOptions}
        selectedValues={selectedDestinations}
        onToggleOpen={() => setDestinationOpen(!isDestinationOpen)}
        onClose={() => setDestinationOpen(false)}
        onApply={values => {
          handleDestinationChange(values)
          setDestinationOpen(false)
        }}
      />

      <MonthSelectMenu
        isOpen={isMonthOpen}
        options={monthOptions}
        selectedValues={selectedMonths}
        onToggleOpen={() => setMonthOpen(!isMonthOpen)}
        onClose={() => setMonthOpen(false)}
        onApply={values => {
          handleMonthChange(values)
          setMonthOpen(false)
        }}
      />

      <SearchButton onClick={handleSearchClick} />
    </Layouts>
  )
}
