export type ApproximateDatePickerPropsType = {
  variant?: 'package' | 'hotel'
  monthValue?: string
  defaultMonthValue?: string
  nightsValue?: string
  isResetState?: boolean
  onConfirm: (param: { nights: number; dateFrom: Date; dateTo: Date }) => void
}

export type StayInfoType = {
  month: string
  night: string
}
