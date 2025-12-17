import React from 'react'
import { ApproximateDatePicker } from '@/entities/package/ui/ApproximateDatePicker/index.tsx'
import { MONTHS } from '@/shared/model/index.ts'
import moment from 'moment'

interface ApproximateDatesTabProps {
  searchData: {
    days?: number
    toDate?: Date | null
  }
  isResetState: boolean
  onConfirm: (data: { dateFrom: Date; dateTo: Date; days: number }) => void
}

export const ApproximateDatesTab: React.FC<ApproximateDatesTabProps> = ({
  searchData,
  isResetState,
  onConfirm
}) => {
  const defaultMonthValue = searchData.days
    ? MONTHS[moment(searchData.toDate).month()]
    : MONTHS[moment().add(1, 'month').month()]

  const daysValue = searchData.days ? String(searchData.days) : undefined

  return (
    <ApproximateDatePicker
      variant="hotel"
      defaultMonthValue={defaultMonthValue}
      daysValue={daysValue}
      isResetState={isResetState}
      onConfirm={onConfirm}
    />
  )
}

