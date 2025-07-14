export type ApproximateDatePickerPropsType = {
  variant?: 'package' | 'hotel'
  monthValue?: string
  defaultMonthValue?: string
  daysValue?: string
  isResetState?: boolean
  onConfirm: (param: { days: number; dateFrom: Date; dateTo: Date }) => void
}

export type StayInfoType = {
  month: string
  day: string
}
