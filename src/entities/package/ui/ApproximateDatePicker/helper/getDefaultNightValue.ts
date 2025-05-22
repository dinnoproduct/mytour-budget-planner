import {
  HOTEL_NIGHTS_OPTIONS,
  PACKAGE_NIGHTS_OPTIONS
} from '../model/constants'
import { type ApproximateDatePickerPropsType } from '../ui/types'

export function getDefaultNightValue(
  variant: ApproximateDatePickerPropsType['variant'],
  value?: string
) {
  if (variant === 'package') {
    return { night: value ?? PACKAGE_NIGHTS_OPTIONS[0].value, isOther: false }
  }

  const defaultValue = HOTEL_NIGHTS_OPTIONS[0].value

  if (!value) return { night: defaultValue, isOther: false }

  const isOther =
    +value !== +HOTEL_NIGHTS_OPTIONS[0].value &&
    +value !== +HOTEL_NIGHTS_OPTIONS[1].value &&
    +value !== +HOTEL_NIGHTS_OPTIONS[2].value

  return {
    night: isOther ? 'other' : String(value),
    isOther,
    actualValue: value
  }
}
