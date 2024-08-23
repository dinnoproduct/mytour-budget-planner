import { IconName } from './types'

export const isFillIcon = (
  iconName: IconName | string
): boolean => {
  const colorfulIcons = [
    'status-error', 'status-info', 'status-success', 'status-warning', 'flag', 'facebook', 'instagram', 'linkedin'
  ]
  return !colorfulIcons.some(colorfulIcon => iconName.includes(colorfulIcon))
}
