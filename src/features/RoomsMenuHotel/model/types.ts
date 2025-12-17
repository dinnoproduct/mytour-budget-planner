export type RoomItem = {
  id: number
  name: string
  price: number
  meals: {
    mealType: number
    mealName: string
    offerId: number
    price: number
    priceInCurrency: number
    currency: string
  }[]
}

export type RoomWithSelectedMeal = RoomItem & {
  selectedMealId?: number
}
