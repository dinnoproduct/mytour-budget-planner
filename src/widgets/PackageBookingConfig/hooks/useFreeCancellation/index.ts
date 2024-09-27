import { useMemo } from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

const specialDays = ['12-30', '12-31', '01-01', '01-02']

export const useFreeCancellation = (arrivalDate: Date, departureDate: Date) => {
	const {t} = useTranslation()
	const formatDate = (date?: moment.Moment) => {
		if (!date) return ''

		const longMonthName = date.locale('en').format('MMMM').toLowerCase() // Get month name in English
		const shortMonthName = t(`${longMonthName}Short`)
		return `${shortMonthName} ${date.format('D')}, ${date.format('YYYY')}`
	}

	const isSpecialDayInRange = (arrivalDate: moment.Moment, departureDate: moment.Moment) => {
		let currentDate = moment(arrivalDate)

		while (currentDate.isSameOrBefore(departureDate, 'day')) {
			const monthDay = currentDate.format('MM-DD')
			if (specialDays.includes(monthDay)) return true
			currentDate = currentDate.add(1, 'day')
		}
		return false
	}

	const shouldShowCancellationMessage = (departureDate: moment.Moment) => {
		const currentDate = moment()
		const daysDifference = departureDate.diff(currentDate, 'days')

		return daysDifference >= 31
	}

	const getCancellationDate = (arrivalDate: moment.Moment, departureDate: moment.Moment) => {
		if (isSpecialDayInRange(arrivalDate, departureDate)) return null

		if (shouldShowCancellationMessage(departureDate)) {
			const freeCancellationDate = departureDate.clone().subtract(31, 'days')
			return formatDate(freeCancellationDate)
		}

		return null
	}

	return useMemo(() => {
		const arrivalMoment = moment(arrivalDate)
		const departureMoment = moment(departureDate)

		const freeCancellationDate = getCancellationDate(arrivalMoment, departureMoment)
		const showFreeCancellation = !!freeCancellationDate

		return {
			showFreeCancellation,
			freeCancellationDate,
		}
	}, [arrivalDate, departureDate])
}
