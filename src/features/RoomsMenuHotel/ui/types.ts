import { type RoomItem } from '../model'

export type RoomsMenuHotelProps = {
  defaultRoomId: number
  defaultMealId: number
  onChange?: (roomId: number, mealType: number) => void
  rooms: RoomItem[]
  priceType?: 'room' | 'package'
}
