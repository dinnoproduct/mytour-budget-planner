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
}
