import React from 'react'
import { SearchCities } from './SearchCities.tsx'
import { DatePicker } from '@features/DatePicker'
import { SearchTravelers } from './SearchTravelers.tsx'
import { useTranslation } from 'react-i18next'
import { usePackagesSearchContext } from '@entities/package'
import { Button } from '@ui'

export const PackageSearchForm = ({ onSearch }: {onSearch?: () => void}) => {
	const { t } = useTranslation()
	const {
		searchData,
		handleSearch,
		setSearchData,
		availableDepartureDates,
		availableReturnDates,
		isLoadingReturnDates,
		handleFromDateClick
	} = usePackagesSearchContext()

	const handleAccept = (fromDate: Date | null, toDate?: Date | null) => {
		setSearchData({ fromDate, toDate })
	}

	const handleSearchClick = () => {
		handleSearch(searchData)
		onSearch && onSearch()
	}


	return (
		<>
			<SearchCities
				defaultSelectedCities={searchData.selectedCities}
				onChange={(selectedCities) => setSearchData({ selectedCities })}
			/>

			<DatePicker
				fromDate={searchData.fromDate}
				toDate={searchData.toDate}
				onAccept={handleAccept}
				onFromDateClick={handleFromDateClick}
				availableDepartureDates={availableDepartureDates}
				availableReturnDates={availableReturnDates}
				isLoadingReturnDates={isLoadingReturnDates}
			/>

			<SearchTravelers
				defaultData={searchData.travelersData}
				onChange={(travelersData) => setSearchData({ travelersData })}
			/>

			<Button
				size="lg"
				width={{ base: 'full', md: 'auto' }}
				onClick={handleSearchClick}
			>
				{t`search`}
			</Button>
		</>
	)
}