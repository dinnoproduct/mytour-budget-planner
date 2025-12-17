export type RoomsMenuProps = {
  defaultRoom?: number
  onChange?: (roomId: number) => void
  rooms: RoomItem[]
  priceType?: 'room' | 'package'
}

type RoomItem = {
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
