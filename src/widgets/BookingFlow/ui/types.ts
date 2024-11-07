import { type PackageEntity } from '@entities/package'
import { type Travelers } from '@widgets/TravelersModal/ui/types.ts'

export type BookingFlowProps = {
  packageDetails?: PackageEntity | null
  initialView: 'travelers' | 'payment'
  isOpen?: boolean
  onClose?: () => void
  childrenAges?: number[]
  requestId?: number
  defaultTravelers?: Travelers
}
