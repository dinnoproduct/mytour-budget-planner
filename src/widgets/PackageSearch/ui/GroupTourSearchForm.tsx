import React, { useMemo, useState } from 'react'
import { Layouts } from '@widgets/PackageSearch/ui/Layouts.tsx'
import { SearchButton } from './SearchButton'
import { useGroupToursList } from '@entities/package'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'
import { useTranslation } from 'react-i18next'
import { DestinationSelectMenu } from '@features/DestinationSelectMenu'
import { MonthSelectMenu, type MonthSelection } from '@features/MonthSelectMenu'

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

  const handleDestinationChange = (value: string) => {
    const next = selectedDestinations.includes(value)
      ? selectedDestinations.filter(item => item !== value)
      : [...selectedDestinations, value]

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

  return (
    <Layouts>
      <DestinationSelectMenu
        isOpen={isDestinationOpen}
        options={destinationOptions}
        selectedValues={selectedDestinations}
        onToggleOpen={() => setDestinationOpen(!isDestinationOpen)}
        onClose={() => setDestinationOpen(false)}
        onToggleDestination={handleDestinationChange}
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

      <SearchButton onClick={() => onSearch?.()} />
    </Layouts>
  )
}
