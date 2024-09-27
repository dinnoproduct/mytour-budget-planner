import { DictionaryEntity } from '@entities/package'

export type RoomsMenuProps = {
	defaultRoom?: number
	onChange?: (roomId: number) => void
	rooms: RoomItem[]
}

type RoomItem = {
	id: number
	name: string
	price: number
}
