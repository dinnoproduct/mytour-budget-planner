import { type PackageEntity, type NormalizedRequestEntity } from '@entities/package'
import { type Travelers } from '@widgets/TravelersModal/ui/types.ts'

export type BookingFlowProps = {
  packageDetails?: PackageEntity | null
  initialView: 'travelers' | 'payment'
  isOpen?: boolean
  onClose?: () => void
  childrenAges?: number[]
  request?: NormalizedRequestEntity | null
  defaultTravelers?: Travelers
  isBooked?: boolean
}
