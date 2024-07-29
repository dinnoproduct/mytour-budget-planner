import { IconName } from './types'

export const isFillIcon = (
  iconName: IconName
): boolean => {
  const colorfulIcons = ['status-error', 'status-info', 'status-success', 'status-warning']
  return !colorfulIcons.some(colorfulIcon => iconName.includes(colorfulIcon))
}
