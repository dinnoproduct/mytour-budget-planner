import { useTranslation } from 'react-i18next'
import moment from 'moment'

export const formatDate = (date?: Date | string) => {
	if (!date) {
		return ''
	}

	const { t } = useTranslation()

	const formattedDate = moment(date).format('YYYY, HH:mm')
	const longMonthName = moment(date).locale('en').format('MMMM').toLowerCase()
	const shortMonthName = t(`${longMonthName}Short`)
	const day = moment(date).format('DD')

	return `${shortMonthName} ${day} ${formattedDate}`
}