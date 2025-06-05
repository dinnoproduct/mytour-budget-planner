import { CURRENCY_MAP } from '@/shared/model'
import { type RoomWithSelectedMeal } from '../model'
import { numberWithCommaNormalizer } from '@/utils/normalizers'

export const getRoomPriceString = (room: RoomWithSelectedMeal) => {
  const selectedMeal = room.selectedMealId
    ? room.meals.find(meal => meal.mealType === room.selectedMealId)
    : room.meals[0]

  if (!selectedMeal) return ''

  return `${numberWithCommaNormalizer(selectedMeal.price || room.price)} ֏ ~ ${selectedMeal.priceInCurrency} ${
    CURRENCY_MAP[
      selectedMeal.currency?.toUpperCase() as keyof typeof CURRENCY_MAP
    ]
  }`
}
