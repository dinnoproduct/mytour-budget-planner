import { type RequestEntity } from '@entities/package'
import { type Travelers } from '@widgets/TravelersModal/ui/types.ts'

export type NormalizedRequestEntity = Omit<RequestEntity, 'notes'> & {
  notes: {
    childrenAges: number[]
    isSoldOut: boolean
    totalTravelersCount: number
    adultTravelersCount: number
    travelers: Travelers
  }
}
