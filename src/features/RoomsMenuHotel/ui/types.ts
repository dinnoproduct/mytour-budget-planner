export type RoomsMenuHotelProps = {
  defaultRoom?: number
  onChange?: (roomId: number, mealType: number) => void
  rooms: RoomItem[]
  priceType?: 'room' | 'package'
}

export type RoomItem = {
  id: number
  name: string
  price: number
  mealType: number
  mealName: string
  meals: {
    mealType: number
    mealName: string,
    offerId: number
    price: number,
  }[]
}

export type RoomWithSelectedMeal = RoomItem & {
  selectedMealId?: number
}
