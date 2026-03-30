import React, { useMemo, useState } from 'react'
import { Layouts } from '@widgets/PackageSearch/ui/Layouts.tsx'
import { SearchButton } from './SearchButton'
import { useGroupToursList } from '@entities/package'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'
import { useTranslation } from 'react-i18next'
import { DestinationSelectMenu } from '@features/DestinationSelectMenu'
import { MonthSelectMenu, type MonthSelection } from '@features/MonthSelectMenu'
import { useSearchParams } from 'react-router-dom'

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
  selectedDestinations?: string[]
  selectedMonths?: MonthSelection[]
  onDestinationChange?: (value: string[]) => void
  onMonthChange?: (value: MonthSelection[]) => void
  onSearch?: () => void
}

export const GroupTourSearchForm: React.FC<GroupTourSearchFormProps> = ({
  selectedDestinations: selectedDestinationsProp,
  selectedMonths: selectedMonthsProp,
  onDestinationChange,
  onMonthChange,
  onSearch
}) => {
  const { i18n, t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: groupToursData } = useGroupToursList({ page: 1, limit: 100 })
  const [isDestinationOpen, setDestinationOpen] = useState(false)
  const [isMonthOpen, setMonthOpen] = useState(false)
  const [localDestinations, setLocalDestinations] = useState<string[]>([])
  const [localMonths, setLocalMonths] = useState<MonthSelection[]>([])
  const selectedDestinations = selectedDestinationsProp ?? localDestinations
  const selectedMonths = selectedMonthsProp ?? localMonths
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
    const uniqueValues = new Set<string>()

    tours.forEach(tour => {
      tour.routeCountries?.forEach(country => {
        const value = country[languageKey] ?? country.eng ?? country.arm
        if (value) uniqueValues.add(value)
      })
    })

    return Array.from(uniqueValues)
  }, [groupToursData?.data, languageKey])

  const monthOptions = useMemo(
    () => MONTH_VALUES.map(value => ({ value, label: t(value) })),
    [t]
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
        options={destinationOptions}
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
