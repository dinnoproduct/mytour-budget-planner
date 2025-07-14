import {
  HOTEL_DAYS_OPTIONS,
  PACKAGE_DAYS_OPTIONS
} from '../model/constants'
import { type ApproximateDatePickerPropsType } from '../ui/types'

export const getDefaultDayValue = (
  variant: ApproximateDatePickerPropsType['variant'],
  value?: string
) => {
  if (variant === 'package') {
    return { day: value ?? PACKAGE_DAYS_OPTIONS[0].value, isOther: false }
  }

  const defaultValue = HOTEL_DAYS_OPTIONS[0].value

  if (!value) return { day: defaultValue, isOther: false }

  const isOther =
    +value !== +HOTEL_DAYS_OPTIONS[0].value &&
    +value !== +HOTEL_DAYS_OPTIONS[1].value &&
    +value !== +HOTEL_DAYS_OPTIONS[2].value

  return {
    day: isOther ? 'other' : String(value),
    isOther,
    actualValue: value
  }
}
