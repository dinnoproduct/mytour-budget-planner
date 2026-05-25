import { type DictionaryEntity } from '@entities/package'

export const getMealTypeLabel = (
  foodTypeKey: number | undefined | null,
  foodTypes: DictionaryEntity[],
  fallbackLabel: string
) => {
  if (!foodTypeKey) {
    return fallbackLabel
  }

  return (
    foodTypes.find(({ key }) => key === foodTypeKey)?.value ?? fallbackLabel
  )
}
