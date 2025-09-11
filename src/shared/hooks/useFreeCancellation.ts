import { useMemo } from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

const SPECIAL_DAYS = ['12-30', '12-31', '01-01', '01-02']

export const useFreeCancellation = (fromDate: Date, toDate: Date) => {
  const { t } = useTranslation()

  const formatDate = (dateMoment?: moment.Moment) => {
    if (!dateMoment) return ''

    const longMonthName = dateMoment.locale('en').format('MMMM').toLowerCase() // Get month name in English
    const shortMonthName = t(`${longMonthName}Short`)

    return `${shortMonthName} ${dateMoment.format('D')}, ${dateMoment.format('YYYY')}`
  }

  const isSpecialDayInRange = (
    fromDateMoment: moment.Moment,
    toDateMoment: moment.Moment
  ) => {
    let currentDate = moment(fromDateMoment)

    while (currentDate.isSameOrBefore(toDateMoment, 'day')) {
      const monthDay = currentDate.format('MM-DD')
      if (SPECIAL_DAYS.includes(monthDay)) return true
      currentDate = currentDate.add(1, 'day')
    }

    return false
  }

  const shouldShowCancellationMessage = (fromDateMoment: moment.Moment) => {
    const currentDate = moment()
    const daysDifference = fromDateMoment.diff(currentDate, 'days')

    return daysDifference >= 31
  }

  const getCancellationDate = (
    fromDateMoment: moment.Moment,
    toDateMoment: moment.Moment
  ) => {
    if (isSpecialDayInRange(fromDateMoment, toDateMoment)) {
      return null
    }

    if (shouldShowCancellationMessage(fromDateMoment)) {
      const freeCancellationDate = fromDateMoment.clone().subtract(31, 'days')

      return formatDate(freeCancellationDate)
    }

    return null
  }

  const cancellationDate = useMemo(() => {
    const fromDateMoment = moment(fromDate)
    const toDateMoment = moment(toDate)

    const freeCancellationDate = getCancellationDate(
      fromDateMoment,
      toDateMoment
    )
    const showFreeCancellation = !!freeCancellationDate

    return {
      showFreeCancellation,
      freeCancellationDate
    }
  }, [fromDate, toDate])

  return cancellationDate
}
